"""
Geographic Risk Assessment
"""

from __future__ import annotations

from app.geospatial.models import Cluster


class GeographicRiskAssessor:
    """
    Computes normalized risk scores for each cluster.

    Updates Cluster objects in-place instead of
    creating another DataFrame.
    """

    def assess(
        self,
        clusters: list[Cluster],
    ) -> list[Cluster]:

        if not clusters:
            return []

        max_density = max(
            cluster.density
            for cluster in clusters
        )

        if max_density == 0:

            for cluster in clusters:
                cluster.risk_score = 0.0

            return clusters

        for cluster in clusters:

            cluster.risk_score = round(
                cluster.density / max_density,
                4,
            )

        clusters.sort(
            key=lambda c: c.risk_score,
            reverse=True,
        )

        return clusters