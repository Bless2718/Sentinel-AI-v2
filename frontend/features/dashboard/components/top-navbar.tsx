"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ChevronRight, UserCircle } from "lucide-react";

export default function TopNavbar() {
  const pathname = usePathname();
  const params = useParams();

  const datasetId =
    typeof params.datasetId === "string"
      ? params.datasetId
      : null;

  const getPageName = () => {
    if (pathname.endsWith("/analytics")) {
      return "Analytics";
    }

    if (pathname.endsWith("/predictions")) {
      return "Predictions";
    }

    if (pathname.endsWith("/forecasting")) {
      return "Forecasting";
    }

    if (pathname.endsWith("/hotspots")) {
      return "Crime Hotspots";
    }

    if (datasetId) {
      return "Overview";
    }

    if (pathname.includes("new-analysis")) {
      return "New Analysis";
    }

    return "Dashboard";
  };

  const pageName = getPageName();

  return (
    <header className="sticky top-0 z-40 h-[76px] shrink-0 border-b border-white/[0.07] bg-[#07070c]">
      <div className="flex h-full items-center justify-between px-7 lg:px-10">
        {/* Breadcrumb */}
        <div className="flex min-w-0 items-center gap-2.5">
          <Link
            href={
              datasetId
                ? `/dashboard/analysis/${datasetId}`
                : "/dashboard/new-analysis"
            }
            className="font-serif text-[18px] tracking-tight text-white transition hover:text-violet-300"
          >
            Sentinel
          </Link>

          <ChevronRight className="h-4 w-4 text-white/20" />

          <span className="text-sm font-medium text-white/60">
            {pageName}
          </span>
        </div>

        {/* Profile */}
        <button
          type="button"
          className="group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition hover:bg-white/[0.04]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
            <UserCircle className="h-4.5 w-4.5 text-white/45 transition group-hover:text-violet-300" />
          </div>

          <span className="hidden text-sm font-medium text-white/65 transition group-hover:text-white sm:block">
            Profile
          </span>
        </button>
      </div>
    </header>
  );
}