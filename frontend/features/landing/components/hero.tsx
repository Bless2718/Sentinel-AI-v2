"use client";

import { motion } from "framer-motion";
import DashboardPreview from "./dashboard-preview";
import AnimatedBadge from "@/components/ui/animated-badge";
import GradientButton from "@/components/ui/gradient-button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Cyan Glow */}
      <div className="absolute left-1/2 top-0 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col items-center justify-center gap-20 px-6 py-20 lg:flex-row">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1"
        >
          <AnimatedBadge text="AI Powered Crime Intelligence Platform" />

          <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
            Transform
            <span className="block bg-gradient-to-r from-primary via-violet-400 to-indigo-500 bg-clip-text text-transparent">
              Crime Data
            </span>
            Into Intelligence
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-400">
            Upload any crime dataset and let Sentinel AI automatically clean,
            analyze, visualize, forecast and generate investigative insights—
            all in one intelligent platform.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <GradientButton href="/register">
              Get Started
            </GradientButton>

            <button className="rounded-xl border border-slate-700 px-6 py-3 font-medium text-slate-300 transition hover:border-cyan-500 hover:text-white">
              Live Demo
            </button>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <DashboardPreview />
        </motion.div>

      </div>
    </section>
  );
}