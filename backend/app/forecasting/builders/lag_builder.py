"""
Lag Feature Builder
"""

import pandas as pd


class LagBuilder:
    """
    Creates lag features for time series forecasting.
    """

    def build(
        self,
        df: pd.DataFrame,
        target: str = "crime_count",
    ) -> pd.DataFrame:

        data = df.copy()

        data["lag_1"] = data[target].shift(1)
        data["lag_2"] = data[target].shift(2)
        data["lag_3"] = data[target].shift(3)

        return data