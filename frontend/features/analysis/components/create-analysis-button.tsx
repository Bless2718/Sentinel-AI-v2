"use client";

import { useState } from "react";

import {
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import type { AnalysisConfiguration } from "./analysis-options";

interface CreateAnalysisButtonProps {
  datasetId: string | null;
  configuration: AnalysisConfiguration;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export default function CreateAnalysisButton({
  datasetId,
  configuration,
}: CreateAnalysisButtonProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleStartAnalysis() {
    if (!datasetId || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      /*
       * Keep the selected configuration available
       * to the analysis dashboard.
       *
       * We are not sending it to the backend yet
       * because the current backend contract has not
       * been verified to accept these fields.
       */
      sessionStorage.setItem(
        `sentinel-config-${datasetId}`,
        JSON.stringify(configuration),
      );

      const response = await fetch(
        `${API_BASE_URL}/intelligence/${datasetId}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        let message = "Analysis failed.";

        try {
          const data = await response.json();

          if (data?.detail) {
            message = data.detail;
          }
        } catch {
          // Keep default error message.
        }

        throw new Error(message);
      }

      const result = await response.json();

      sessionStorage.setItem(
        `sentinel-analysis-${datasetId}`,
        JSON.stringify(result),
      );

      router.push(
        `/dashboard/analysis/${datasetId}`,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate analysis.",
      );

      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!datasetId || loading}
          onClick={handleStartAnalysis}
          className="
            min-w-[240px]
            rounded-xl
            border
            border-violet-300/25
            bg-gradient-to-r
            from-violet-500
            via-violet-600
            to-purple-700
            px-6
            py-6
            font-serif
            text-base
            font-semibold
            tracking-[-0.01em]
            text-white
            shadow-[0_0_30px_rgba(139,92,246,0.18)]
            transition-all
            duration-300
            hover:scale-[1.015]
            hover:border-violet-200/35
            hover:from-violet-400
            hover:via-violet-500
            hover:to-purple-600
            hover:shadow-[0_0_38px_rgba(139,92,246,0.3)]
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:hover:scale-100
            disabled:hover:shadow-[0_0_30px_rgba(139,92,246,0.18)]
          "
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Intelligence...
            </>
          ) : datasetId ? (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Start Crime Analysis
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          ) : (
            "Upload Dataset First"
          )}
        </Button>
      </div>

      {loading && (
        <div
          className="
            rounded-xl
            border
            border-violet-400/[0.16]
            bg-violet-500/[0.045]
            px-5
            py-4
            font-serif
            text-sm
            leading-6
            text-violet-200
            shadow-[0_10px_35px_rgba(0,0,0,0.15)]
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-violet-300 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />

            <span>
              Sentinel AI is preprocessing your
              dataset and generating geospatial,
              trend, forecast, risk and AI
              intelligence.
            </span>
          </div>
        </div>
      )}

      {error && (
        <div
          className="
            rounded-xl
            border
            border-red-400/[0.18]
            bg-red-500/[0.06]
            px-5
            py-4
            font-serif
            text-sm
            leading-6
            text-red-300
            backdrop-blur-xl
          "
        >
          {error}
        </div>
      )}
    </div>
  );
}