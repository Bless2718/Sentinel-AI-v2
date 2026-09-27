"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Database,
  FileSearch,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Activity,
  ChevronRight,
  Lock,
} from "lucide-react";
import Link from "next/link";

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const features = [
  {
    icon: Database,
    number: "01",
    title: "Data Intelligence",
    description:
      "Automatically understand, validate and prepare complex crime datasets for analysis.",
  },
  {
    icon: TrendingUp,
    number: "02",
    title: "Trend Analysis",
    description:
      "Reveal temporal patterns, seasonal behaviour and significant changes in crime activity.",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Crime Forecasting",
    description:
      "Use predictive models to estimate future crime activity and compare model performance.",
  },
  {
    icon: MapPin,
    number: "04",
    title: "Geospatial Intelligence",
    description:
      "Identify hotspots, clusters and geographic concentrations hidden inside your data.",
  },
  {
    icon: ShieldCheck,
    number: "05",
    title: "Risk Assessment",
    description:
      "Convert analytical findings into understandable risk scores, alerts and recommendations.",
  },
  {
    icon: BrainCircuit,
    number: "06",
    title: "AI Intelligence",
    description:
      "Turn complex analytical outputs into concise, explainable intelligence for decision-making.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050609] text-white">
      {/* =========================================================
          GLOBAL BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[750px] w-[900px] -translate-x-1/2 rounded-full bg-violet-700/[0.07] blur-[180px]" />

        <div className="absolute left-[-300px] top-[35%] h-[600px] w-[600px] rounded-full bg-indigo-700/[0.05] blur-[180px]" />

        <div className="absolute right-[-300px] top-[55%] h-[600px] w-[600px] rounded-full bg-purple-700/[0.05] blur-[180px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.8) 0.5px, transparent 0.5px)",
            backgroundSize: "5px 5px",
          }}
        />
      </div>

      {/* =========================================================
          NAVIGATION
      ========================================================= */}

      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-3 sm:px-6">
        <div className="mx-auto flex h-[74px] max-w-[1500px] items-center rounded-2xl border border-white/[0.08] bg-[#08080d]/80 px-5 shadow-2xl shadow-black/30 backdrop-blur-2xl lg:px-7">
          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center tracking-tight"
          >
            <span className="text-[24px] font-semibold text-white">
              Sentinel
            </span>

            <span className="text-[24px] font-semibold text-violet-400">
              AI
            </span>
          </Link>

          {/* NAVIGATION */}

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex">
            <a
              href="#home"
              className="text-sm text-white transition hover:text-violet-300"
            >
              Home
            </a>

            <a
              href="#capabilities"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Capabilities
            </a>

            <a
              href="#workflow"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#about"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              About
            </a>

            <Link
              href="/dashboard/new-analysis"
              className="flex items-center gap-1.5 text-sm text-violet-300 transition hover:text-violet-200"
            >
              Sentinel AI
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </nav>

          {/* AUTH */}

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.04] hover:text-white sm:block"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-lg border border-violet-400/30 bg-violet-500/[0.12] px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_25px_rgba(139,92,246,0.12)] transition hover:border-violet-400/50 hover:bg-violet-500/[0.18]"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section
        id="home"
        className="relative min-h-screen overflow-hidden pt-32"
      >
        {/* Decorative light */}

        <div className="pointer-events-none absolute right-[8%] top-[15%] h-[450px] w-[450px] rounded-full bg-violet-600/[0.08] blur-[140px]" />

        <div className="pointer-events-none absolute left-[30%] top-[20%] h-[300px] w-[500px] rounded-full bg-indigo-500/[0.04] blur-[120px]" />

        <div className="relative mx-auto grid max-w-[1500px] gap-20 px-6 pb-28 pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-12 lg:pt-24">
          {/* =====================================================
              HERO COPY
          ===================================================== */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative z-10"
          >
            <motion.div variants={fadeUp}>
              <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.025] px-4 py-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/15">
                  <Sparkles className="h-3 w-3 text-violet-300" />
                </span>

                <span className="text-xs font-medium tracking-wide text-slate-300">
                  AI-powered crime intelligence
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="max-w-[720px] text-[56px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-[70px] lg:text-[82px]"
            >
              Turn crime data
              <br />

              <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
                into intelligence.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-[620px] text-[17px] leading-8 text-slate-400 sm:text-[18px]"
            >
              Sentinel AI transforms raw crime datasets into
              structured intelligence through automated
              preprocessing, statistical analysis,
              forecasting, geospatial modelling and AI-driven
              interpretation.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/register"
                className="group flex items-center gap-3 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-slate-100"
              >
                Start analyzing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#capabilities"
                className="flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.025] px-6 py-3.5 text-sm font-medium text-slate-300 transition hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
              >
                Explore platform
                <ChevronRight className="h-4 w-4" />
              </a>
            </motion.div>

            {/* TRUST LINE */}

            <motion.div
              variants={fadeUp}
              className="mt-12 flex items-center gap-6 text-xs text-slate-600"
            >
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" />
                Secure data workflow
              </div>

              <div className="h-3 w-px bg-white/10" />

              <div>Built for analytical workflows</div>
            </motion.div>
          </motion.div>

          {/* =====================================================
              PRODUCT PREVIEW
          ===================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 45,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="relative"
          >
            <div className="absolute inset-[-80px] rounded-full bg-violet-600/[0.06] blur-[100px]" />

            <div className="relative rounded-3xl border border-white/[0.1] bg-[#0a0a10]/90 p-3 shadow-2xl shadow-black/50 backdrop-blur-2xl">
              {/* Browser top bar */}

              <div className="flex h-11 items-center justify-between border-b border-white/[0.07] px-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-white/10" />
                  <div className="h-2 w-2 rounded-full bg-white/10" />
                  <div className="h-2 w-2 rounded-full bg-white/10" />
                </div>

                <div className="rounded-md border border-white/[0.06] bg-white/[0.02] px-12 py-1.5 text-[9px] text-slate-600">
                  sentinel.ai / intelligence
                </div>

                <div className="w-10" />
              </div>

              {/* Dashboard */}

              <div className="p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-400">
                      Intelligence Overview
                    </p>

                    <h3 className="mt-1.5 text-lg font-semibold text-white">
                      Metropolitan Crime Analysis
                    </h3>
                  </div>

                  <div className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[9px] font-medium text-emerald-300">
                    Analysis complete
                  </div>
                </div>

                {/* Metrics */}

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <DashboardMetric
                    label="Records"
                    value="12,547"
                    change="+8.2%"
                  />

                  <DashboardMetric
                    label="Risk Score"
                    value="74"
                    change="HIGH"
                  />

                  <DashboardMetric
                    label="Geo Points"
                    value="9,821"
                    change="98.1%"
                  />
                </div>

                {/* Chart */}

                <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-600">
                        Crime activity
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-200">
                        Historical trend
                      </p>
                    </div>

                    <Activity className="h-4 w-4 text-violet-400" />
                  </div>

                  <div className="relative mt-7 h-[150px] overflow-hidden">
                    <div className="absolute inset-0 flex flex-col justify-between">
                      <div className="border-t border-white/[0.04]" />
                      <div className="border-t border-white/[0.04]" />
                      <div className="border-t border-white/[0.04]" />
                      <div className="border-t border-white/[0.04]" />
                    </div>

                    <svg
                      viewBox="0 0 700 180"
                      className="absolute inset-0 h-full w-full"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="chartLine"
                          x1="0"
                          y1="0"
                          x2="700"
                          y2="0"
                        >
                          <stop
                            offset="0"
                            stopColor="#8b5cf6"
                            stopOpacity="0.25"
                          />
                          <stop
                            offset="0.45"
                            stopColor="#a78bfa"
                            stopOpacity="0.9"
                          />
                          <stop
                            offset="1"
                            stopColor="#c4b5fd"
                            stopOpacity="0.45"
                          />
                        </linearGradient>

                        <linearGradient
                          id="chartFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="180"
                        >
                          <stop
                            offset="0"
                            stopColor="#8b5cf6"
                            stopOpacity="0.16"
                          />
                          <stop
                            offset="1"
                            stopColor="#8b5cf6"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      <path
                        d="M0 135 C55 128 75 120 120 125 C165 130 190 102 230 108 C270 114 300 75 345 86 C390 97 405 70 445 76 C490 83 510 48 550 59 C590 70 625 36 700 42 L700 180 L0 180 Z"
                        fill="url(#chartFill)"
                      />

                      <path
                        d="M0 135 C55 128 75 120 120 125 C165 130 190 102 230 108 C270 114 300 75 345 86 C390 97 405 70 445 76 C490 83 510 48 550 59 C590 70 625 36 700 42"
                        stroke="url(#chartLine)"
                        strokeWidth="2"
                      />

                      <circle
                        cx="550"
                        cy="59"
                        r="4"
                        fill="#c4b5fd"
                      />

                      <circle
                        cx="550"
                        cy="59"
                        r="9"
                        fill="#8b5cf6"
                        fillOpacity="0.12"
                      />
                    </svg>
                  </div>

                  <div className="mt-2 flex justify-between text-[8px] text-slate-700">
                    <span>JAN</span>
                    <span>MAR</span>
                    <span>MAY</span>
                    <span>JUL</span>
                    <span>SEP</span>
                    <span>NOV</span>
                  </div>
                </div>

                {/* Bottom cards */}

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-violet-400/[0.12] bg-violet-500/[0.04] p-4">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4 text-violet-400" />

                      <span className="text-[9px] font-semibold uppercase tracking-wider text-violet-300">
                        AI Insight
                      </span>
                    </div>

                    <p className="mt-3 text-[11px] leading-5 text-slate-400">
                      Burglary activity shows a rising pattern
                      across the latest observation period.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.018] p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />

                      <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                        Hotspots
                      </span>
                    </div>

                    <p className="mt-3 text-[11px] leading-5 text-slate-400">
                      42 geographic clusters identified from
                      the dataset.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          CAPABILITIES
      ========================================================= */}

      <section
        id="capabilities"
        className="relative border-t border-white/[0.06] px-6 py-32 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
            {/* INTRO */}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">
                Platform capabilities
              </p>

              <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                Every layer of intelligence.
              </h2>

              <p className="mt-6 max-w-md text-[16px] leading-8 text-slate-500">
                From the moment a dataset enters Sentinel AI,
                every stage of the analytical workflow is
                connected.
              </p>

              <Link
                href="/register"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-violet-300 transition hover:text-violet-200"
              >
                Explore Sentinel AI
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* FEATURES */}

            <div className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">
              {features.map((feature) => (
                <motion.div
                  key={feature.number}
                  whileHover={{
                    backgroundColor:
                      "rgba(139,92,246,0.035)",
                  }}
                  className="group relative bg-[#08080d] p-7 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] transition group-hover:border-violet-400/20 group-hover:bg-violet-500/[0.07]">
                      <feature.icon className="h-5 w-5 text-slate-400 transition group-hover:text-violet-300" />
                    </div>

                    <span className="font-mono text-[10px] text-slate-700">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WORKFLOW
      ========================================================= */}

      <section
        id="workflow"
        className="relative overflow-hidden border-t border-white/[0.06] px-6 py-32 lg:px-12"
      >
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/[0.045] blur-[150px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">
              The intelligence workflow
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              From dataset to decision.
            </h2>

            <p className="mt-6 text-[16px] leading-8 text-slate-500">
              A connected pipeline designed to move from raw
              information to interpretable intelligence without
              breaking the analytical workflow apart.
            </p>
          </div>

          <div className="relative mt-20">
            {/* Connector */}

            <div className="absolute left-[12.5%] right-[12.5%] top-9 hidden h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent lg:block" />

            <div className="grid gap-8 lg:grid-cols-5">
              <WorkflowItem
                number="01"
                icon={FileSearch}
                title="Upload"
                description="Import your crime dataset."
              />

              <WorkflowItem
                number="02"
                icon={Database}
                title="Prepare"
                description="Clean and structure the data."
              />

              <WorkflowItem
                number="03"
                icon={BarChart3}
                title="Analyze"
                description="Discover patterns and relationships."
              />

              <WorkflowItem
                number="04"
                icon={TrendingUp}
                title="Forecast"
                description="Model future crime activity."
              />

              <WorkflowItem
                number="05"
                icon={BrainCircuit}
                title="Understand"
                description="Generate explainable intelligence."
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT / CTA
      ========================================================= */}

      <section
        id="about"
        className="relative border-t border-white/[0.06] px-6 py-32 lg:px-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[32px] border border-white/[0.09] bg-gradient-to-br from-[#0c0b13] via-[#09090e] to-[#100b18] px-7 py-16 text-center sm:px-12">
            <div className="absolute left-1/2 top-[-180px] h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/[0.08] blur-[120px]" />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/[0.08]">
                <BrainCircuit className="h-6 w-6 text-violet-300" />
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">
                Built for intelligence
              </p>

              <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                Make complex crime data easier to understand.
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-8 text-slate-500">
                Sentinel AI brings preprocessing, trend analysis,
                forecasting, geospatial intelligence, risk
                assessment and AI interpretation together in one
                analytical environment.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="group flex items-center gap-3 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-slate-100"
                >
                  Create your account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/login"
                  className="rounded-lg border border-white/[0.1] bg-white/[0.025] px-6 py-3.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-white/[0.06] px-6 py-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight"
            >
              Sentinel<span className="text-violet-400">AI</span>
            </Link>

            <p className="mt-2 text-xs text-slate-600">
              AI-powered crime intelligence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <a
              href="#capabilities"
              className="transition hover:text-white"
            >
              Capabilities
            </a>

            <a
              href="#workflow"
              className="transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#about"
              className="transition hover:text-white"
            >
              About
            </a>

            <Link
              href="/dashboard/new-analysis"
              className="text-violet-400 transition hover:text-violet-300"
            >
              Sentinel AI
            </Link>
          </div>

          <p className="text-xs text-slate-700">
            © {new Date().getFullYear()} Sentinel AI
          </p>
        </div>
      </footer>
    </main>
  );
}

/* =============================================================
   DASHBOARD METRIC
============================================================= */

function DashboardMetric({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.018] p-3.5">
      <p className="text-[8px] uppercase tracking-wider text-slate-700">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-white">
        {value}
      </p>

      <p className="mt-1 text-[8px] text-violet-400">
        {change}
      </p>
    </div>
  );
}

/* =============================================================
   WORKFLOW ITEM
============================================================= */

function WorkflowItem({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="relative text-center">
      <div className="relative z-10 mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-white/[0.1] bg-[#09090e] shadow-xl shadow-black/30">
        <Icon className="h-6 w-6 text-violet-300" />

        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-violet-400/20 bg-[#0c0b13] font-mono text-[8px] text-violet-300">
          {number}
        </span>
      </div>

      <h3 className="mt-5 text-sm font-semibold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-[150px] text-xs leading-5 text-slate-600">
        {description}
      </p>
    </div>
  );
}