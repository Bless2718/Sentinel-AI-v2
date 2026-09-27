"use client";

import dynamic from "next/dynamic";

interface Hotspot {
  location?: {
    latitude?: number;
    longitude?: number;
  };
  crime_count?: number;
}

interface HotspotMapProps {
  hotspots: Hotspot[];
}

const LeafletHotspotMap = dynamic(
  () => import("./leaflet-hotspot-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[620px] w-full items-center justify-center rounded-2xl border border-white/10 bg-[#08080d]">
        <div className="text-sm text-white/50">
          Loading geographical intelligence...
        </div>
      </div>
    ),
  },
);

export default function HotspotMap({ hotspots }: HotspotMapProps) {
  return <LeafletHotspotMap hotspots={hotspots} />;
}