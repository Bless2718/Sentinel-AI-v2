"use client";

import { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

interface Coordinate {
  latitude: number;
  longitude: number;
}

function MapBounds({
  points,
}: {
  points: Coordinate[];
}) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) {
      return;
    }

    if (points.length === 1) {
      map.setView(
        [points[0].latitude, points[0].longitude],
        12,
      );
      return;
    }

    const bounds = L.latLngBounds(
      points.map((point) => [
        point.latitude,
        point.longitude,
      ] as [number, number]),
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 13,
    });
  }, [map, points]);

  return null;
}

function getIntensityColor(
  crimeCount: number,
  maximum: number,
) {
  if (maximum <= 0) {
    return "#8b5cf6";
  }

  const ratio = crimeCount / maximum;

  if (ratio >= 0.8) {
    return "#ef4444";
  }

  if (ratio >= 0.6) {
    return "#f97316";
  }

  if (ratio >= 0.4) {
    return "#eab308";
  }

  if (ratio >= 0.2) {
    return "#a78bfa";
  }

  return "#8b5cf6";
}

function getRadius(
  crimeCount: number,
  maximum: number,
) {
  if (maximum <= 0) {
    return 8;
  }

  return 7 + (crimeCount / maximum) * 23;
}

export default function LeafletHotspotMap({
  hotspots,
}: HotspotMapProps) {
  const validHotspots = useMemo(() => {
    return hotspots.filter((hotspot) => {
      const latitude = hotspot.location?.latitude;
      const longitude = hotspot.location?.longitude;

      return (
        typeof latitude === "number" &&
        typeof longitude === "number" &&
        Number.isFinite(latitude) &&
        Number.isFinite(longitude)
      );
    });
  }, [hotspots]);

  const maximumCrimeCount = useMemo(() => {
    if (validHotspots.length === 0) {
      return 0;
    }

    return Math.max(
      ...validHotspots.map(
        (hotspot) => hotspot.crime_count ?? 0,
      ),
    );
  }, [validHotspots]);

  const mapCenter = useMemo<[number, number]>(() => {
    if (validHotspots.length === 0) {
      return [0, 0];
    }

    const latitude =
      validHotspots.reduce(
        (sum, hotspot) =>
          sum + (hotspot.location?.latitude ?? 0),
        0,
      ) / validHotspots.length;

    const longitude =
      validHotspots.reduce(
        (sum, hotspot) =>
          sum + (hotspot.location?.longitude ?? 0),
        0,
      ) / validHotspots.length;

    return [latitude, longitude];
  }, [validHotspots]);

  const points = useMemo<Coordinate[]>(() => {
    return validHotspots.map((hotspot) => ({
      latitude: hotspot.location!.latitude!,
      longitude: hotspot.location!.longitude!,
    }));
  }, [validHotspots]);

  if (validHotspots.length === 0) {
    return (
      <div className="flex h-[620px] items-center justify-center rounded-2xl border border-white/10 bg-[#08080d]">
        <div className="text-center">
          <p className="text-sm font-medium text-white/70">
            No valid geographical coordinates available.
          </p>

          <p className="mt-2 text-xs text-white/40">
            The dataset does not contain usable latitude and
            longitude values for hotspot visualization.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#08080d]">
      <MapContainer
        center={mapCenter}
        zoom={11}
        scrollWheelZoom={true}
        className="h-[620px] w-full"
        style={{
          background: "#08080d",
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds points={points} />

        {validHotspots.map((hotspot, index) => {
          const latitude = hotspot.location!.latitude!;
          const longitude = hotspot.location!.longitude!;
          const crimeCount = hotspot.crime_count ?? 0;

          const color = getIntensityColor(
            crimeCount,
            maximumCrimeCount,
          );

          const radius = getRadius(
            crimeCount,
            maximumCrimeCount,
          );

          return (
            <CircleMarker
              key={`${latitude}-${longitude}-${index}`}
              center={[latitude, longitude]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.38,
                weight: 2,
              }}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <p className="text-sm font-semibold">
                    Crime Hotspot
                  </p>

                  <div className="mt-2 space-y-1 text-xs">
                    <p>
                      <strong>Incidents:</strong>{" "}
                      {crimeCount.toLocaleString()}
                    </p>

                    <p>
                      <strong>Latitude:</strong>{" "}
                      {latitude.toFixed(6)}
                    </p>

                    <p>
                      <strong>Longitude:</strong>{" "}
                      {longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className="pointer-events-none absolute left-5 top-5 z-[1000] rounded-xl border border-white/10 bg-black/75 px-4 py-3 backdrop-blur-md">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
          Geospatial Intelligence
        </p>

        <p className="mt-1 text-sm font-medium text-white">
          Crime Intensity Map
        </p>

        <p className="mt-1 text-xs text-white/50">
          {validHotspots.length.toLocaleString()} mapped
          hotspots
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-5 left-5 z-[1000] rounded-xl border border-white/10 bg-black/75 px-4 py-3 backdrop-blur-md">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
          Intensity
        </p>

        <div className="space-y-1.5 text-[11px] text-white/70">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Very high
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            High
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            Moderate
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
            Lower
          </div>
        </div>
      </div>
    </div>
  );
}