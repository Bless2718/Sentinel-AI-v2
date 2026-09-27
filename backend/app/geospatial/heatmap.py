"""
Heatmap Generator
"""

from __future__ import annotations

import pandas as pd

from app.geospatial.models import (
    GeoPoint,
    HeatmapPoint,
)


class HeatmapGenerator:
    """
    Generates lightweight heatmap points.

    Crimes occurring at the same coordinates
    are aggregated into a single HeatmapPoint.
    """

    REQUIRED_COLUMNS = [
        "latitude",
        "longitude",
    ]

    def generate(
        self,
        df: pd.DataFrame,
    ) -> list[HeatmapPoint]:

        missing = [
            c
            for c in self.REQUIRED_COLUMNS
            if c not in df.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

        data = df.copy()

        if "risk_score" not in data.columns:
            data["risk_score"] = 1.0

        data = data.dropna(
            subset=[
                "latitude",
                "longitude",
            ]
        )

        grouped = (
            data.groupby(
                [
                    "latitude",
                    "longitude",
                ],
                as_index=False,
            )
            .agg(
                weight=("risk_score", "sum"),
                crime_count=("risk_score", "size"),
                average_risk=("risk_score", "mean"),
            )
            .sort_values(
                "weight",
                ascending=False,
            )
        )

        heatmap: list[HeatmapPoint] = []

        for row in grouped.itertuples(index=False):

            heatmap.append(

                HeatmapPoint(

                    location=GeoPoint(

                        latitude=float(
                            row.latitude
                        ),

                        longitude=float(
                            row.longitude
                        ),

                    ),

                    weight=float(
                        row.weight
                    ),

                    crime_count=int(
                        row.crime_count
                    ),

                    average_risk=float(
                        row.average_risk
                    ),

                )

            )

        return heatmap