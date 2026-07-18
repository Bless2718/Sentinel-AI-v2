"""
Forecast Time Aggregator
"""

import pandas as pd


class TimeAggregator:
    """
    Aggregates crime incidents into a time series.
    """

    def aggregate(
        self,
        df: pd.DataFrame,
        frequency: str = "ME",
    ) -> pd.DataFrame:

        if "incident_date" not in df.columns:
            raise ValueError(
                "incident_date column is required."
            )

        data = df.copy()

        data["incident_date"] = pd.to_datetime(
            data["incident_date"]
        )

        aggregated = (
            data
            .groupby(
                pd.Grouper(
                    key="incident_date",
                    freq=frequency,
                )
            )
            .size()
            .reset_index(name="crime_count")
        )

        return aggregated