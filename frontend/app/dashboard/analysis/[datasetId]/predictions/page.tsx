"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  RefreshCw,
  Target,
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
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDecimal(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "—";
  }

  return value.toFixed(2);
}

function formatPercentage(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) {
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
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatHorizon(period: number) {
  if (period === 1) return "1 Month";
  if (period < 12) return `${period} Months`;
  if (period === 12) return "1 Year";
  return `${period / 12} Years`;
}

function normalizePeriod(period: number | string) {
  return String(period);
}

function buildChartData(
  models: Record<string, ForecastModel> | undefined,
) {
  if (!models) {
    return [];
  }

  const entries = Object.entries(models);

  const allPeriods = new Map<
    string,
    {
      period: string;
      [key: string]: string | number;
    }
  >();

  entries.forEach(([modelKey, model]) => {
    const predictions = model.predictions ?? [];

    predictions.forEach(
      (prediction: ForecastPrediction) => {
        const period = normalizePeriod(prediction.period);

        if (!allPeriods.has(period)) {
          allPeriods.set(period, {
            period,
          });
        }

        allPeriods.get(period)![modelKey] = Number(
          prediction.prediction,
        );
      },
    );
  });

  return Array.from(allPeriods.values());
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

function ModelBadge({
  selected,
}: {
  selected: boolean;
}) {
  if (!selected) {
    return (
      <span className="text-[10px] uppercase tracking-[0.16em] text-slate-600">
        Compared
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">
      <CheckCircle2 className="h-3 w-3" />
      Selected
    </span>
  );
}

function TrendIndicator({
  predictions,
}: {
  predictions?: ForecastPrediction[];
}) {
  if (!predictions || predictions.length < 2) {
    return (
      <span className="text-xs text-slate-600">
        Insufficient data
      </span>
    );
  }

  const first = Number(predictions[0].prediction);
  const last = Number(
    predictions[predictions.length - 1].prediction,
  );

  if (last > first) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-amber-300">
        <TrendingUp className="h-3.5 w-3.5" />
        Increasing
      </span>
    );
  }

  if (last < first) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300">
        <TrendingDown className="h-3.5 w-3.5" />
        Decreasing
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-violet-300">
      <Activity className="h-3.5 w-3.5" />
      Stable
    </span>
  );
}

