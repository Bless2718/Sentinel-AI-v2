"""
Categorical Feature Engineering

Standardizes categorical values.
"""

import pandas as pd


class CategoricalFeatureEngineer:
    """
    Cleans categorical columns.
    """

    COLUMNS = [
        "crime_type",
        "district",
        "neighborhood",
    ]

    def transform(
        self,
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        data = df.copy()

        for column in self.COLUMNS:

            if column not in data.columns:
                continue

            data[column] = (
                data[column]
                .astype("string")
                .str.strip()
                .str.lower()
            )

        return data