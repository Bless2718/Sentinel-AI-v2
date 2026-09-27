"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import { useParams } from "next/navigation";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CalendarDays,
  Database,
  MapPin,
  RefreshCw,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
  type IntelligenceResponse,
} from "@/features/analysis/intelligence-api";

type ChartItem = {
  name: string;
  value: number;
};

function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN").format(value);
}

function formatDecimal(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "—";
  }

  return value.toFixed(2);
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
        <Icon className="h-5 w-5 text-violet-300" />
      </div>

      <div>
        <h2 className="font-serif text-xl text-white">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
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
  icon: ElementType;
  label: string;
  value: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl transition-colors hover:border-violet-400/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>

          <p className="mt-3 font-serif text-2xl text-white">{value}</p>

          {description && (
            <p className="mt-1 text-xs text-slate-600">{description}</p>
          )}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20">
          <Icon className="h-5 w-5 text-violet-300" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/10">
      <div className="text-center">
        <BarChart3 className="mx-auto h-8 w-8 text-slate-700" />
        <p className="mt-3 text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const params = useParams();
  const datasetId = params?.datasetId as string;

  const [data, setData] = useState<IntelligenceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (forceRefresh = false) => {
      if (!datasetId) {
        setError("Dataset ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setError(null);

        if (!forceRefresh) {
          const cached = sessionStorage.getItem(
            `sentinel-analysis-${datasetId}`,
          );

          if (cached) {
            try {
              const parsed = JSON.parse(cached) as IntelligenceResponse;
              setData(parsed);
              setLoading(false);
              return;
            } catch {
              sessionStorage.removeItem(
                `sentinel-analysis-${datasetId}`,
              );
            }
          }
        }

        setRefreshing(forceRefresh);
        setLoading(true);

        const result = await generateIntelligence(datasetId, 12);

        setData(result);

        sessionStorage.setItem(
          `sentinel-analysis-${datasetId}`,
          JSON.stringify(result),
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load analytics.";

        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [datasetId],
  );

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  const dataset = data?.dataset;

  const yearlyData = useMemo<ChartItem[]>(() => {
    const source = dataset?.yearly_crime_counts;

    if (!source || typeof source !== "object") {
      return [];
    }

    return Object.entries(source)
      .map(([year, count]) => ({
        name: year,
        value: Number(count) || 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [dataset?.yearly_crime_counts]);

  const monthlyData = useMemo<ChartItem[]>(() => {
    const source = dataset?.monthly_crime_counts;

    if (!source || typeof source !== "object") {
      return [];
    }

    return Object.entries(source)
      .map(([month, count]) => ({
        name: month,
        value: Number(count) || 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [dataset?.monthly_crime_counts]);

  const crimeTypeData = useMemo<ChartItem[]>(() => {
    return (dataset?.top_crime_types ?? [])
      .map((item) => ({
        name: item.crime_type,
        value: Number(item.count) || 0,
      }))
      .filter((item) => item.name);
  }, [dataset?.top_crime_types]);

  const neighborhoodData = useMemo<ChartItem[]>(() => {
    return (dataset?.top_neighborhoods ?? [])
      .map((item) => ({
        name: item.neighborhood,
        value: Number(item.count) || 0,
      }))
      .filter((item) => item.name);
  }, [dataset?.top_neighborhoods]);

  const seasonalityData = useMemo(() => {
    return (data?.trends?.seasonality ?? []).map((item) => ({
      name: String(item.month),
      value: Number(item.average_crime) || 0,
    }));
  }, [data?.trends?.seasonality]);

  const dateRangeLabel = useMemo(() => {
    const range = dataset?.date_range;

    if (!range) {
      return "—";
    }

    return `${range.start} — ${range.end}`;
  }, [dataset?.date_range]);

  const historicalTrend =
    data?.trends?.summary?.trend ??
    data?.trends?.trend ??
    "—";

  const forecastTrend = data?.forecast?.best_forecast?.trend ?? "—";

  const trendIsIncreasing =
    historicalTrend.toLowerCase() === "increasing";

  const trendIsDecreasing =
    historicalTrend.toLowerCase() === "decreasing";

  if (loading && !data) {
    return (
      <DashboardLayout datasetId={datasetId}>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-violet-300" />
            <p className="mt-4 text-sm text-slate-500">
              Loading analytical intelligence...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !data) {
    return (
      <DashboardLayout datasetId={datasetId}>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="max-w-md rounded-2xl border border-red-400/20 bg-red-500/[0.04] p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-300" />

            <h1 className="mt-4 font-serif text-xl text-white">
              Unable to load analytics
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadData(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2.5 text-sm text-violet-200 transition-colors hover:bg-violet-500/15"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout datasetId={datasetId}>
      <div className="mx-auto w-full max-w-[1600px] space-y-8">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-8 bg-violet-400/50" />

              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-violet-300">
                Analytical Intelligence
              </span>
            </div>

            <h1 className="font-serif text-4xl tracking-tight text-white md:text-5xl">
              Crime Analytics
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              A structured view of crime activity, temporal patterns,
              geographic distribution, and dataset quality.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-slate-300 transition-colors hover:border-violet-400/20 hover:bg-violet-500/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh Analysis
          </button>
        </div>

        {/* ERROR BANNER */}
        {error && data && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-500/[0.04] px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-300" />

            <p className="text-sm text-amber-200/80">
              {error}
            </p>
          </div>
        )}

        {/* CORE DATA METRICS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Database}
            label="Total Records"
            value={formatNumber(dataset?.total_rows)}
            description="Rows processed"
          />

          <MetricCard
            icon={BarChart3}
            label="Crime Types"
            value={formatNumber(dataset?.crime_type_count)}
            description="Distinct categories"
          />

          <MetricCard
            icon={MapPin}
            label="Geographic Points"
            value={formatNumber(dataset?.geographic_points)}
            description="Valid geographic records"
          />

          <MetricCard
            icon={Users}
            label="Neighborhoods"
            value={formatNumber(dataset?.neighborhood_count)}
            description="Distinct areas"
          />
        </section>

        {/* DATASET OVERVIEW */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
          <SectionHeader
            icon={Database}
            title="Dataset Overview"
            description="Structural information detected during intelligence generation."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-white/5 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Columns
              </p>

              <p className="mt-2 text-lg text-white">
                {formatNumber(dataset?.total_columns)}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Date Range
              </p>

              <p className="mt-2 text-sm text-white">
                {dateRangeLabel}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Most Common Crime
              </p>

              <p className="mt-2 text-sm text-white">
                {dataset?.most_common_crime?.crime_type ?? "—"}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Unique Locations
              </p>

              <p className="mt-2 text-lg text-white">
                {formatNumber(dataset?.unique_locations)}
              </p>
            </div>
          </div>
        </section>

        {/* YEARLY TREND */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
          <SectionHeader
            icon={TrendingDown}
            title="Yearly Crime Trend"
            description="Historical crime volume grouped by year."
          />

          {yearlyData.length > 0 ? (
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={yearlyData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
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
                    width={55}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0b0b12",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    labelStyle={{
                      color: "#a78bfa",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#a78bfa"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 4,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No yearly crime data is available." />
          )}
        </section>

        {/* MONTHLY TREND */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
          <SectionHeader
            icon={CalendarDays}
            title="Monthly Crime Activity"
            description="Crime volume aggregated by month."
          />

          {monthlyData.length > 0 ? (
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: "#64748b",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                  />

                  <YAxis
                    tick={{
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={55}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0b0b12",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    labelStyle={{
                      color: "#a78bfa",
                    }}
                  />

                  <Bar
                    dataKey="value"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState message="No monthly crime data is available." />
          )}
        </section>

        {/* TREND + SEASONALITY */}
        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
            <SectionHeader
              icon={
                trendIsIncreasing
                  ? TrendingUp
                  : trendIsDecreasing
                    ? TrendingDown
                    : Activity
              }
              title="Historical Trend"
              description="Detected direction in the historical crime series."
            />

            <div className="rounded-xl border border-white/5 bg-black/10 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-600">
                Overall Direction
              </p>

              <p className="mt-3 font-serif text-3xl capitalize text-white">
                {historicalTrend}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-600">
                    Seasonal Periods
                  </p>

                  <p className="mt-1 text-lg text-slate-200">
                    {formatNumber(
                      data?.trends?.summary?.seasonal_periods,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-600">
                    Anomalies
                  </p>

                  <p className="mt-1 text-lg text-slate-200">
                    {formatNumber(
                      data?.trends?.summary?.anomaly_count,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
            <SectionHeader
              icon={Activity}
              title="Seasonality"
              description="Average crime activity across calendar months."
            />

            {seasonalityData.length > 0 ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={seasonalityData}>
                    <CartesianGrid
                      stroke="rgba(255,255,255,0.06)"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
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
                      contentStyle={{
                        background: "#0b0b12",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />

                    <Bar
                      dataKey="value"
                      fill="#a78bfa"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState message="No seasonality data is available." />
            )}
          </div>
        </section>

        {/* FORECAST CONTEXT */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
          <SectionHeader
            icon={TrendingUp}
            title="Forecast Context"
            description="Forward-looking information generated by the forecasting pipeline."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-white/5 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Best Model
              </p>

              <p className="mt-2 font-serif text-xl text-white">
                {data?.forecast?.best_model ?? "—"}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Forecast Trend
              </p>

              <p className="mt-2 font-serif text-xl capitalize text-white">
                {forecastTrend.toLowerCase()}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Validation Confidence
              </p>

              <p className="mt-2 font-serif text-xl text-white">
                {formatDecimal(
                  data?.forecast?.best_forecast?.confidence,
                )}
                %
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Forecast Periods
              </p>

              <p className="mt-2 font-serif text-xl text-white">
                {formatNumber(data?.forecast_periods)}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-violet-400/10 bg-violet-500/[0.03] p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />

              <div>
                <p className="text-sm font-medium text-slate-200">
                  Forecast interpretation
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Forecast confidence shown here represents model
                  validation performance. It should not be interpreted
                  as a guaranteed future prediction interval.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CRIME TYPE DISTRIBUTION */}
        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
            <SectionHeader
              icon={BarChart3}
              title="Crime Type Distribution"
              description="Most frequently observed crime categories."
            />

            {crimeTypeData.length > 0 ? (
              <div className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={crimeTypeData}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 15,
                      left: 15,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      stroke="rgba(255,255,255,0.05)"
                      horizontal={false}
                    />

                    <XAxis
                      type="number"
                      tick={{
                        fill: "#64748b",
                        fontSize: 10,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 10,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#0b0b12",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />

                    <Bar
                      dataKey="value"
                      fill="#8b5cf6"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState message="No crime type distribution is available." />
            )}
          </div>

          {/* TOP NEIGHBORHOODS */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
            <SectionHeader
              icon={MapPin}
              title="Top Neighborhoods"
              description="Areas with the highest recorded crime volume."
            />

            {neighborhoodData.length > 0 ? (
              <div className="space-y-3">
                {neighborhoodData.slice(0, 10).map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-black/10 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-xs text-violet-300">
                        {index + 1}
                      </span>

                      <span className="truncate text-sm text-slate-300">
                        {item.name}
                      </span>
                    </div>

                    <span className="shrink-0 text-sm font-medium text-white">
                      {formatNumber(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No neighborhood data is available." />
            )}
          </div>
        </section>

        {/* DATA QUALITY */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
          <SectionHeader
            icon={ShieldCheck}
            title="Data Quality"
            description="Preprocessing and geographic validation results."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-white/5 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Rows Before
              </p>

              <p className="mt-2 text-xl text-white">
                {formatNumber(
                  data?.preprocessing?.rows_before,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Rows After
              </p>

              <p className="mt-2 text-xl text-white">
                {formatNumber(
                  data?.preprocessing?.rows_after,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Rows Removed
              </p>

              <p className="mt-2 text-xl text-white">
                {formatNumber(
                  data?.preprocessing?.rows_removed,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Invalid Coordinates
              </p>

              <p className="mt-2 text-xl text-white">
                {formatNumber(dataset?.invalid_coordinates)}
              </p>
            </div>
          </div>

          {data?.preprocessing?.warnings &&
            data.preprocessing.warnings.length > 0 && (
              <div className="mt-5 rounded-xl border border-amber-400/10 bg-amber-500/[0.03] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-amber-300">
                  Processing Warnings
                </p>

                <div className="mt-3 space-y-2">
                  {data.preprocessing.warnings.map(
                    (warning, index) => (
                      <p
                        key={`${warning}-${index}`}
                        className="text-sm leading-6 text-slate-500"
                      >
                        • {warning}
                      </p>
                    ),
                  )}
                </div>
              </div>
            )}
        </section>

        {/* FOOTER NOTE */}
        <div className="border-t border-white/5 pt-6">
          <div className="flex flex-col justify-between gap-3 text-xs text-slate-600 md:flex-row">
            <p>
              Sentinel AI · Analytical Intelligence
            </p>

            <p>
              Dataset ID: {datasetId}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}