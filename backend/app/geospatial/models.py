"""
Geospatial Intelligence Models
"""

from __future__ import annotations

from dataclasses import dataclass, field


# ---------------------------------------------------------------------
# Shared Geographic Point
# ---------------------------------------------------------------------

@dataclass(slots=True)
class GeoPoint:
    """
    Represents a geographic location.
    """

    latitude: float
    longitude: float


# ---------------------------------------------------------------------
# Hotspot
# ---------------------------------------------------------------------

@dataclass(slots=True)
class Hotspot:
    """
    Represents a crime hotspot.
    """

    location: GeoPoint
    crime_count: int


# ---------------------------------------------------------------------
# Cluster
# ---------------------------------------------------------------------

@dataclass(slots=True)
class Cluster:
    """
    Represents a spatial crime cluster.
    """

    cluster_id: int
    crime_count: int
    density: float
    risk_score: float


# ---------------------------------------------------------------------
# Heatmap Point
# ---------------------------------------------------------------------

@dataclass(slots=True)
class HeatmapPoint:
    """
    Represents a single heatmap point.
    """

    location: GeoPoint
    weight: float
    crime_count: int
    average_risk: float


# ---------------------------------------------------------------------
# GeoJSON Feature
# ---------------------------------------------------------------------

@dataclass(slots=True)
class GeoJSONFeature:
    """
    Lightweight GeoJSON feature.
    """

    geometry: dict
    properties: dict


# ---------------------------------------------------------------------
# Dashboard Summary
# ---------------------------------------------------------------------

@dataclass(slots=True)
class GeospatialSummaryModel:
    """
    Dashboard summary statistics.
    """

    hotspot_count: int = 0
    cluster_count: int = 0
    highest_risk_score: float = 0.0
    average_density: float = 0.0
    maximum_density: float = 0.0
    heatmap_points: int = 0


# ---------------------------------------------------------------------
# Dashboard Statistics
# ---------------------------------------------------------------------

@dataclass(slots=True)
class GeospatialStatisticsModel:
    """
    Detailed geospatial statistics for the dashboard.
    """

    total_clusters: int = 0

    active_clusters: int = 0

    isolated_points: int = 0

    total_crimes: int = 0

    average_cluster_size: float = 0.0

    largest_cluster_size: int = 0

    average_risk_score: float = 0.0

    highest_risk_score: float = 0.0
# ---------------------------------------------------------------------
# Final Intelligence Object
# ---------------------------------------------------------------------

@dataclass(slots=True)
class GeospatialIntelligence:
    """
    Complete Geospatial Intelligence object.

    This is the object exchanged between the
    GeospatialService, ResponseBuilder and
    Serializer.
    """

    summary: GeospatialSummaryModel

    statistics: GeospatialStatisticsModel

    hotspots: list[Hotspot] = field(default_factory=list)

    clusters: list[Cluster] = field(default_factory=list)

    heatmap: list[HeatmapPoint] = field(default_factory=list)

    geojson: dict = field(default_factory=dict)