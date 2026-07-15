"""
Forecast Model Selector
"""

import pandas as pd


class ForecastSelector:
    """
    Selects the best forecasting model based on a metric.
    """

    def select(
        self,
        comparison: pd.DataFrame,
        metric: str = "mae",
    ) -> str:

        if comparison.empty:
            raise ValueError("Comparison table is empty.")

        if metric not in comparison.columns:
            raise ValueError(f"Metric '{metric}' not found.")

        ascending = metric != "r2_score"

        best = comparison.sort_values(
            by=metric,
            ascending=ascending,
        ).iloc[0]

        return str(best["model"])