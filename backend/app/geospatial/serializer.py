"""
Geospatial Result Serializer
"""

from __future__ import annotations

import pandas as pd


class GeospatialSerializer:
    """
    Converts geospatial analysis results into
    API-friendly Python objects.
    """

    @staticmethod
    def dataframe_to_records(
        df: pd.DataFrame,
    ) -> list[dict]:

        if df is None or df.empty:
            return []

        return df.to_dict(orient="records")

    def serialize(
        self,
        summary: dict,
        statistics: dict,
        hotspots: pd.DataFrame,
        clusters: pd.DataFrame,
        density: pd.DataFrame,
        risk: pd.DataFrame,
        heatmap: pd.DataFrame,
    ) -> dict:

        return {

            "summary": summary,

            "statistics": statistics,

            "hotspots": self.dataframe_to_records(
                hotspots
            ),

            "clusters": self.dataframe_to_records(
                clusters
            ),

            "density": self.dataframe_to_records(
                density
            ),

            "risk": self.dataframe_to_records(
                risk
            ),

            "heatmap": self.dataframe_to_records(
                heatmap
            ),
        }