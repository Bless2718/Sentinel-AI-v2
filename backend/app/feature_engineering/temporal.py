"""
Temporal Feature Engineering

Generates temporal features from the canonical
'incident_date' column.
"""

import pandas as pd


class TemporalFeatureEngineer:
    """
    Generates temporal features for forecasting.
    """

    DATE_COLUMN = "incident_date"

    def transform(
        self,
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        data = df.copy()

        data[self.DATE_COLUMN] = pd.to_datetime(
            data[self.DATE_COLUMN],
            errors="coerce",
        )

        data["year"] = data[self.DATE_COLUMN].dt.year

        data["quarter"] = data[self.DATE_COLUMN].dt.quarter

        data["month"] = data[self.DATE_COLUMN].dt.month

        data["week"] = (
            data[self.DATE_COLUMN]
            .dt.isocalendar()
            .week
            .astype(int)
        )

        data["day"] = data[self.DATE_COLUMN].dt.day

        data["weekday"] = data[self.DATE_COLUMN].dt.weekday

        data["hour"] = data[self.DATE_COLUMN].dt.hour

        return data