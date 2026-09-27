"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  Crosshair,
  Map,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Target,
  Users,
} from "lucide-react";

import DashboardLayout from "@/features/dashboard/components/dashboard-layout";
import HotspotMap from "@/features/analysis/components/hotspot-map";

import {
  generateIntelligence,
  type IntelligenceResponse,
} from "@/features/analysis/intelligence-api";

type Hotspot = {
  location?: {
    latitude?: number;
    longitude?: number;
  };
  crime_count?: number;
};

type Cluster = {
  cluster_id?: number;
  crime_count?: number;
  density?: number;
  risk_score?: number;
};

type GeoSummary = {
  hotspot_count?: number;
  cluster_count?: number;
  highest_risk_score?: number;
  average_density?: number;
  maximum_density?: number;
  heatmap_points?: number;
};

type GeoStatistics = {
  total_clusters?: number;
  active_clusters?: number;
  isolated_points?: number;
  total_crimes?: number;
  average_cluster_size?: number;
  largest_cluster_size?: number;
  average_risk_score?: number;
  highest_risk_score?: number;
};

function formatNumber(
  value: number | undefined | null,
): string {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return "—";
  }

  return new Intl.NumberFormat("en-IN").format(value);
}

function formatDecimal(
  value: number | undefined | null,
): string {
  if (
    value === undefined ||
    value === null ||
    Number.isNaN(value)
  ) {
    return "—";
  }

  return value.toFixed(2);
}

function formatCoordinate(
  value: number | undefined,
): string {
  if (value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return value.toFixed(6);
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
        <h2 className="font-serif text-xl text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
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

          <p className="mt-3 font-serif text-2xl text-white">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-slate-600">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20">
          <Icon className="h-5 w-5 text-violet-300" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  message,
  icon: Icon = Map,
}: {
  message: string;
  icon?: ElementType;
}) {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/10">
      <div className="text-center">
        <Icon className="mx-auto h-8 w-8 text-slate-700" />

        <p className="mt-3 text-sm text-slate-500">
          {message}
        </p>
      </div>
    </div>
  );
}

function getRiskLabel(
  score: number | undefined,
): string {
  if (
    score === undefined ||
    Number.isNaN(score)
  ) {
    return "UNKNOWN";
  }

  if (score >= 75) {
    return "CRITICAL";
  }

  if (score >= 50) {
    return "HIGH";
  }

  if (score >= 25) {
    return "MEDIUM";
  }

  return "LOW";
}

function getRiskTextClass(
  score: number | undefined,
): string {
  if (
    score === undefined ||
    Number.isNaN(score)
  ) {
    return "text-slate-400";
  }

  if (score >= 75) {
    return "text-red-300";
  }

  if (score >= 50) {
    return "text-orange-300";
  }

  if (score >= 25) {
    return "text-amber-300";
  }

  return "text-emerald-300";
}

function getRiskBorderClass(
  score: number | undefined,
): string {
  if (
    score === undefined ||
    Number.isNaN(score)
  ) {
    return "border-white/10";
  }

  if (score >= 75) {
    return "border-red-400/20";
  }

  if (score >= 50) {
    return "border-orange-400/20";
  }

  if (score >= 25) {
    return "border-amber-400/20";
  }

  return "border-emerald-400/20";
}

