"use client";

import { useParams } from "next/navigation";

import Sidebar from "./sidebar";
import TopNavbar from "./top-navbar";
import SentinelChat from "@/features/ai/components/sentinel-chat";

interface DashboardLayoutProps {
  children: React.ReactNode;
  datasetId?: string | null;
}

export default function DashboardLayout({
  children,
  datasetId: providedDatasetId = null,
}: DashboardLayoutProps) {
  const params = useParams();

  const routeDatasetId =
    typeof params.datasetId === "string"
      ? params.datasetId
      : null;

  const datasetId =
    providedDatasetId ?? routeDatasetId;

  return (
    <div className="min-h-screen bg-[#050509] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[280px] shrink-0 lg:block">
          <div className="fixed inset-y-0 left-0 w-[280px]">
            <Sidebar />
          </div>
        </aside>

        {/* Main application area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNavbar />

          <main className="min-w-0 flex-1 overflow-x-hidden">
            <div className="mx-auto w-full max-w-[1800px] px-6 py-8 lg:px-10 lg:py-10">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Sentinel AI */}
      <SentinelChat datasetId={datasetId} />
    </div>
  );
}