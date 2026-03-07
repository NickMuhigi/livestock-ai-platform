"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ShieldAlert } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type DistrictDatum = {
  district: string;
  total: number;
  diseases: Record<string, number>;
};

type DiseaseDatum = {
  diseaseKey: string;
  total: number;
};

type HotspotResponse = {
  success: boolean;
  summary: {
    totalDistricts: number;
    totalDiseasedCases: number;
  };
  districts: DistrictDatum[];
  diseases: DiseaseDatum[];
  generatedAt: string;
};

const CHART_COLORS = [
  "#e11d48",
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#7c3aed",
  "#db2777",
  "#0d9488",
  "#ea580c",
  "#0891b2",
  "#65a30d",
];

function formatDiseaseLabel(key: string): string {
  return key
    .toLowerCase()
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function formatGeneratedTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "just now";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DiseaseHotspots({ embedded = false }: { embedded?: boolean }) {
  const [payload, setPayload] = useState<HotspotResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const response = await fetch("/api/research/hotspots", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to load hotspot analytics");
        }

        const data = (await response.json()) as HotspotResponse;
        if (!cancelled) {
          setPayload(data);
        }
      } catch {
        if (!cancelled) {
          setPayload(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const diseaseKeys = useMemo(
    () => payload?.diseases.map((disease) => disease.diseaseKey) || [],
    [payload]
  );

  const districtChartData = useMemo(() => {
    if (!payload) return [];

    return payload.districts.map((district) => {
      const row: Record<string, string | number> = {
        district: district.district,
        total: district.total,
      };

      for (const diseaseKey of diseaseKeys) {
        row[diseaseKey] = district.diseases[diseaseKey] || 0;
      }

      return row;
    });
  }, [payload, diseaseKeys]);

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};

    diseaseKeys.forEach((diseaseKey, index) => {
      config[diseaseKey] = {
        label: formatDiseaseLabel(diseaseKey),
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });

    return config;
  }, [diseaseKeys]);

  const topDistrict = payload?.districts[0];
  const topDisease = payload?.diseases[0];
  const chartDistricts = payload?.districts.slice(0, 8) || [];

  return (
    <section id={!embedded ? "analytics" : undefined} className={`relative overflow-hidden ${embedded ? "py-0" : "py-24 lg:py-32"} ${!embedded ? "scroll-mt-28" : ""}`}>
      <div className={embedded ? "relative z-10" : "mx-auto max-w-6xl px-6 lg:px-8 relative z-10"}>
        {!embedded ? (
          <div className="mb-10">
            <h2 className="text-4xl font-black text-foreground md:text-5xl">
              Disease Hotspots By District
            </h2>
            <p className="mt-3 max-w-3xl text-base text-muted-foreground">
              Research-grade spatial trend tracking from uploaded livestock analyses. Compare outbreak intensity across districts and identify dominant diseases faster.
            </p>
            {!loading && payload ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Last updated: {formatGeneratedTime(payload.generatedAt)}
              </p>
            ) : null}
          </div>
        ) : null}

        {!loading && payload ? (
          <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Diseased Cases</p>
              <p className="mt-1 text-3xl font-black text-foreground">{payload.summary.totalDiseasedCases}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Districts Affected</p>
              <p className="mt-1 text-3xl font-black text-foreground">{payload.summary.totalDistricts}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Highest-Burden District</p>
              <p className="mt-1 text-lg font-bold text-foreground">{topDistrict?.district || "-"}</p>
              <p className="text-xs text-muted-foreground">{topDistrict?.total || 0} recorded diseased cases</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Most Reported Disease</p>
              <p className="mt-1 text-lg font-bold text-foreground">{topDisease ? formatDiseaseLabel(topDisease.diseaseKey) : "-"}</p>
              <p className="text-xs text-muted-foreground">{topDisease?.total || 0} total cases</p>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-8 text-sm text-muted-foreground">
            Loading hotspot analytics...
          </div>
        ) : !payload || payload.districts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-8">
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              No diseased district data is available yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-12">
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-6 xl:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">District Burden Breakdown</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Stacked distribution of disease reports across top affected districts.</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                  <Activity className="h-3 w-3" />
                  Top 8 districts
                </span>
              </div>

              <ChartContainer
                className="mt-4 h-[390px] w-full"
                config={chartConfig}
              >
                <BarChart data={districtChartData.slice(0, 8)} margin={{ left: 6, right: 6, top: 8, bottom: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="district"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={-18}
                    textAnchor="end"
                    height={68}
                  />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {diseaseKeys.map((diseaseKey, index) => (
                    <Bar
                      key={diseaseKey}
                      dataKey={diseaseKey}
                      stackId="cases"
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      radius={index === diseaseKeys.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </div>

            <div className="space-y-6 xl:col-span-4">
              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-6">
                <h3 className="text-lg font-bold text-foreground">Disease Share</h3>
                <p className="mt-1 text-xs text-muted-foreground">Portfolio of disease prevalence across all reported cases.</p>

                <ChartContainer className="mt-4 h-[240px]" config={chartConfig}>
                  <PieChart>
                    <Pie
                      data={payload.diseases}
                      dataKey="total"
                      nameKey="diseaseKey"
                      innerRadius={44}
                      outerRadius={84}
                      paddingAngle={2}
                    >
                      {payload.diseases.map((item, index) => (
                        <Cell
                          key={item.diseaseKey}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name) => [
                            value,
                            formatDiseaseLabel(String(name)),
                          ]}
                        />
                      }
                    />
                  </PieChart>
                </ChartContainer>

                <div className="mt-4 space-y-2">
                  {payload.diseases.map((disease, index) => (
                    <div key={disease.diseaseKey} className="flex items-center justify-between rounded-lg bg-secondary/40 px-2.5 py-2 text-xs">
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <span
                          className="h-2.5 w-2.5 rounded-[3px]"
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        />
                        {formatDiseaseLabel(disease.diseaseKey)}
                      </span>
                      <span className="font-semibold text-foreground">{disease.total}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-6">
                <h3 className="inline-flex items-center gap-2 text-lg font-bold text-foreground">
                  <ShieldAlert className="h-4 w-4 text-orange-600" />
                  District Intelligence
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">Rapid view of where intervention pressure is highest.</p>

                <div className="mt-4 space-y-3">
                  {chartDistricts.map((district, index) => {
                    const share = payload.summary.totalDiseasedCases
                      ? Math.round((district.total / payload.summary.totalDiseasedCases) * 100)
                      : 0;
                    return (
                      <div key={district.district}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">{index + 1}. {district.district}</span>
                          <span className="text-muted-foreground">{district.total} cases ({share}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-600 to-red-600"
                            style={{ width: `${Math.min(share, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-xl border border-border/70 bg-secondary/40 p-3 text-xs text-muted-foreground">
                  <p>Total diseased cases: <span className="font-semibold text-foreground">{payload.summary.totalDiseasedCases}</span></p>
                  <p className="mt-1">Districts represented: <span className="font-semibold text-foreground">{payload.summary.totalDistricts}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
