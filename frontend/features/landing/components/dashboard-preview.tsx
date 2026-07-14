import {
  AlertTriangle,
  BarChart3,
  MapPinned,
} from "lucide-react";

import StatCard from "@/features/dashboard/components/stat-card";

export default function DashboardPreview() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <StatCard
        title="Total Crimes"
        value="12,547"
        subtitle="+8.2% this month"
        icon={<AlertTriangle size={22} />}
      />

      <StatCard
        title="Prediction Accuracy"
        value="96.4%"
        subtitle="Best model selected"
        icon={<BarChart3 size={22} />}
      />

      <div className="md:col-span-2">
        <StatCard
          title="Crime Hotspots"
          value="42"
          subtitle="Clusters detected"
          icon={<MapPinned size={22} />}
        />
      </div>
    </div>
  );
}