export default function HotspotsPage() {
  const params = useParams();

  const datasetId = params?.datasetId as string;

  const [data, setData] =
    useState<IntelligenceResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

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
          const cached =
            sessionStorage.getItem(
              `sentinel-analysis-${datasetId}`,
            );

          if (cached) {
            try {
              const parsed =
                JSON.parse(
                  cached,
                ) as IntelligenceResponse;

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

        const result =
          await generateIntelligence(
            datasetId,
            12,
          );

        setData(result);

        sessionStorage.setItem(
          `sentinel-analysis-${datasetId}`,
          JSON.stringify(result),
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load hotspot intelligence.";

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

  const geospatial =
    data?.geospatial;

  const summary =
    useMemo<GeoSummary>(() => {
      if (
        geospatial?.summary &&
        typeof geospatial.summary ===
          "object"
      ) {
        return geospatial.summary as GeoSummary;
      }

      return {};
    }, [geospatial?.summary]);

  const statistics =
    useMemo<GeoStatistics>(() => {
      if (
        geospatial?.statistics &&
        typeof geospatial.statistics ===
          "object"
      ) {
        return geospatial.statistics as GeoStatistics;
      }

      return {};
    }, [geospatial?.statistics]);

  const hotspots =
    useMemo<Hotspot[]>(() => {
      if (
        !Array.isArray(
          geospatial?.hotspots,
        )
      ) {
        return [];
      }

      return geospatial.hotspots
        .filter(
          (item): item is Hotspot =>
            typeof item === "object" &&
            item !== null,
        )
        .sort(
          (a, b) =>
            (b.crime_count ?? 0) -
            (a.crime_count ?? 0),
        );
    }, [geospatial?.hotspots]);

  const clusters =
    useMemo<Cluster[]>(() => {
      if (
        !Array.isArray(
          geospatial?.clusters,
        )
      ) {
        return [];
      }

      return geospatial.clusters
        .filter(
          (item): item is Cluster =>
            typeof item === "object" &&
            item !== null,
        )
        .sort(
          (a, b) =>
            (b.risk_score ?? 0) -
            (a.risk_score ?? 0),
        );
    }, [geospatial?.clusters]);

  const highestRisk = Math.max(
    summary.highest_risk_score ?? 0,
    statistics.highest_risk_score ?? 0,
    ...clusters.map(
      (cluster) =>
        cluster.risk_score ?? 0,
    ),
  );

  const totalHotspotCrimes =
    hotspots.reduce(
      (total, hotspot) =>
        total +
        (hotspot.crime_count ?? 0),
      0,
    );

  if (loading && !data) {
    return (
      <DashboardLayout
        datasetId={datasetId}
      >
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-violet-300" />

            <p className="mt-4 text-sm text-slate-500">
              Loading geospatial intelligence...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !data) {
    return (
      <DashboardLayout
        datasetId={datasetId}
      >
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="max-w-md rounded-2xl border border-red-400/20 bg-red-500/[0.04] p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-300" />

            <h1 className="mt-4 font-serif text-xl text-white">
              Unable to load hotspots
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                loadData(true)
              }
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
    <DashboardLayout
      datasetId={datasetId}
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-8">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-8 bg-violet-400/50" />

              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-violet-300">
                Geospatial Intelligence
              </span>
            </div>

            <h1 className="font-serif text-4xl tracking-tight text-white md:text-5xl">
              Crime Hotspots
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Geographic concentration of recorded
              crime, spatial clusters, and assessed
              location intensity.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadData(true)
            }
            disabled={refreshing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-slate-300 transition-colors hover:border-violet-400/20 hover:bg-violet-500/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh Analysis
          </button>
        </div>

        {/* ERROR */}
        {error && data && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-500/[0.04] px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-300" />

            <p className="text-sm text-amber-200/80">
              {error}
            </p>
          </div>
        )}

        {/* METRICS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={MapPin}
            label="Hotspots"
            value={formatNumber(
              summary.hotspot_count,
            )}
            description="Detected geographic concentrations"
          />

          <MetricCard
            icon={Target}
            label="Clusters"
            value={formatNumber(
              summary.cluster_count ??
                statistics.total_clusters,
            )}
            description="Spatial crime clusters"
          />

          <MetricCard
            icon={ShieldAlert}
            label="Highest Risk"
            value={formatDecimal(
              highestRisk,
            )}
            description={getRiskLabel(
              highestRisk,
            )}
          />

          <MetricCard
            icon={Crosshair}
            label="Hotspot Crimes"
            value={formatNumber(
              totalHotspotCrimes,
            )}
            description="Crimes represented by hotspots"
          />
        </section>

        {/* REAL GEOGRAPHICAL MAP */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
          <SectionHeader
            icon={Map}
            title="Crime Intensity Map"
            description="Interactive geographic visualization of detected crime hotspots."
          />

          {hotspots.length > 0 ? (
            <>
              <HotspotMap
                hotspots={hotspots}
              />

              <div className="mt-4 flex flex-col gap-2 text-xs text-slate-600 md:flex-row md:items-center md:justify-between">
                <p>
                  Circle size represents relative crime
                  volume at each detected hotspot.
                </p>

                <p>
                  Click a hotspot for its coordinates and
                  crime count.
                </p>
              </div>
            </>
          ) : (
            <EmptyState
              message="No geographic hotspot coordinates were returned."
              icon={MapPin}
            />
          )}
        </section>

        {/* SPATIAL SUMMARY */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
          <SectionHeader
            icon={Map}
            title="Spatial Summary"
            description="Summary statistics produced by the geospatial analysis pipeline."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-white/5 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Average Density
              </p>

              <p className="mt-2 font-serif text-xl text-white">
                {formatDecimal(
                  summary.average_density,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Maximum Density
              </p>

              <p className="mt-2 font-serif text-xl text-white">
                {formatDecimal(
                  summary.maximum_density,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Active Clusters
              </p>

              <p className="mt-2 font-serif text-xl text-white">
                {formatNumber(
                  statistics.active_clusters,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/10 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                Isolated Points
              </p>

              <p className="mt-2 font-serif text-xl text-white">
                {formatNumber(
                  statistics.isolated_points,
                )}
              </p>
            </div>
          </div>
        </section>

        {/* HOTSPOT TABLE */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
          <SectionHeader
            icon={MapPin}
            title="Hotspot Locations"
            description="Highest-volume geographic hotspots returned by the backend."
          />

          {hotspots.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-600">
                      #
                    </th>

                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-600">
                      Latitude
                    </th>

                    <th className="px-4 py-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-600">
                      Longitude
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-[0.14em] text-slate-600">
                      Crime Count
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {hotspots
                    .slice(0, 25)
                    .map(
                      (
                        hotspot,
                        index,
                      ) => (
                        <tr
                          key={`table-${index}-${hotspot.location?.latitude}-${hotspot.location?.longitude}`}
                          className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-4 text-sm text-slate-500">
                            {index + 1}
                          </td>

                          <td className="px-4 py-4 font-mono text-sm text-slate-300">
                            {formatCoordinate(
                              hotspot.location
                                ?.latitude,
                            )}
                          </td>

                          <td className="px-4 py-4 font-mono text-sm text-slate-300">
                            {formatCoordinate(
                              hotspot.location
                                ?.longitude,
                            )}
                          </td>

                          <td className="px-4 py-4 text-right text-sm font-medium text-white">
                            {formatNumber(
                              hotspot.crime_count,
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                </tbody>
              </table>

              {hotspots.length >
                25 && (
                <p className="mt-4 text-xs text-slate-600">
                  Showing the 25 highest-volume
                  hotspots.
                </p>
              )}
            </div>
          ) : (
            <EmptyState message="No hotspot records are available." />
          )}
        </section>

        {/* CLUSTERS */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-xl">
          <SectionHeader
            icon={Target}
            title="Spatial Clusters"
            description="Clusters identified from the geographic crime distribution."
          />

          {clusters.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {clusters
                .slice(0, 12)
                .map(
                  (
                    cluster,
                    index,
                  ) => {
                    const riskScore =
                      cluster.risk_score ??
                      0;

                    return (
                      <div
                        key={`cluster-${cluster.cluster_id ?? index}`}
                        className={`rounded-xl border bg-black/10 p-5 ${getRiskBorderClass(
                          riskScore,
                        )}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.15em] text-slate-600">
                              Cluster
                            </p>

                            <p className="mt-1 font-serif text-xl text-white">
                              #
                              {cluster.cluster_id ??
                                index}
                            </p>
                          </div>

                          <div className="text-right">
                            <p
                              className={`text-sm font-medium ${getRiskTextClass(
                                riskScore,
                              )}`}
                            >
                              {getRiskLabel(
                                riskScore,
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              Risk{" "}
                              {formatDecimal(
                                riskScore,
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-lg border border-white/5 bg-black/20 p-3">
                            <p className="text-xs text-slate-600">
                              Crimes
                            </p>

                            <p className="mt-1 text-sm text-white">
                              {formatNumber(
                                cluster.crime_count,
                              )}
                            </p>
                          </div>

                          <div className="rounded-lg border border-white/5 bg-black/20 p-3">
                            <p className="text-xs text-slate-600">
                              Density
                            </p>

                            <p className="mt-1 text-sm text-white">
                              {formatDecimal(
                                cluster.density,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
            </div>
          ) : (
            <EmptyState
              message="No spatial cluster records are available."
              icon={Target}
            />
          )}
        </section>

        {/* FOOTER */}
        <div className="border-t border-white/5 pt-6">
          <div className="flex flex-col justify-between gap-3 text-xs text-slate-600 md:flex-row">
            <p>
              Sentinel AI · Geospatial Intelligence
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