"""
Forecast Model Comparison
"""

import pandas as pd

from app.forecasting.evaluator import ForecastEvaluator
from app.forecasting.model import ForecastModel


class ForecastComparison:
    """
    Compares forecasting models using common metrics.
    """

    def __init__(self):
        self.evaluator = ForecastEvaluator()

    def compare(
        self,
        models: dict[str, ForecastModel],
        actual: pd.Series,
        predictions: dict[str, pd.Series],
    ) -> pd.DataFrame:

        rows = []

        for name, prediction in predictions.items():

            metrics = self.evaluator.evaluate(
                actual,
                prediction,
            )

            rows.append(
                {
                    "model": name,
                    **metrics,
                }
            )

        return pd.DataFrame(rows)