import {
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  MapPinned,
} from "lucide-react";

import GlassCard from "@/components/ui/glass-card";
import StatCard from "@/features/dashboard/components/stat-card";

export default function DashboardPreview() {
  return (
    <div className="space-y-5">

      <div className="grid gap-5 md:grid-cols-2">
        <StatCard
          title="Total Crimes"
          value="12,547"
          subtitle="+8.2% this month"
          icon={<AlertTriangle size={20} />}
        />

        <StatCard
          title="Prediction Accuracy"
          value="96.4%"
          subtitle="Best performing model"
          icon={<BarChart3 size={20} />}
        />
      </div>

      <GlassCard className="p-6">
        <div className="mb-5 flex items-center gap-2 text-cyan-400">
          <BrainCircuit size={20} />
          <span className="font-semibold">
            AI Insight
          </span>
        </div>

        <p className="leading-7 text-slate-300">
          Burglary incidents are projected to increase by
          <span className="font-semibold text-cyan-400">
            {" "}14%
          </span>{" "}
          over the next 30 days in the downtown district.
        </p>
      </GlassCard>

      <GlassCard className="flex items-center justify-between p-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Crime Hotspots
          </h3>

          <p className="mt-2 text-slate-400">
            42 clusters detected
          </p>
        </div>

        <MapPinned
          className="text-cyan-400"
          size={36}
        />
      </GlassCard>

    </div>
  );
}