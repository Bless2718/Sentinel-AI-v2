"""
Forecast Feature Builder

Builds machine-learning features
from the forecast dataset.
"""

import pandas as pd

from app.forecasting.features.lag_features import LagFeatureBuilder


class ForecastFeatureBuilder:
    """
    Creates ML features.
    """

    def __init__(self):

        self.lag_builder = LagFeatureBuilder()

    def build(
        self,
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        data = self.lag_builder.build(df)

        data["month"] = (
            data["incident_date"]
            .dt.month
        )

        data["year"] = (
            data["incident_date"]
            .dt.year
        )

        data["rolling_mean_3"] = (
            data["crime_count"]
            .rolling(3)
            .mean()
        )

        data = data.dropna()

        return data.reset_index(drop=True)