"""
Forecast Evaluator

Calculates forecasting performance metrics.
"""

import pandas as pd

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)


class ForecastEvaluator:
    """
    Evaluates forecasting performance.
    """

    def evaluate(
        self,
        actual: pd.Series,
        predicted: pd.Series,
    ) -> dict[str, float]:

        mae = mean_absolute_error(
            actual,
            predicted,
        )

        rmse = mean_squared_error(
            actual,
            predicted,
        ) ** 0.5

        r2 = r2_score(
            actual,
            predicted,
        )

        return {
            "mae": round(mae, 4),
            "rmse": round(rmse, 4),
            "r2_score": round(r2, 4),
        }