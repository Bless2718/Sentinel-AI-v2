"""
Forecast Evaluator
"""

import numpy as np

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

from app.forecasting.evaluation.metrics import ForecastMetrics


class ForecastEvaluator:
    """
    Evaluates forecasting models.
    """

    def evaluate(
        self,
        actual,
        predicted,
    ) -> ForecastMetrics:

        actual = np.asarray(actual)
        predicted = np.asarray(predicted)

        mae = mean_absolute_error(actual, predicted)

        rmse = np.sqrt(
            mean_squared_error(actual, predicted)
        )

        r2 = r2_score(actual, predicted)

        return ForecastMetrics(
            mae=float(mae),
            rmse=float(rmse),
            r2=float(r2),
        )