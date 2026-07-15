"""
Crime Seasonality Detection
"""

import pandas as pd


class SeasonalityDetector:
    """
    Detects recurring seasonal crime patterns.
    """

    def detect(
        self,
        df: pd.DataFrame,
        period: str = "month",
        value_column: str = "crime_count",
    ) -> pd.DataFrame:

        required = [period, value_column]

        missing = [
            c
            for c in required
            if c not in df.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

        result = (
            df.groupby(period)[value_column]
            .mean()
            .reset_index()
        )

        result.rename(
            columns={
                value_column: "average_crime"
            },
            inplace=True,
        )

        return result