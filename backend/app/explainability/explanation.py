"""
Prediction Explanation
"""

import pandas as pd


class PredictionExplainer:
    """
    Creates structured explanations
    from feature importance.
    """

    def explain(
        self,
        importance: pd.DataFrame,
        top_n: int = 3,
    ) -> dict:

        required = [
            "feature",
            "importance",
        ]

        missing = [
            c
            for c in required
            if c not in importance.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

        top = (
            importance
            .head(top_n)["feature"]
            .tolist()
        )

        return {
            "top_features": top,
            "feature_count": len(top),
        }