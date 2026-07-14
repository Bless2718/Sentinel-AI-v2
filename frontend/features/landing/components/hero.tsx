"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import DashboardPreview from "./dashboard-preview";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col items-center justify-center gap-16 px-6 py-20 lg:flex-row">
        {/* Left */}
        <div className="flex-1 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            <Sparkles className="h-4 w-4" />
            AI Powered Crime Intelligence Platform
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white md:text-7xl">
            Transform
            <span className="block text-cyan-400">
              Crime Data
            </span>
            into Intelligence
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
            Upload any crime dataset and let Sentinel AI automatically
            clean, analyze, visualize, forecast and generate
            investigative insights—all in one intelligent platform.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/register">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
        </div>

        {/* Right */}
        <div className="w-full max-w-xl flex-1">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}