export default function PredictionsPage() {
  const params = useParams();

  const datasetId = params.datasetId as string;

  const [result, setResult] =
    useState<IntelligenceResponse | null>(null);

  const [selectedPeriod, setSelectedPeriod] =
    useState<ForecastPeriod>(12);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function loadPredictions(
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
        "Prediction request failed:",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to generate predictions.",
      );
    } finally {
      setRefreshing(false);
    }
  }

  const forecast = result?.forecast;
  const models = forecast?.models ?? {};
  const bestModel = forecast?.best_model;

  const chartData = useMemo(
    () => buildChartData(models),
    [models],
  );

  const modelEntries = Object.entries(models);

  const averageByModel = useMemo(() => {
    const averages: Record<string, number> = {};

    modelEntries.forEach(([name, model]) => {
      const predictions =
        model.predictions ?? [];

      if (!predictions.length) {
        return;
      }

      const total = predictions.reduce(
        (sum, item) =>
          sum + Number(item.prediction),
        0,
      );

      averages[name] =
        total / predictions.length;
    });

    return averages;
  }, [modelEntries]);

  const peakByModel = useMemo(() => {
    const peaks: Record<string, number> = {};

    modelEntries.forEach(([name, model]) => {
      const predictions =
        model.predictions ?? [];

      if (!predictions.length) {
        return;
      }

      peaks[name] = Math.max(
        ...predictions.map((item) =>
          Number(item.prediction),
        ),
      );
    });

    return peaks;
  }, [modelEntries]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />

            <p className="mt-4 text-sm text-slate-500">
              Loading prediction intelligence...
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
              Sentinel AI / Predictions
            </p>

            <h1 className="mt-3 font-serif text-4xl tracking-tight text-white md:text-5xl">
              Crime Predictions
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Compare the predictions generated by each
              forecasting model and examine their validation
              performance.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadPredictions(selectedPeriod)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-400/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            Refresh Predictions
          </button>
        </div>

        {/* HORIZON */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-violet-300" />

                <h2 className="font-serif text-xl text-white">
                  Prediction Horizon
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Choose the future period used to generate
                model predictions.
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
                        loadPredictions(period)
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
              Prediction generation failed
            </p>

            <p className="mt-1 text-sm text-red-300/70">
              {error}
            </p>
          </div>
        )}

        {/* OVERVIEW */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Models evaluated"
            value={formatNumber(
              modelEntries.length,
            )}
            description="Forecasting models in the pipeline"
          />

          <MetricCard
            label="Selected model"
            value={formatModelName(bestModel)}
            description="Model with the lowest validation MAE"
          />

          <MetricCard
            label="Selected MAE"
            value={formatDecimal(
              forecast?.best_forecast?.mae,
            )}
            description="Mean absolute validation error"
          />

          <MetricCard
            label="Selected R²"
            value={formatDecimal(
              forecast?.best_forecast?.r2_score,
            )}
            description="Validation coefficient of determination"
          />
        </div>

        {/* MODEL CARDS */}
        <section>
          <SectionHeader
            icon={BrainCircuit}
            eyebrow="Model outputs"
            title="Prediction models"
            description="Individual predictions and validation metrics returned by the forecasting pipeline."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {modelEntries.map(
              ([name, model]) => {
                const selected =
                  name.toLowerCase() ===
                  bestModel?.toLowerCase();

                return (
                  <div
                    key={name}
                    className={`relative overflow-hidden rounded-2xl border bg-white/[0.025] p-6 backdrop-blur-xl ${
                      selected
                        ? "border-violet-400/30 shadow-[0_0_50px_rgba(139,92,246,0.06)]"
                        : "border-white/10"
                    }`}
                  >
                    {selected && (
                      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />
                    )}

                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                            Forecast model
                          </p>

                          <h3 className="mt-2 font-serif text-2xl text-white">
                            {formatModelName(
                              model.model_name ||
                                name,
                            )}
                          </h3>
                        </div>

                        <ModelBadge
                          selected={selected}
                        />
                      </div>

                      <div className="mt-7 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">
                            MAE
                          </p>

                          <p className="mt-2 text-lg font-medium text-slate-200">
                            {formatDecimal(
                              model.mae,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">
                            RMSE
                          </p>

                          <p className="mt-2 text-lg font-medium text-slate-200">
                            {formatDecimal(
                              model.rmse,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">
                            R²
                          </p>

                          <p className="mt-2 text-lg font-medium text-slate-200">
                            {formatDecimal(
                              model.r2_score,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">
                            Confidence
                          </p>

                          <p className="mt-2 text-lg font-medium text-slate-200">
                            {formatPercentage(
                              model.confidence,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-7 border-t border-white/5 pt-5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600">
                            Prediction direction
                          </span>

                          <TrendIndicator
                            predictions={
                              model.predictions
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </section>

        {/* COMPARISON CHART */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl md:p-8">
          <SectionHeader
            icon={BarChart3}
            eyebrow="Prediction comparison"
            title="Model prediction trajectories"
            description="Compare the future crime-count predictions generated by each forecasting model."
          />

          {chartData.length > 0 ? (
            <div className="h-[440px] w-full">
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
                    formatter={(value, name) => [
                      formatNumber(Number(value)),
                      formatModelName(String(name)),
                    ]}
                  />

                  <Legend
                    wrapperStyle={{
                      color: "#94a3b8",
                      fontSize: 12,
                    }}
                  />

                  {modelEntries.map(
                    ([name, model], index) => (
                      <Line
                        key={name}
                        type="monotone"
                        dataKey={name}
                        name={
                          model.model_name ||
                          name
                        }
                        strokeWidth={
                          name.toLowerCase() ===
                          bestModel?.toLowerCase()
                            ? 2.8
                            : 1.8
                        }
                        stroke={
                          index === 0
                            ? "#a78bfa"
                            : index === 1
                              ? "#c4b5fd"
                              : "#8b5cf6"
                        }
                        dot={false}
                        activeDot={{
                          r: 4,
                        }}
                      />
                    ),
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[360px] items-center justify-center rounded-xl border border-dashed border-white/10">
              <p className="text-sm text-slate-500">
                No prediction data available.
              </p>
            </div>
          )}
        </section>

        {/* MODEL STATISTICS */}
        <section>
          <SectionHeader
            icon={Activity}
            eyebrow="Prediction statistics"
            title="Projected activity by model"
            description="Summary statistics calculated from the returned prediction sequences."
          />

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="border-b border-white/10 bg-white/[0.025]">
                  <tr>
                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Model
                    </th>

                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Predictions
                    </th>

                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Average
                    </th>

                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Peak
                    </th>

                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      MAE
                    </th>

                    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      R²
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {modelEntries.map(
                    ([name, model]) => {
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
                                  model.model_name ||
                                    name,
                                )}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-5 font-mono text-sm text-slate-300">
                            {formatNumber(
                              model.predictions
                                ?.length,
                            )}
                          </td>

                          <td className="px-5 py-5 font-mono text-sm text-slate-300">
                            {formatNumber(
                              averageByModel[
                                name
                              ],
                            )}
                          </td>

                          <td className="px-5 py-5 font-mono text-sm text-slate-300">
                            {formatNumber(
                              peakByModel[name],
                            )}
                          </td>

                          <td className="px-5 py-5 font-mono text-sm text-slate-300">
                            {formatDecimal(
                              model.mae,
                            )}
                          </td>

                          <td className="px-5 py-5 font-mono text-sm text-slate-300">
                            {formatDecimal(
                              model.r2_score,
                            )}
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* INTERPRETATION */}
        <section className="rounded-2xl border border-violet-400/10 bg-violet-400/[0.025] p-6">
          <div className="flex gap-4">
            <BrainCircuit className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />

            <div>
              <h3 className="text-sm font-semibold text-white">
                Prediction interpretation
              </h3>

              <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-500">
                The model comparison reflects validation
                performance from the forecasting pipeline.
                The selected model is determined by the current
                MAE-based model selector. Confidence represents
                the model&apos;s validation-derived confidence and
                should not be interpreted as a probability that
                an individual future prediction will be correct.
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