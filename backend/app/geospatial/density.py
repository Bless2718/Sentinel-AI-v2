"""
Crime Density Analysis
"""

from __future__ import annotations

import pandas as pd

from app.geospatial.models import Cluster


class CrimeDensityAnalyzer:
    """
    Computes crime density for each spatial cluster.

    Returns lightweight Cluster objects instead
    of another DataFrame.
    """

    REQUIRED_COLUMNS = [
        "cluster",
    ]

    def analyze(
        self,
        df: pd.DataFrame,
    ) -> list[Cluster]:

        missing = [
            c
            for c in self.REQUIRED_COLUMNS
            if c not in df.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

        grouped = (
            df.groupby(
                "cluster",
                as_index=False,
            )
            .size()
            .rename(
                columns={
                    "size": "crime_count"
                }
            )
        )

        total_crimes = int(
            grouped["crime_count"].sum()
        )

        clusters: list[Cluster] = []

        for row in grouped.itertuples(index=False):

            density = (
                row.crime_count / total_crimes
                if total_crimes > 0
                else 0.0
            )

            clusters.append(

                Cluster(

                    cluster_id=int(
                        row.cluster
                    ),

                    crime_count=int(
                        row.crime_count
                    ),

                    density=float(
                        density
                    ),

                    risk_score=0.0,

                )

            )

        clusters.sort(
            key=lambda c: c.crime_count,
            reverse=True,
        )

        return clusters