import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DistrictDiseaseGroup = {
  uploadDistrict: string | null;
  detectedDisease: string | null;
  total: number;
};

function normalizeDiseaseKey(value: string): string {
  return value.trim().toUpperCase();
}

function isHealthyDisease(value: string): boolean {
  const key = normalizeDiseaseKey(value);
  return key === "HEALTHY";
}

export async function GET() {
  try {
    const grouped = await prisma.$queryRaw<DistrictDiseaseGroup[]>`
      SELECT
        "uploadDistrict",
        "detectedDisease",
        COUNT(*)::int AS total
      FROM "analyses"
      WHERE "uploadDistrict" IS NOT NULL
      GROUP BY "uploadDistrict", "detectedDisease"
    `;

    const districtMap = new Map<
      string,
      {
        district: string;
        total: number;
        diseases: Record<string, number>;
      }
    >();

    const diseaseTotals = new Map<string, number>();

    for (const row of grouped) {
      const district = row.uploadDistrict?.trim();
      if (!district) continue;

      const rawDisease = row.detectedDisease?.trim();
      if (!rawDisease) continue;

      const diseaseKey = normalizeDiseaseKey(rawDisease);
      if (isHealthyDisease(diseaseKey)) continue;

      const count = row.total;
      const existingDistrict = districtMap.get(district) || {
        district,
        total: 0,
        diseases: {},
      };

      existingDistrict.total += count;
      existingDistrict.diseases[diseaseKey] =
        (existingDistrict.diseases[diseaseKey] || 0) + count;
      districtMap.set(district, existingDistrict);

      diseaseTotals.set(diseaseKey, (diseaseTotals.get(diseaseKey) || 0) + count);
    }

    const districts = Array.from(districtMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 12);

    const diseases = Array.from(diseaseTotals.entries())
      .map(([diseaseKey, total]) => ({ diseaseKey, total }))
      .sort((a, b) => b.total - a.total);

    return NextResponse.json({
      success: true,
      summary: {
        totalDistricts: districts.length,
        totalDiseasedCases: diseases.reduce((acc, item) => acc + item.total, 0),
      },
      districts,
      diseases,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to build disease hotspot analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch disease hotspot analytics" },
      { status: 500 }
    );
  }
}
