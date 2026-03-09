import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type DistrictDiseaseGroup = {
  uploadDistrict: string | null;
  uploadLatitude: number | null;
  uploadLongitude: number | null;
  detectedDisease: string | null;
  total: number;
};

const RWANDA_DISTRICTS = [
  { name: "Bugesera", lat: -2.024, lon: 30.604 },
  { name: "Gatsibo", lat: -1.943, lon: 30.755 },
  { name: "Kayonza", lat: -2.109, lon: 30.949 },
  { name: "Kirehe", lat: -2.282, lon: 31.197 },
  { name: "Ngoma", lat: -2.442, lon: 30.673 },
  { name: "Kigali City", lat: -1.95, lon: 30.06 },
  { name: "Muhanga", lat: -2.024, lon: 30.604 },
  { name: "Nyarugenge", lat: -1.96, lon: 30.045 },
  { name: "Kamonyi", lat: -1.898, lon: 29.998 },
  { name: "Kicukiro", lat: -1.946, lon: 30.062 },
  { name: "Gasabo", lat: -1.94, lon: 30.138 },
  { name: "Rulindo", lat: -1.449, lon: 29.569 },
  { name: "Musanze", lat: -1.477, lon: 29.649 },
  { name: "Gicumbi", lat: -1.631, lon: 29.953 },
  { name: "Gakenke", lat: -1.782, lon: 30.039 },
  { name: "Burera", lat: -1.551, lon: 29.793 },
  { name: "Nyabihu", lat: -1.831, lon: 29.461 },
  { name: "Rubavu", lat: -1.485, lon: 29.268 },
  { name: "Rusizi", lat: -2.496, lon: 29.015 },
  { name: "Karongi", lat: -2.061, lon: 29.255 },
  { name: "Rutsiro", lat: -2.229, lon: 29.387 },
  { name: "Huye", lat: -2.605, lon: 29.746 },
  { name: "Nyanza", lat: -2.508, lon: 29.819 },
  { name: "Nyamagabe", lat: -2.703, lon: 29.674 },
  { name: "Nyaruguru", lat: -2.929, lon: 29.236 },
];

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestRwandaDistrict(latitude: number, longitude: number): string | null {
  if (!RWANDA_DISTRICTS.length) return null;
  let nearest = RWANDA_DISTRICTS[0];
  let minDistance = haversineKm(latitude, longitude, nearest.lat, nearest.lon);

  for (const district of RWANDA_DISTRICTS.slice(1)) {
    const distance = haversineKm(latitude, longitude, district.lat, district.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = district;
    }
  }

  return minDistance < 80 ? nearest.name : null;
}

function normalizeDistrict(raw?: string | null, latitude?: number | null, longitude?: number | null): string | null {
  const value = raw?.trim();
  if (value && !/^near\s+-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/i.test(value)) {
    const upper = value.toUpperCase();
    const matched = RWANDA_DISTRICTS.find((district) => upper.includes(district.name.toUpperCase()));
    if (matched) return matched.name;
    return value;
  }

  if (latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined) {
    return findNearestRwandaDistrict(latitude, longitude);
  }

  return null;
}

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
        "uploadLatitude",
        "uploadLongitude",
        "detectedDisease",
        COUNT(*)::int AS total
      FROM "analyses"
      WHERE "uploadDistrict" IS NOT NULL
      GROUP BY "uploadDistrict", "uploadLatitude", "uploadLongitude", "detectedDisease"
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
      const district = normalizeDistrict(
        row.uploadDistrict,
        row.uploadLatitude,
        row.uploadLongitude
      );
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
