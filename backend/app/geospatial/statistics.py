"""
Geospatial Statistics Generator
"""

from __future__ import annotations

from app.geospatial.models import (
    Cluster,
    GeospatialStatisticsModel,
)


class GeospatialStatistics:
    """
    Generates detailed statistics from
    lightweight Cluster objects.
    """

    def generate(
        self,
        clusters: list[Cluster],
    ) -> GeospatialStatisticsModel:

        if not clusters:

            return GeospatialStatisticsModel()

        total_clusters = len(clusters)

        active_clusters = len(
            [
                cluster
                for cluster in clusters
                if cluster.cluster_id != -1
            ]
        )

        isolated_points = len(
            [
                cluster
                for cluster in clusters
                if cluster.cluster_id == -1
            ]
        )

        total_crimes = sum(
            cluster.crime_count
            for cluster in clusters
        )

        largest_cluster = max(
            cluster.crime_count
            for cluster in clusters
        )

        average_cluster_size = (
            total_crimes / total_clusters
            if total_clusters
            else 0.0
        )

        average_risk = (
            sum(
                cluster.risk_score
                for cluster in clusters
            )
            / total_clusters
        )

        highest_risk = max(
            cluster.risk_score
            for cluster in clusters
        )

        return GeospatialStatisticsModel(

            total_clusters=total_clusters,

            active_clusters=active_clusters,

            isolated_points=isolated_points,

            total_crimes=total_crimes,

            average_cluster_size=round(
                average_cluster_size,
                2,
            ),

            largest_cluster_size=largest_cluster,

            average_risk_score=round(
                average_risk,
                4,
            ),

            highest_risk_score=round(
                highest_risk,
                4,
            ),

        )