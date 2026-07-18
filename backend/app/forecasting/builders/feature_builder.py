"""
Forecast Feature Builder
"""

import pandas as pd

from app.forecasting.builders.lag_builder import LagBuilder
from app.forecasting.builders.target_builder import TargetBuilder


class ForecastFeatureBuilder:
    """
    Builds all forecasting features.
    """

    def __init__(self):

        self.lag_builder = LagBuilder()
        self.target_builder = TargetBuilder()

    def build(
        self,
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        data = df.copy()

        # Lag Features
        data = self.lag_builder.build(data)

        # Rolling Statistics
        data["rolling_mean_3"] = (
            data["crime_count"]
            .rolling(3)
            .mean()
        )

        data["rolling_std_3"] = (
            data["crime_count"]
            .rolling(3)
            .std()
        )

        # Calendar Features
        if "incident_date" in data.columns:

            data["year"] = data["incident_date"].dt.year
            data["month"] = data["incident_date"].dt.month
            data["quarter"] = data["incident_date"].dt.quarter

        # Target
        data = self.target_builder.build(data)

        # Remove rows with NaN values created by lagging
        data = data.dropna().reset_index(drop=True)

        return data