"""
Geospatial Feature Engineering

Standardizes geographic coordinates.
"""

import pandas as pd


class SpatialFeatureEngineer:
    """
    Cleans and standardizes latitude and longitude.
    """

    LATITUDE = "latitude"
    LONGITUDE = "longitude"

    def transform(
        self,
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        data = df.copy()

        data[self.LATITUDE] = pd.to_numeric(
            data[self.LATITUDE],
            errors="coerce",
        )

        data[self.LONGITUDE] = pd.to_numeric(
            data[self.LONGITUDE],
            errors="coerce",
        )

        return data