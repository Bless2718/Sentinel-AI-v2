"""
Geospatial Summary Generator
"""

from __future__ import annotations

from app.geospatial.models import (
    Cluster,
    GeospatialSummaryModel,
    HeatmapPoint,
    Hotspot,
)


class GeospatialSummary:
    """
    Generates high-level dashboard summary from
    lightweight geospatial intelligence objects.
    """

    def generate(
        self,
        hotspots: list[Hotspot],
        clusters: list[Cluster],
        heatmap: list[HeatmapPoint],
    ) -> GeospatialSummaryModel:

        hotspot_count = len(hotspots)

        cluster_count = len(
            [
                c
                for c in clusters
                if c.cluster_id != -1
            ]
        )

        if clusters:

            highest_risk = max(
                cluster.risk_score
                for cluster in clusters
            )

            average_density = (
                sum(
                    cluster.density
                    for cluster in clusters
                )
                / len(clusters)
            )

            maximum_density = max(
                cluster.density
                for cluster in clusters
            )

        else:

            highest_risk = 0.0

            average_density = 0.0

            maximum_density = 0.0

        return GeospatialSummaryModel(

            hotspot_count=hotspot_count,

            cluster_count=cluster_count,

            highest_risk_score=round(
                highest_risk,
                4,
            ),

            average_density=round(
                average_density,
                6,
            ),

            maximum_density=round(
                maximum_density,
                6,
            ),

            heatmap_points=len(
                heatmap
            ),

        )