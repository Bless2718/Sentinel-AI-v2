"""
Geographic Risk Assessment
"""

import pandas as pd


class GeographicRiskAssessor:
    """
    Calculates normalized geographic risk scores.
    """

    def assess(
        self,
        density: pd.DataFrame,
    ) -> pd.DataFrame:

        required = [
            "cluster",
            "crime_count",
            "density",
        ]

        missing = [
            c
            for c in required
            if c not in density.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

        result = density.copy()

        max_density = result["density"].max()

        if max_density == 0:
            result["risk_score"] = 0.0
        else:
            result["risk_score"] = (
                result["density"] / max_density
            ).round(4)

        return result