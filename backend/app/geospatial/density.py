"""
Crime Density Analysis
"""

import pandas as pd


class CrimeDensityAnalyzer:
    """
    Calculates crime density for each spatial cluster.
    """

    def analyze(
        self,
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        if "cluster" not in df.columns:
            raise ValueError(
                "Missing 'cluster' column."
            )

        density = (
            df.groupby("cluster")
            .size()
            .reset_index(name="crime_count")
        )

        density["density"] = (
            density["crime_count"]
            / density["crime_count"].sum()
        )

        return density