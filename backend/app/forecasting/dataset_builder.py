"""
Forecast Dataset Builder
"""

import pandas as pd

from app.forecasting.aggregator import TimeAggregator


class ForecastDatasetBuilder:
    """
    Converts a crime dataset into a forecast-ready
    time series.
    """

    def __init__(self):

        self.aggregator = TimeAggregator()

    def build(
        self,
        df: pd.DataFrame,
        frequency: str = "ME",
    ) -> pd.DataFrame:

        if "incident_date" not in df.columns:
            raise ValueError(
                "incident_date column not found."
            )

        data = df.copy()

        data["incident_date"] = pd.to_datetime(
            data["incident_date"],
            errors="coerce",
        )

        data = data.dropna(
            subset=["incident_date"]
        )

        data = data.sort_values(
            "incident_date"
        )

        return self.aggregator.aggregate(
            data,
            frequency,
        )