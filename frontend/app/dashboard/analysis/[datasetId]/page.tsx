"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Database,
  Globe2,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DashboardLayout from "@/features/dashboard/components/dashboard-layout";

import {
  generateIntelligence,
  type CrimeType,
  type DatasetIntelligence,
  type IntelligenceResponse,
  type Neighborhood,
} from "@/features/analysis/intelligence-api";

/* =========================================================
   TYPES
========================================================= */

interface PageProps {
  params: Promise<{
    datasetId: string;
  }>;
}

interface ChartPoint {
  label: string;
  value: number;
}

interface ForecastPoint {
  period: string | number;
  prediction: number;
}

interface HotspotItem {
  [key: string]: unknown;
}

/* =========================================================
   HELPERS
========================================================= */

function formatNumber(value: number | undefined | null) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

function formatPercentage(value: number | undefined | null) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "—";
  }

  return `${value.toFixed(1)}%`;
}

function safeString(value: unknown, fallback = "—") {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  return String(value);
}

function getRiskClass(level?: string) {
  switch (level?.toUpperCase()) {
    case "CRITICAL":
      return "border-red-500/30 bg-red-500/10 text-red-400";

    case "HIGH":
      return "border-orange-500/30 bg-orange-500/10 text-orange-400";

    case "MEDIUM":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";

    case "LOW":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

    default:
      return "border-slate-500/30 bg-slate-500/10 text-slate-400";
  }
}

function getRiskRingClass(level?: string) {
  switch (level?.toUpperCase()) {
    case "CRITICAL":
      return "border-red-500/50 shadow-[0_0_60px_rgba(239,68,68,0.15)]";

    case "HIGH":
      return "border-orange-500/50 shadow-[0_0_60px_rgba(249,115,22,0.15)]";

    case "MEDIUM":
      return "border-yellow-500/50 shadow-[0_0_60px_rgba(234,179,8,0.15)]";

    default:
      return "border-emerald-500/50 shadow-[0_0_60px_rgba(16,185,129,0.15)]";
  }
}

function objectToChartData(
  object: Record<string, number> | undefined,
): ChartPoint[] {
  if (!object) {
    return [];
  }

  return Object.entries(object)
    .map(([label, value]) => ({
      label,
      value: Number(value) || 0,
    }))
    .sort((a, b) => {
      const aNum = Number(a.label);
      const bNum = Number(b.label);

      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return aNum - bNum;
      }

      return a.label.localeCompare(b.label);
    });
}

/* =========================================================
   REUSABLE UI
========================================================= */

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10">
        <Icon className="h-5 w-5 text-violet-400" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-400">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-slate-900/80">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-400/5 blur-3xl transition group-hover:bg-violet-400/10" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>

          <Icon className="h-5 w-5 text-violet-400/70" />
        </div>

        <p className="mt-4 truncate text-3xl font-bold tracking-tight text-white">
          {value}
        </p>

        {description && (
          <p className="mt-1 text-xs text-slate-600">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value?: number;
    name?: string;
  }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
      <p className="text-xs font-medium text-slate-500">
        {safeString(label)}
      </p>

      <p className="mt-1 text-sm font-bold text-violet-400">
        {formatNumber(Number(payload[0]?.value) || 0)}
      </p>
    </div>
  );
}

/* =========================================================
   CRIME DISTRIBUTION
========================================================= */

