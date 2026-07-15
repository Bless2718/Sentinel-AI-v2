"""
Heatmap Data Generator
"""

import pandas as pd


class HeatmapGenerator:
    """
    Generates heatmap-ready data.
    """

    REQUIRED_COLUMNS = [
        "latitude",
        "longitude",
    ]

    def generate(
        self,
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        missing = [
            c
            for c in self.REQUIRED_COLUMNS
            if c not in df.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

        result = df.copy()

        if "risk_score" not in result.columns:
            result["risk_score"] = 1.0

        return result[
            [
                "latitude",
                "longitude",
                "risk_score",
            ]
        ]