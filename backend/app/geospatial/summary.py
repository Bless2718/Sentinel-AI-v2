"""
Geospatial Summary Generator
"""

from __future__ import annotations

import pandas as pd


class GeospatialSummary:
    """
    Generates summary statistics from geospatial analysis.
    """

    def generate(
        self,
        hotspots: pd.DataFrame,
        clusters: pd.DataFrame,
        density: pd.DataFrame,
        risk: pd.DataFrame,
        heatmap: pd.DataFrame,
    ) -> dict:

        cluster_count = 0

        if (
            "cluster" in clusters.columns
            and not clusters.empty
        ):
            cluster_count = (
                clusters["cluster"]
                .loc[clusters["cluster"] != -1]
                .nunique()
            )

        highest_risk = (
            float(risk["risk_score"].max())
            if (
                not risk.empty
                and "risk_score" in risk.columns
            )
            else 0.0
        )

        average_density = (
            float(density["density"].mean())
            if (
                not density.empty
                and "density" in density.columns
            )
            else 0.0
        )

        max_density = (
            float(density["density"].max())
            if (
                not density.empty
                and "density" in density.columns
            )
            else 0.0
        )

        return {
            "hotspot_count": len(hotspots),
            "cluster_count": cluster_count,
            "highest_risk_score": highest_risk,
            "average_density": average_density,
            "maximum_density": max_density,
            "heatmap_points": len(heatmap),
        }