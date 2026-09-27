"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  BrainCircuit,
  LineChart,
  MapPinned,
  Plus,
  ChevronRight,
  Shield,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const params = useParams();

  const datasetId =
    typeof params.datasetId === "string"
      ? params.datasetId
      : null;

  const basePath = datasetId
    ? `/dashboard/analysis/${datasetId}`
    : "/dashboard/new-analysis";

  const menu = [
    {
      title: "Overview",
      description: "Intelligence summary",
      href: basePath,
      icon: LayoutDashboard,
    },
    {
      title: "Analytics",
      description: "Historical intelligence",
      href: datasetId
        ? `${basePath}/analytics`
        : "/dashboard/new-analysis",
      icon: BarChart3,
    },
    {
      title: "Predictions",
      description: "Crime predictions",
      href: datasetId
        ? `${basePath}/predictions`
        : "/dashboard/new-analysis",
      icon: BrainCircuit,
    },
    {
      title: "Forecasting",
      description: "Future projections",
      href: datasetId
        ? `${basePath}/forecasting`
        : "/dashboard/new-analysis",
      icon: LineChart,
    },
    {
      title: "Crime Hotspots",
      description: "Geospatial intelligence",
      href: datasetId
        ? `${basePath}/hotspots`
        : "/dashboard/new-analysis",
      icon: MapPinned,
    },
  ];

  return (
    <div className="flex h-full w-full flex-col border-r border-white/[0.08] bg-[#07070c]">
      {/* Brand */}
      <div className="flex h-[88px] shrink-0 items-center border-b border-white/[0.08] px-7">
        <Link
          href={basePath}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/[0.08] shadow-[0_0_30px_rgba(139,92,246,0.08)]">
            <Shield className="h-5 w-5 text-violet-300" />
          </div>

          <div>
            <h1 className="font-serif text-[21px] leading-none tracking-tight text-white">
              Sentinel
            </h1>

            <p className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.28em] text-white/35">
              Crime Intelligence
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-7">
        <div className="mb-4 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/25">
            Intelligence
          </p>
        </div>

        <nav className="space-y-1.5">
          {menu.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.title === "Overview"
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`group relative flex min-h-[62px] items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "border border-violet-400/15 bg-violet-400/[0.09] shadow-[inset_0_0_30px_rgba(139,92,246,0.035)]"
                    : "border border-transparent hover:bg-white/[0.035]"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-7 w-[2px] -translate-y-1/2 rounded-r-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.7)]" />
                )}

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition ${
                    isActive
                      ? "bg-violet-400/10"
                      : "bg-white/[0.025] group-hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] transition ${
                      isActive
                        ? "text-violet-300"
                        : "text-white/35 group-hover:text-white/60"
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[13px] font-medium ${
                      isActive
                        ? "text-white"
                        : "text-white/60 group-hover:text-white/85"
                    }`}
                  >
                    {item.title}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-white/25">
                    {item.description}
                  </p>
                </div>

                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 transition ${
                    isActive
                      ? "text-violet-300/60"
                      : "text-white/10 group-hover:text-white/30"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* New Analysis */}
        <div className="mt-8 border-t border-white/[0.06] pt-7">
          <Link
            href="/dashboard/new-analysis"
            className="group flex min-h-[58px] items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 transition hover:border-violet-400/20 hover:bg-violet-400/[0.05]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025]">
              <Plus className="h-4 w-4 text-white/50 transition group-hover:text-violet-300" />
            </div>

            <div>
              <p className="text-[12px] font-medium text-white/75">
                New Analysis
              </p>

              <p className="mt-0.5 text-[10px] text-white/25">
                Analyze another dataset
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Dataset information */}
      <div className="shrink-0 border-t border-white/[0.08] p-5">
        {datasetId ? (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                Active Dataset
              </p>

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
            </div>

            <p className="mt-2 truncate font-mono text-[10px] text-white/45">
              {datasetId}
            </p>

            <p className="mt-2 text-[9px] text-emerald-400/60">
              Intelligence loaded
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
              Sentinel AI
            </p>

            <p className="mt-2 text-[10px] leading-relaxed text-white/30">
              Upload a dataset to begin crime intelligence analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}