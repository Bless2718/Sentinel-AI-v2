"""
Lag Feature Builder

Creates lag features for
time-series forecasting.
"""

import pandas as pd


class LagFeatureBuilder:
    """
    Creates lag features.
    """

    def build(
        self,
        df: pd.DataFrame,
        target: str = "crime_count",
        lags: int = 3,
    ) -> pd.DataFrame:

        data = df.copy()

        for lag in range(1, lags + 1):
            data[f"lag_{lag}"] = data[target].shift(lag)

        return data.dropna().reset_index(drop=True)