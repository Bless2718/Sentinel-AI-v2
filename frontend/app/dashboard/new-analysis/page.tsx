"use client";

import { useState } from "react";
import {
  Activity,
  BrainCircuit,
  ChevronRight,
  FileBarChart,
  Globe2,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import AnalysisOptions, {
  type AnalysisConfiguration,
} from "@/features/analysis/components/analysis-options";

import AnalysisUpload from "@/features/analysis/components/analysis-upload";
import CreateAnalysisButton from "@/features/analysis/components/create-analysis-button";
import DashboardLayout from "@/features/dashboard/components/dashboard-layout";

const modules = [
  {
    icon: TrendingUp,
    title: "Trend Analysis",
    description:
      "Identify long-term crime patterns, seasonal behavior and emerging changes.",
  },
  {
    icon: Activity,
    title: "Crime Forecasting",
    description:
      "Project future crime activity using predictive models.",
  },
  {
    icon: ShieldAlert,
    title: "Risk Analysis",
    description:
      "Evaluate operational risk using historical and predicted crime activity.",
  },
  {
    icon: Globe2,
    title: "Geospatial Intelligence",
    description:
      "Discover hotspots, clusters and geographic concentrations.",
  },
  {
    icon: BrainCircuit,
    title: "AI Intelligence",
    description:
      "Generate an executive interpretation of the analytical results.",
  },
  {
    icon: FileBarChart,
    title: "Explainability",
    description:
      "Understand the factors contributing to analytical conclusions.",
  },
];

const defaultConfiguration: AnalysisConfiguration = {
  analysisName: "",
  forecastGoal: "Complete Intelligence Report",
  predictionWindow: "30 Days",
  geographicScope: "Entire Dataset",
  forecastModel: "Automatic (Recommended)",
};

export default function NewAnalysisPage() {
  const [datasetId, setDatasetId] =
    useState<string | null>(null);

  const [configuration, setConfiguration] =
    useState<AnalysisConfiguration>(
      defaultConfiguration
    );

  return (
    <DashboardLayout>
      <main className="min-h-screen bg-[#05030d] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* HERO */}
          <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-[#080610] via-[#0b0815] to-violet-950/20 px-6 py-10 shadow-2xl shadow-black/40 sm:px-10 lg:px-12">

            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-500/[0.08] blur-3xl" />

            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-purple-600/[0.07] blur-3xl" />

            <div className="relative max-w-3xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/[0.06] px-4 py-2">
                <Sparkles className="h-4 w-4 text-violet-300" />

                <span className="font-serif text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-200">
                  Sentinel AI Intelligence Engine
                </span>
              </div>

              <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl">
                Transform crime data into

                <span className="block bg-gradient-to-r from-violet-200 via-purple-300 to-violet-500 bg-clip-text text-transparent">
                  actionable intelligence.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl font-serif text-base leading-7 text-slate-400">
                Upload your crime dataset and let Sentinel AI
                analyze patterns, forecast future activity,
                identify geographic hotspots and generate
                intelligence for operational decision-making.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <div className="rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2 font-serif text-xs text-slate-400 backdrop-blur-xl">
                  Statistical Analysis
                </div>

                <div className="rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2 font-serif text-xs text-slate-400 backdrop-blur-xl">
                  Predictive Intelligence
                </div>

                <div className="rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2 font-serif text-xs text-slate-400 backdrop-blur-xl">
                  Geospatial Analysis
                </div>

                <div className="rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2 font-serif text-xs text-slate-400 backdrop-blur-xl">
                  AI Explainability
                </div>

              </div>
            </div>
          </section>

          {/* WORKSPACE */}
          <section className="mt-8">

            <div className="mb-5">
              <p className="font-serif text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Analysis Workspace
              </p>

              <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.02em] text-white">
                Start a new intelligence analysis
              </h2>

              <p className="mt-2 font-serif text-sm text-slate-500">
                Upload your dataset first, then configure the
                intelligence engine.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">

              {/* UPLOAD */}
              <AnalysisUpload
                onDatasetUploaded={setDatasetId}
              />

              {/* ANALYSIS PIPELINE */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#090711]/80 p-6 shadow-xl shadow-black/30 backdrop-blur-xl">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/[0.06]">
                    <BrainCircuit className="h-5 w-5 text-violet-300" />
                  </div>

                  <div>
                    <p className="font-serif text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                      Intelligence Engine
                    </p>

                    <h3 className="mt-1 font-serif font-semibold text-white">
                      Analysis pipeline
                    </h3>
                  </div>

                </div>

                <div className="mt-7 space-y-3">

                  {[
                    "Dataset validation",
                    "Data preprocessing",
                    "Statistical analysis",
                    "Geospatial intelligence",
                    "Trend detection",
                    "Predictive forecasting",
                    "Risk assessment",
                    "AI interpretation",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.055] bg-white/[0.018] px-4 py-3 transition-colors duration-300 hover:border-violet-400/15 hover:bg-violet-400/[0.025]"
                    >
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          datasetId
                            ? "border border-violet-400/20 bg-violet-400/[0.08] text-violet-300"
                            : "border border-white/[0.06] bg-white/[0.035] text-slate-600"
                        }`}
                      >
                        <span className="font-serif text-[10px] font-semibold">
                          {index + 1}
                        </span>
                      </div>

                      <span className="font-serif text-sm text-slate-400">
                        {item}
                      </span>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </section>

          {/* CAPABILITIES */}
          <section className="mt-10">

            <div className="mb-6">
              <p className="font-serif text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Intelligence Modules
              </p>

              <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.02em] text-white">
                One dataset. Multiple intelligence layers.
              </h2>

              <p className="mt-2 max-w-2xl font-serif text-sm leading-6 text-slate-500">
                Sentinel AI combines statistical, temporal,
                geospatial and predictive analysis into one
                intelligence workflow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {modules.map((module) => {
                const Icon = module.icon;

                return (
                  <div
                    key={module.title}
                    className="group rounded-2xl border border-white/[0.08] bg-[#090711]/70 p-6 shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-[#0d0918]"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.045]">
                        <Icon className="h-5 w-5 text-violet-300" />
                      </div>

                      <ChevronRight className="h-4 w-4 text-slate-700 transition duration-300 group-hover:translate-x-1 group-hover:text-violet-300" />

                    </div>

                    <h3 className="mt-5 font-serif font-semibold tracking-[-0.01em] text-white">
                      {module.title}
                    </h3>

                    <p className="mt-2 font-serif text-sm leading-6 text-slate-500">
                      {module.description}
                    </p>

                  </div>
                );
              })}

            </div>
          </section>

          {/* CONFIGURATION */}
          <section className="mt-10">

            <AnalysisOptions
              onChange={setConfiguration}
            />

          </section>

          {/* START */}
          <section className="mt-8">

            <div className="rounded-2xl border border-violet-400/[0.12] bg-gradient-to-r from-violet-500/[0.045] via-purple-500/[0.035] to-violet-500/[0.045] p-6 shadow-xl shadow-black/20 sm:p-8">

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div>

                  <p className="font-serif text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                    Ready to analyze
                  </p>

                  <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.02em] text-white">
                    Generate your intelligence report
                  </h2>

                  <p className="mt-2 max-w-2xl font-serif text-sm leading-6 text-slate-500">
                    Sentinel AI will process your dataset and
                    generate the complete analytical intelligence
                    dashboard.
                  </p>

                </div>

                <div className="shrink-0">

                  <CreateAnalysisButton
                    datasetId={datasetId}
                    configuration={configuration}
                  />

                </div>

              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="mt-10 flex flex-col justify-between gap-3 border-t border-white/[0.06] py-6 font-serif text-xs text-slate-600 sm:flex-row">

            <span>
              Sentinel AI Intelligence Platform
            </span>

            <span>
              Statistical • Predictive • Geospatial • AI
            </span>

          </footer>

        </div>
      </main>
    </DashboardLayout>
  );
}