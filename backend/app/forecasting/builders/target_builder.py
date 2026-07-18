"""
Target Builder
"""

import pandas as pd


class TargetBuilder:
    """
    Creates the prediction target.
    """

    def build(
        self,
        df: pd.DataFrame,
        target: str = "crime_count",
    ) -> pd.DataFrame:

        data = df.copy()

        data["target"] = data[target]

        return data