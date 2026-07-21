"""
Geospatial Statistics Generator
"""

from __future__ import annotations

import pandas as pd


class GeospatialStatistics:
    """
    Generates detailed statistics from geospatial analysis.
    """

    def generate(
        self,
        clusters: pd.DataFrame,
        risk: pd.DataFrame,
    ) -> dict:

        cluster_sizes = {}

        if (
            not clusters.empty
            and "cluster" in clusters.columns
        ):

            valid_clusters = clusters[
                clusters["cluster"] != -1
            ]

            cluster_sizes = (
                valid_clusters["cluster"]
                .value_counts()
                .sort_index()
                .to_dict()
            )

        total_incidents = len(clusters)

        clustered_incidents = (
            len(clusters[clusters["cluster"] != -1])
            if "cluster" in clusters.columns
            else 0
        )

        noise_incidents = (
            len(clusters[clusters["cluster"] == -1])
            if "cluster" in clusters.columns
            else 0
        )

        largest_cluster = (
            max(cluster_sizes.values())
            if cluster_sizes
            else 0
        )

        average_cluster_size = (
            sum(cluster_sizes.values()) / len(cluster_sizes)
            if cluster_sizes
            else 0.0
        )

        risk_scores = (
            risk["risk_score"]
            if (
                not risk.empty
                and "risk_score" in risk.columns
            )
            else pd.Series(dtype=float)
        )

        return {

            "total_incidents": total_incidents,

            "clustered_incidents": clustered_incidents,

            "noise_incidents": noise_incidents,

            "cluster_count": len(cluster_sizes),

            "largest_cluster": largest_cluster,

            "average_cluster_size": round(
                average_cluster_size,
                2,
            ),

            "cluster_distribution": cluster_sizes,

            "average_risk": round(
                float(risk_scores.mean())
                if not risk_scores.empty
                else 0.0,
                4,
            ),

            "median_risk": round(
                float(risk_scores.median())
                if not risk_scores.empty
                else 0.0,
                4,
            ),

            "maximum_risk": round(
                float(risk_scores.max())
                if not risk_scores.empty
                else 0.0,
                4,
            ),

            "minimum_risk": round(
                float(risk_scores.min())
                if not risk_scores.empty
                else 0.0,
                4,
            ),
        }