function CrimeDistribution({
  crimes,
}: {
  crimes: CrimeType[];
}) {
  const data = crimes.slice(0, 8);

  return (
    <Panel>
      <SectionHeader
        icon={BarChart3}
        eyebrow="Dataset intelligence"
        title="Crime Distribution"
        description="Most frequent crime categories in the analyzed dataset."
      />

      {data.length === 0 ? (
        <EmptyState text="No crime category data available." />
      ) : (
        <div className="space-y-5">
          {data.map((crime, index) => {
            const maximum = Math.max(
              ...data.map((item) => item.count),
              1,
            );

            const percentage =
              (crime.count / maximum) * 100;

            return (
              <div
                key={`${crime.crime_type}-${index}`}
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="w-6 text-xs font-mono text-slate-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="truncate text-sm font-medium text-slate-300">
                      {crime.crime_type}
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-bold text-white">
                    {formatNumber(crime.count)}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-700"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

/* =========================================================
   YEARLY TREND GRAPH
========================================================= */

function YearlyTrendChart({
  dataset,
}: {
  dataset?: DatasetIntelligence;
}) {
  const data = useMemo(
    () =>
      objectToChartData(
        dataset?.yearly_crime_counts,
      ),
    [dataset?.yearly_crime_counts],
  );

  return (
    <Panel>
      <SectionHeader
        icon={TrendingUp}
        eyebrow="Temporal intelligence"
        title="Historical Crime Trend"
        description="Year-by-year crime activity extracted directly from the dataset."
      />

      {data.length === 0 ? (
        <EmptyState text="No yearly trend data available." />
      ) : (
        <div className="h-[340px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 5,
              }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{
                  fill: "#64748b",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: "#64748b",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={<ChartTooltip />}
                cursor={{
                  stroke: "rgba(34,211,238,0.2)",
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#020617",
                  stroke: "#22d3ee",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                  fill: "#22d3ee",
                  stroke: "#020617",
                  strokeWidth: 3,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}

/* =========================================================
   MONTHLY TREND GRAPH
========================================================= */

function MonthlyTrendChart({
  dataset,
}: {
  dataset?: DatasetIntelligence;
}) {
  const data = useMemo(
    () =>
      objectToChartData(
        dataset?.monthly_crime_counts,
      ),
    [dataset?.monthly_crime_counts],
  );

  return (
    <Panel>
      <SectionHeader
        icon={BarChart3}
        eyebrow="Temporal intelligence"
        title="Monthly Crime Activity"
        description="Monthly incident volume across the available dataset period."
      />

      {data.length === 0 ? (
        <EmptyState text="No monthly trend data available." />
      ) : (
        <div className="h-[340px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 5,
              }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{
                  fill: "#64748b",
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: "#64748b",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={<ChartTooltip />}
                cursor={{
                  fill: "rgba(34,211,238,0.04)",
                }}
              />

              <Bar
                dataKey="value"
                radius={[5, 5, 0, 0]}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === data.length - 1
                        ? "#22d3ee"
                        : "#2563eb"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}

/* =========================================================
   FORECAST GRAPH
========================================================= */

function ForecastPanel({
  forecast,
}: {
  forecast: IntelligenceResponse["forecast"];
}) {
  const predictions: ForecastPoint[] =
    forecast?.best_forecast?.predictions?.map(
      (item) => ({
        period: item.period,
        prediction:
          Number(item.prediction) || 0,
      }),
    ) ?? [];

  const chartData = predictions.slice(0, 24);

  return (
    <Panel className="overflow-hidden">
      <SectionHeader
        icon={Target}
        eyebrow="Predictive intelligence"
        title="Crime Forecast"
        description="Interactive projections generated by the selected forecasting model."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-violet-400/10 bg-violet-400/5 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Best model
          </p>

          <p className="mt-2 text-sm font-semibold text-white">
            {safeString(
              forecast?.best_model,
              "Automatic",
            )}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Confidence
          </p>

          <p className="mt-2 text-sm font-semibold text-violet-400">
            {formatPercentage(
              forecast?.best_forecast
                ?.confidence,
            )}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Forecast points
          </p>

          <p className="mt-2 text-sm font-semibold text-white">
            {formatNumber(predictions.length)}
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <EmptyState text="No forecast predictions available." />
      ) : (
        <>
          <div className="h-[380px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={chartData}
                margin={{
                  top: 15,
                  right: 15,
                  left: -10,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />

                <XAxis
                  dataKey="period"
                  tick={{
                    fill: "#64748b",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: "#64748b",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={
                    <ChartTooltip />
                  }
                  cursor={{
                    stroke:
                      "rgba(34,211,238,0.2)",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="prediction"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#020617",
                    stroke: "#38bdf8",
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 7,
                    fill: "#38bdf8",
                    stroke: "#020617",
                    strokeWidth: 3,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-600">
            <span>
              Start:{" "}
              {safeString(
                chartData[0]?.period,
              )}
            </span>

            <span>
              End:{" "}
              {safeString(
                chartData[
                  chartData.length - 1
                ]?.period,
              )}
            </span>
          </div>
        </>
      )}
    </Panel>
  );
}

/* =========================================================
   RISK
========================================================= */

function RiskPanel({
  risk,
}: {
  risk: IntelligenceResponse["risk"];
}) {
  const score = Math.max(
    0,
    Math.min(
      100,
      Number(risk?.risk_score) || 0,
    ),
  );

  const level =
    risk?.risk_level?.toUpperCase() ??
    "UNKNOWN";

  return (
    <Panel>
      <SectionHeader
        icon={ShieldAlert}
        eyebrow="Operational risk"
        title="Risk Assessment"
        description="Risk level calculated from predictive crime intelligence."
      />

      <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.02] p-8">
        <div
          className={`flex h-44 w-44 items-center justify-center rounded-full border-[10px] ${getRiskRingClass(
            level,
          )}`}
        >
          <div className="text-center">
            <p className="text-5xl font-black text-white">
              {Math.round(score)}
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-600">
              Risk score
            </p>
          </div>
        </div>

        <div
          className={`mt-6 rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] ${getRiskClass(
            level,
          )}`}
        >
          {level}
        </div>

        <div className="mt-5 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
            Model confidence
          </p>

          <p className="mt-1 text-lg font-semibold text-white">
            {formatPercentage(
              risk?.confidence,
            )}
          </p>
        </div>
      </div>

      {risk?.recommendations &&
        risk.recommendations.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Recommendations
            </p>

            <div className="space-y-2">
              {risk.recommendations
                .slice(0, 5)
                .map(
                  (
                    recommendation,
                    index,
                  ) => (
                    <div
                      key={index}
                      className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />

                      <p className="text-sm leading-5 text-slate-400">
                        {recommendation}
                      </p>
                    </div>
                  ),
                )}
            </div>
          </div>
        )}
    </Panel>
  );
}

/* =========================================================
   AI PANEL
========================================================= */

function AIIntelligencePanel({
  intelligence,
}: {
  intelligence: IntelligenceResponse["intelligence"];
}) {
  return (
    <Panel className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

      <div className="relative">
        <SectionHeader
          icon={BrainCircuit}
          eyebrow="Sentinel AI"
          title="Executive Intelligence"
          description="AI-generated interpretation of the analytical results."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-violet-400/10 bg-violet-400/5 p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
                Detected trend
              </span>
            </div>

            <p className="mt-3 text-xl font-semibold text-white">
              {safeString(
                intelligence?.trend,
                "No trend available",
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Recommendation
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {safeString(
                intelligence?.recommendation,
                "No recommendation available.",
              )}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/5 bg-slate-900/60 p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Intelligence summary
          </p>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            {safeString(
              intelligence?.summary,
              "No executive summary is available.",
            )}
          </p>
        </div>
      </div>
    </Panel>
  );
}

/* =========================================================
   NEIGHBORHOODS
========================================================= */

function NeighborhoodList({
  neighborhoods,
}: {
  neighborhoods: Neighborhood[];
}) {
  return (
    <Panel>
      <SectionHeader
        icon={MapPin}
        eyebrow="Geospatial"
        title="Top Neighborhoods"
        description="Areas with the highest recorded crime activity."
      />

      {neighborhoods.length === 0 ? (
        <EmptyState text="No neighborhood data available." />
      ) : (
        <div className="space-y-3">
          {neighborhoods
            .slice(0, 8)
            .map((item, index) => (
              <div
                key={`${item.neighborhood}-${index}`}
                className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-violet-400/20 hover:bg-violet-400/[0.03]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-xs font-bold text-violet-400">
                  {String(index + 1).padStart(
                    2,
                    "0",
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-200">
                    {item.neighborhood}
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">
                    Recorded incidents
                  </p>
                </div>

                <span className="text-sm font-bold text-white">
                  {formatNumber(item.count)}
                </span>
              </div>
            ))}
        </div>
      )}
    </Panel>
  );
}

/* =========================================================
   GEOSPATIAL
========================================================= */

function GeospatialPanel({
  geospatial,
  geographicPoints,
}: {
  geospatial: IntelligenceResponse["geospatial"];
  geographicPoints?: number;
}) {
  const hotspots = Array.isArray(
    geospatial?.hotspots,
  )
    ? geospatial.hotspots
    : [];

  const clusters = Array.isArray(
    geospatial?.clusters,
  )
    ? geospatial.clusters
    : [];

  return (
    <Panel>
      <SectionHeader
        icon={Globe2}
        eyebrow="Spatial intelligence"
        title="Hotspot Intelligence"
        description="Geographic crime concentration detected by Sentinel AI."
      />

      <div className="relative min-h-[330px] overflow-hidden rounded-2xl border border-violet-400/10 bg-[#030b17]">
        {/* grid */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* ambient glow */}
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/5 blur-3xl" />

        {/* hotspot visualisation */}
        <div className="absolute inset-0">
          {hotspots
            .slice(0, 10)
            .map((hotspot, index) => {
              const x =
                15 +
                ((index * 37) % 70);

              const y =
                18 +
                ((index * 53) % 65);

              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >
                  <div className="absolute -inset-4 animate-pulse rounded-full bg-violet-400/10 blur-xl" />

                  <div className="relative h-3 w-3 rounded-full border-2 border-violet-300 bg-violet-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                </div>
              );
            })}
        </div>

        <div className="relative flex min-h-[330px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-violet-400/30 bg-violet-400/10 shadow-[0_0_60px_rgba(34,211,238,0.15)]">
              <MapPin className="h-9 w-9 text-violet-400" />
            </div>

            <p className="mt-5 text-sm font-semibold text-white">
              Spatial analysis complete
            </p>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
              {formatNumber(
                geographicPoints,
              )}{" "}
              geographic points processed
              for spatial intelligence.
            </p>

            <div className="mt-5 flex justify-center gap-3">
              <div className="rounded-full border border-violet-400/10 bg-violet-400/5 px-3 py-1.5 text-[10px] uppercase tracking-wider text-violet-400">
                {formatNumber(
                  hotspots.length,
                )}{" "}
                hotspots
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-wider text-slate-500">
                {formatNumber(
                  clusters.length,
                )}{" "}
                clusters
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* =========================================================
   PREPROCESSING
========================================================= */

function PreprocessingPanel({
  preprocessing,
}: {
  preprocessing: IntelligenceResponse["preprocessing"];
}) {
  return (
    <Panel>
      <SectionHeader
        icon={CheckCircle2}
        eyebrow="Data pipeline"
        title="Preprocessing Summary"
        description="Quality controls applied before intelligence generation."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={Database}
          label="Rows Before"
          value={formatNumber(
            preprocessing?.rows_before,
          )}
        />

        <MetricCard
          icon={CheckCircle2}
          label="Rows After"
          value={formatNumber(
            preprocessing?.rows_after,
          )}
        />

        <MetricCard
          icon={AlertTriangle}
          label="Rows Removed"
          value={formatNumber(
            preprocessing?.rows_removed,
          )}
        />
      </div>

      {preprocessing?.warnings &&
        preprocessing.warnings.length > 0 && (
          <div className="mt-5 space-y-2">
            {preprocessing.warnings.map(
              (warning, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-3"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />

                  <p className="text-sm text-yellow-200/70">
                    {warning}
                  </p>
                </div>
              ),
            )}
          </div>
        )}
    </Panel>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
      <p className="text-sm text-slate-600">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AnalysisDashboard({
  params,
}: PageProps) {
  const [datasetId, setDatasetId] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<IntelligenceResponse | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function loadAnalysis(
    id: string,
    forceRefresh = false,
  ) {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const storageKey =
        `sentinel-analysis-${id}`;

      if (!forceRefresh) {
        const cached =
          sessionStorage.getItem(
            storageKey,
          );

        if (cached) {
          try {
            const parsed =
              JSON.parse(cached);

            setResult(parsed);
            setLoading(false);

            return;
          } catch {
            sessionStorage.removeItem(
              storageKey,
            );
          }
        }
      }

      const data =
        await generateIntelligence(id);

      setResult(data);

      sessionStorage.setItem(
        storageKey,
        JSON.stringify(data),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load analysis.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const resolvedParams =
          await params;

        if (!active) {
          return;
        }

        const id =
          resolvedParams.datasetId;

        setDatasetId(id);

        await loadAnalysis(id);
      } catch (err) {
        if (!active) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load analysis.",
        );

        setLoading(false);
      }
    }

    initialize();

    return () => {
      active = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  /* =====================================================
     DERIVED DATA
  ===================================================== */

  const dataset =
    result?.dataset;

  const crimes =
    dataset?.top_crime_types ?? [];

  const neighborhoods =
    dataset?.top_neighborhoods ?? [];

  const dateRange =
    dataset?.date_range;

  const commonCrime =
    dataset?.most_common_crime
      ?.crime_type ?? "—";

  const commonCrimeCount =
    dataset?.most_common_crime
      ?.count;

  const geographicPoints =
    dataset?.geographic_points;

  const riskLevel =
    result?.risk?.risk_level?.toUpperCase();

  const processingPercentage =
    dataset?.total_rows &&
    result?.preprocessing?.rows_after
      ? (
          (result.preprocessing.rows_after /
            dataset.total_rows) *
          100
        ).toFixed(1)
      : null;

  const formattedDateRange =
    dateRange
      ? `${dateRange.start} → ${dateRange.end}`
      : "—";

  const statusText =
    riskLevel === "CRITICAL" ||
    riskLevel === "HIGH"
      ? "Elevated operational risk"
      : "Analysis completed successfully";

  const headerStatusClass =
    riskLevel === "CRITICAL" ||
    riskLevel === "HIGH"
      ? "border-red-500/20 bg-red-500/10 text-red-400"
      : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

  const trend =
    result?.trends?.trend
      ?.toUpperCase() ?? "UNKNOWN";

  const increasing =
    trend.includes("INCREAS");

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <DashboardLayout>
        <main className="min-h-screen bg-[#05030d] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/5">
                <RefreshCw className="h-7 w-7 animate-spin text-violet-400" />
              </div>

              <p className="mt-6 text-sm font-semibold text-white">
                Generating intelligence...
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Processing dataset, trends,
                forecasts and risk.
              </p>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <DashboardLayout>
        <main className="min-h-screen bg-[#05030d] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl py-20">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />

              <h1 className="mt-5 text-xl font-semibold text-white">
                Intelligence generation failed
              </h1>

              <p className="mt-3 text-sm text-red-300">
                {error}
              </p>

              {datasetId && (
                <button
                  type="button"
                  onClick={() =>
                    loadAnalysis(
                      datasetId,
                      true,
                    )
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              )}
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  if (!result) {
    return null;
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[#05030d] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">

          {/* =================================================
              HEADER
          ================================================= */}

          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950/30 p-7 shadow-2xl shadow-black/30">
            <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-purple-600/5 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
                      Sentinel AI
                    </span>
                  </div>

                  {datasetId && (
                    <span className="font-mono text-xs text-slate-600">
                      / {datasetId.slice(0, 12)}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Crime Intelligence
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                  Unified intelligence generated
                  from your uploaded crime dataset
                  using statistical, geospatial
                  and predictive analysis.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  disabled={refreshing}
                  onClick={() => {
                    if (datasetId) {
                      loadAnalysis(
                        datasetId,
                        true,
                      );
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-violet-400/20 hover:bg-violet-400/5 hover:text-white disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      refreshing
                        ? "animate-spin"
                        : ""
                    }`}
                  />

                  Refresh
                </button>

                <div
                  className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${headerStatusClass}`}
                >
                  {riskLevel ===
                    "CRITICAL" ||
                  riskLevel === "HIGH" ? (
                    <ShieldAlert className="h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}

                  {statusText}
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              METRICS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Database}
              label="Total Records"
              value={formatNumber(
                dataset?.total_rows,
              )}
              description="Rows analyzed"
            />

            <MetricCard
              icon={ShieldAlert}
              label="Crime Types"
              value={formatNumber(
                dataset?.crime_type_count,
              )}
              description="Detected categories"
            />

            <MetricCard
              icon={CheckCircle2}
              label="Processed"
              value={
                processingPercentage
                  ? `${processingPercentage}%`
                  : formatNumber(
                      result.preprocessing
                        ?.rows_after,
                    )
              }
              description="Records after preprocessing"
            />

            <MetricCard
              icon={Globe2}
              label="Geo Points"
              value={formatNumber(
                geographicPoints,
              )}
              description="Valid geographic records"
            />
          </div>

          {/* =================================================
              AI + RISK
          ================================================= */}

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <AIIntelligencePanel
              intelligence={
                result.intelligence
              }
            />

            <RiskPanel
              risk={result.risk}
            />
          </div>

          {/* =================================================
              DATASET OVERVIEW
          ================================================= */}

          <Panel>
            <SectionHeader
              icon={Database}
              eyebrow="Dataset"
              title="Dataset Intelligence"
              description="High-level characteristics extracted from the uploaded data."
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Most common crime
                </p>

                <p className="mt-2 truncate text-lg font-semibold text-white">
                  {commonCrime}
                </p>

                {commonCrimeCount !==
                  undefined && (
                  <p className="mt-1 text-xs text-slate-500">
                    {formatNumber(
                      commonCrimeCount,
                    )}{" "}
                    incidents
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Date range
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {formattedDateRange}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Neighborhoods
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {formatNumber(
                    dataset?.neighborhood_count,
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Unique locations
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {formatNumber(
                    dataset?.unique_locations,
                  )}
                </p>
              </div>
            </div>
          </Panel>

          {/* =================================================
              TREND SUMMARY
          ================================================= */}

          <Panel>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    increasing
                      ? "bg-red-500/10"
                      : "bg-emerald-500/10"
                  }`}
                >
                  {increasing ? (
                    <TrendingUp className="h-6 w-6 text-red-400" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-emerald-400" />
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
                    Temporal intelligence
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Crime Trend
                  </h2>
                </div>
              </div>

              <div
                className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                  increasing
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {increasing ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}

                {trend}
              </div>
            </div>

            {result.trends?.summary && (
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Seasonal periods
                  </p>

                  <p className="mt-2 text-lg font-bold text-white">
                    {formatNumber(
                      result.trends.summary
                        .seasonal_periods,
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Anomalies
                  </p>

                  <p className="mt-2 text-lg font-bold text-white">
                    {formatNumber(
                      result.trends.summary
                        .anomaly_count,
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Direction
                  </p>

                  <p className="mt-2 text-lg font-bold text-violet-400">
                    {trend}
                  </p>
                </div>
              </div>
            )}
          </Panel>

          {/* =================================================
              REAL TREND GRAPHS
          ================================================= */}

          <div className="grid gap-6 xl:grid-cols-2">
            <YearlyTrendChart
              dataset={dataset}
            />

            <MonthlyTrendChart
              dataset={dataset}
            />
          </div>

          {/* =================================================
              CRIME DISTRIBUTION
          ================================================= */}

          <CrimeDistribution
            crimes={crimes}
          />

          {/* =================================================
              FORECAST
          ================================================= */}

          <ForecastPanel
            forecast={result.forecast}
          />

          {/* =================================================
              NEIGHBORHOODS + GEO
          ================================================= */}

          <div className="grid gap-6 xl:grid-cols-2">
            <NeighborhoodList
              neighborhoods={
                neighborhoods
              }
            />

            <GeospatialPanel
              geospatial={
                result.geospatial
              }
              geographicPoints={
                geographicPoints
              }
            />
          </div>

          {/* =================================================
              PREPROCESSING
          ================================================= */}

          <PreprocessingPanel
            preprocessing={
              result.preprocessing
            }
          />

          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="flex flex-col justify-between gap-3 border-t border-white/5 py-6 text-xs text-slate-700 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />

              <span>
                Sentinel AI Intelligence Engine
              </span>
            </div>

            <span className="font-mono">
              Dataset:{" "}
              {datasetId ?? "unknown"}
            </span>
          </footer>
        </div>
      </main>
    </DashboardLayout>
  );
}
