"""
Geospatial Response Builder
"""

from __future__ import annotations

from app.geospatial.models import (
    Cluster,
    GeospatialIntelligence,
    GeospatialStatisticsModel,
    GeospatialSummaryModel,
    HeatmapPoint,
    Hotspot,
)


class GeospatialResponseBuilder:
    """
    Builds the final Geospatial Intelligence object
    returned by the API.

    Only lightweight dashboard data is included.
    """

    def __init__(
        self,
        hotspot_limit: int = 50,
        cluster_limit: int = 50,
    ):
        self.hotspot_limit = hotspot_limit
        self.cluster_limit = cluster_limit

    def build(
        self,
        summary: GeospatialSummaryModel,
        statistics: GeospatialStatisticsModel,
        hotspots: list[Hotspot],
        clusters: list[Cluster],
        heatmap: list[HeatmapPoint],
        geojson: dict,
    ) -> GeospatialIntelligence:

        hotspots = sorted(
            hotspots,
            key=lambda h: h.crime_count,
            reverse=True,
        )[: self.hotspot_limit]

        clusters = sorted(
            clusters,
            key=lambda c: c.risk_score,
            reverse=True,
        )[: self.cluster_limit]

        return GeospatialIntelligence(

        summary=summary,

       statistics=statistics,

        hotspots=hotspots,

    clusters=clusters,

    heatmap=[],

    geojson={
        "type": "FeatureCollection",
        "features": [],
    },

)