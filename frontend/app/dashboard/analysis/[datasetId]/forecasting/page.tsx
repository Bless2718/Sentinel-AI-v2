"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useParams } from "next/navigation";

import {
  Activity,
  BarChart3,
  BrainCircuit,
  CalendarRange,
  CheckCircle2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import {
  CartesianGrid,
  Legend,
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
  type ForecastModel,
  type ForecastPeriod,
  type ForecastPrediction,
  type IntelligenceResponse,
} from "@/features/analysis/intelligence-api";

const FORECAST_PERIODS: ForecastPeriod[] = [
  1,
  3,
  6,
  12,
  24,
  36,
];

function formatNumber(value?: number | null) {
  if (value === undefined || value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDecimal(value?: number | null) {
  if (value === undefined || value === null) {
    return "—";
  }

  return value.toFixed(2);
}

function formatPercentage(value?: number | null) {
  if (value === undefined || value === null) {
    return "—";
  }

  return `${value.toFixed(1)}%`;
}

function formatModelName(value?: string) {
  if (!value) {
    return "Unknown";
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatPeriodLabel(period: number) {
  if (period === 1) {
    return "1 Month";
  }

  if (period < 12) {
    return `${period} Months`;
  }

  if (period === 12) {
    return "1 Year";
  }

  return `${period / 12} Years`;
}

function normalizePeriod(period: number | string) {
  const value = String(period);

  if (/^\d{4}-\d{2}$/.test(value)) {
    return value;
  }

  return value;
}

function buildChartData(
  predictions: ForecastPrediction[] = [],
) {
  return predictions.map((point, index) => ({
    period: normalizePeriod(point.period),
    prediction: Number(point.prediction),
    index: index + 1,
  }));
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
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="rounded-xl border border-violet-400/20 bg-violet-400/10 p-3">
        <Icon className="h-5 w-5 text-violet-300" />
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-300">
          {eyebrow}
        </p>

        <h2 className="mt-1 font-serif text-2xl text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:border-violet-400/20">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/5 blur-3xl transition group-hover:bg-violet-500/10" />

      <div className="relative">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>

        <p className="mt-3 font-serif text-3xl text-white">
          {value}
        </p>

        <p className="mt-2 text-xs text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

function TrendBadge({
  trend,
}: {
  trend?: string;
}) {
  const normalized = trend?.toUpperCase();

  const increasing = normalized === "INCREASING";
  const decreasing = normalized === "DECREASING";

  if (increasing) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
        <TrendingUp className="h-3.5 w-3.5" />
        Increasing
      </div>
    );
  }

  if (decreasing) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
        <TrendingDown className="h-3.5 w-3.5" />
        Decreasing
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-300">
      <Activity className="h-3.5 w-3.5" />
      Stable
    </div>
  );
}

function ModelComparison({
  models,
  bestModel,
}: {
  models: Record<string, ForecastModel>;
  bestModel?: string;
}) {
  const entries = Object.entries(models);

  if (!entries.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center text-sm text-slate-500">
        No model comparison data available.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead className="border-b border-white/10 bg-white/[0.025]">
            <tr>
              <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Model
              </th>

              <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                MAE
              </th>

              <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                RMSE
              </th>

              <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                R²
              </th>

              <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Validation Confidence
              </th>

              <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Selection
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {entries.map(([name, model]) => {
              const selected =
                name.toLowerCase() ===
                bestModel?.toLowerCase();

              return (
                <tr
                  key={name}
                  className={
                    selected
                      ? "bg-violet-500/[0.045]"
                      : "transition hover:bg-white/[0.02]"
                  }
                >
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      {selected && (
                        <CheckCircle2 className="h-4 w-4 text-violet-300" />
                      )}

                      <span className="font-medium text-white">
                        {formatModelName(
                          model.model_name || name,
                        )}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-5 font-mono text-sm text-slate-300">
                    {formatDecimal(model.mae)}
                  </td>

                  <td className="px-5 py-5 font-mono text-sm text-slate-300">
                    {formatDecimal(model.rmse)}
                  </td>

                  <td className="px-5 py-5 font-mono text-sm text-slate-300">
                    {formatDecimal(model.r2_score)}
                  </td>

                  <td className="px-5 py-5 font-mono text-sm text-slate-300">
                    {formatPercentage(
                      model.confidence,
                    )}
                  </td>

                  <td className="px-5 py-5">
                    {selected ? (
                      <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                        Selected
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ForecastingPage() {
  const params = useParams();

  const datasetId = params.datasetId as string;

  const [result, setResult] =
    useState<IntelligenceResponse | null>(null);

  const [selectedPeriod, setSelectedPeriod] =
    useState<ForecastPeriod>(12);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!datasetId) {
      return;
    }

    try {
      const stored = sessionStorage.getItem(
        `sentinel-analysis-${datasetId}`,
      );

      if (stored) {
        const parsed =
          JSON.parse(stored) as IntelligenceResponse;

        setResult(parsed);

        if (
          parsed.forecast_periods &&
          FORECAST_PERIODS.includes(
            parsed.forecast_periods as ForecastPeriod,
          )
        ) {
          setSelectedPeriod(
            parsed.forecast_periods as ForecastPeriod,
          );
        }
      }
    } catch (storageError) {
      console.error(
        "Failed to load cached intelligence:",
        storageError,
      );
    } finally {
      setLoading(false);
    }
  }, [datasetId]);

  async function loadForecast(
    periods: ForecastPeriod,
  ) {
    try {
      setError(null);
      setRefreshing(true);

      const response =
        await generateIntelligence(
          datasetId,
          periods,
        );

      setResult(response);
      setSelectedPeriod(periods);

      sessionStorage.setItem(
        `sentinel-analysis-${datasetId}`,
        JSON.stringify(response),
      );
    } catch (requestError) {
      console.error(
        "Forecast request failed:",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to generate forecast.",
      );
    } finally {
      setRefreshing(false);
    }
  }

  const forecast = result?.forecast;

  const bestForecast =
    forecast?.best_forecast;

  const chartData = useMemo(
    () =>
      buildChartData(
        bestForecast?.predictions,
      ),
    [bestForecast?.predictions],
  );

  const averagePrediction = useMemo(() => {
    if (!chartData.length) {
      return undefined;
    }

    return (
      chartData.reduce(
        (sum, point) =>
          sum + point.prediction,
        0,
      ) / chartData.length
    );
  }, [chartData]);

  const peakPrediction = useMemo(() => {
    if (!chartData.length) {
      return undefined;
    }

    return Math.max(
      ...chartData.map(
        (point) => point.prediction,
      ),
    );
  }, [chartData]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />

            <p className="mt-4 text-sm text-slate-500">
              Loading forecasting intelligence...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-10">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-300">
              Sentinel AI / Forecasting
            </p>

            <h1 className="mt-3 font-serif text-4xl tracking-tight text-white md:text-5xl">
              Crime Forecasting
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Project future monthly crime activity using the
              forecasting models trained on this dataset.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadForecast(selectedPeriod)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-400/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh Forecast
          </button>
        </div>

        {/* PERIOD SELECTOR */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <CalendarRange className="h-5 w-5 text-violet-300" />

                <h2 className="font-serif text-xl text-white">
                  Forecast Horizon
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Select how many future monthly periods should
                be generated.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {FORECAST_PERIODS.map(
                (period) => {
                  const active =
                    selectedPeriod === period;

                  return (
                    <button
                      key={period}
                      type="button"
                      onClick={() =>
                        loadForecast(period)
                      }
                      disabled={refreshing}
                      className={`rounded-xl border px-4 py-3 text-xs font-semibold uppercase tracking-wider transition ${
                        active
                          ? "border-violet-400/40 bg-violet-400/10 text-violet-200 shadow-[0_0_30px_rgba(139,92,246,0.08)]"
                          : "border-white/10 bg-white/[0.02] text-slate-500 hover:border-violet-400/20 hover:text-slate-300"
                      }`}
                    >
                      {period === 12
                        ? "1Y"
                        : period === 24
                          ? "2Y"
                          : period === 36
                            ? "3Y"
                            : `${period}M`}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
            <p className="text-sm font-medium text-red-300">
              Forecast generation failed
            </p>

            <p className="mt-1 text-sm text-red-300/70">
              {error}
            </p>
          </div>
        )}

        {/* PRIMARY METRICS */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Forecast Horizon"
            value={formatPeriodLabel(
              result?.forecast_periods ??
                selectedPeriod,
            )}
            description="Selected projection window"
          />

          <MetricCard
            label="Best Model"
            value={formatModelName(
              forecast?.best_model,
            )}
            description="Selected using lowest MAE"
          />

          <MetricCard
            label="Validation Confidence"
            value={formatPercentage(
              bestForecast?.confidence,
            )}
            description="Derived from validation performance"
          />

          <MetricCard
            label="Forecast Trend"
            value={
              bestForecast?.trend
                ? bestForecast.trend
                    .charAt(0)
                    .toUpperCase() +
                  bestForecast.trend.slice(1)
                : "—"
            }
            description="Detected across selected forecast"
          />
        </div>

        {/* FORECAST CHART */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl md:p-8">
          <SectionHeader
            icon={BarChart3}
            eyebrow="Projection"
            title="Forecast trajectory"
            description={`Projected monthly crime activity across the selected ${formatPeriodLabel(
              result?.forecast_periods ??
                selectedPeriod,
            ).toLowerCase()} horizon.`}
          />

          {chartData.length > 0 ? (
            <div className="h-[420px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={chartData}
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
                    dataKey="period"
                    tick={{
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={24}
                  />

                  <YAxis
                    tick={{
                      fill: "#64748b",
                      fontSize: 11,
                    }}
                    tickLine={false}
                    axisLine={false}
                    width={60}
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "rgba(10, 8, 18, 0.96)",
                      border:
                        "1px solid rgba(139,92,246,0.25)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    labelStyle={{
                      color: "#a78bfa",
                    }}
                    formatter={(value) => [
                      formatNumber(
                        Number(value),
                      ),
                      "Predicted crimes",
                    ]}
                  />

                  <Legend
                    wrapperStyle={{
                      color: "#94a3b8",
                      fontSize: 12,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="prediction"
                    name="Predicted Crime Count"
                    stroke="#a78bfa"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#c4b5fd",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[360px] items-center justify-center rounded-xl border border-dashed border-white/10">
              <p className="text-sm text-slate-500">
                No forecast predictions available.
              </p>
            </div>
          )}
        </section>

        {/* FORECAST SUMMARY */}
        <div className="grid gap-6 lg:grid-cols-3">

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
            <SectionHeader
              icon={BrainCircuit}
              eyebrow="Model intelligence"
              title="Selected model"
              description="The model selected by the forecasting pipeline."
            />

            <div className="mt-8">
              <p className="font-serif text-3xl text-white">
                {formatModelName(
                  forecast?.best_model,
                )}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                The forecasting selector currently chooses
                the model with the lowest validation MAE.
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs text-violet-300">
                <CheckCircle2 className="h-4 w-4" />
                Selected by forecasting pipeline
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
            <SectionHeader
              icon={Activity}
              eyebrow="Forecast signal"
              title="Expected activity"
              description="Summary statistics across the selected forecast."
            />

            <div className="space-y-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-600">
                  Average predicted crimes
                </p>

                <p className="mt-2 font-serif text-3xl text-white">
                  {formatNumber(
                    averagePrediction,
                  )}
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-600">
                  Peak predicted crimes
                </p>

                <p className="mt-2 font-serif text-3xl text-white">
                  {formatNumber(
                    peakPrediction,
                  )}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
            <SectionHeader
              icon={TrendingUp}
              eyebrow="Direction"
              title="Forecast trend"
              description="Direction detected from the selected forecast sequence."
            />

            <div className="mt-7">
              <TrendBadge
                trend={bestForecast?.trend}
              />

              <p className="mt-5 text-sm leading-7 text-slate-500">
                This trend describes the direction detected
                across the selected forecast horizon. It should
                be interpreted alongside the underlying monthly
                predictions.
              </p>
            </div>
          </section>
        </div>

        {/* MODEL COMPARISON */}
        <section>
          <SectionHeader
            icon={BarChart3}
            eyebrow="Model evaluation"
            title="Forecast model comparison"
            description="Validation metrics returned by the forecasting pipeline."
          />

          <ModelComparison
            models={
              forecast?.models ?? {}
            }
            bestModel={
              forecast?.best_model
            }
          />
        </section>

        {/* METHODOLOGY NOTE */}
        <section className="rounded-2xl border border-violet-400/10 bg-violet-400/[0.025] p-6">
          <div className="flex gap-4">
            <BrainCircuit className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />

            <div>
              <h3 className="text-sm font-semibold text-white">
                Forecast interpretation
              </h3>

              <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-500">
                Validation confidence shown here reflects the
                model&apos;s validation performance. It is not a
                probability that the future forecast will be
                correct, nor is it a statistical prediction
                interval. Longer horizons should therefore be
                interpreted as projected trajectories rather than
                exact future crime counts.
              </p>
            </div>
          </div>
        </section>

        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-700">
            Sentinel AI Intelligence Engine
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}