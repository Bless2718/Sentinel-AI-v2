"""
Forecast Service

Coordinates the complete forecasting workflow.
"""

import pandas as pd

from app.forecasting.evaluator import ForecastEvaluator
from app.forecasting.forecast_result import ForecastResult
from app.forecasting.model import ForecastModel
from app.forecasting.predictor import ForecastPredictor
from app.forecasting.trainer import ForecastTrainer


class ForecastService:
    """
    Executes the complete forecasting pipeline.
    """

    def __init__(self):

        self.trainer = ForecastTrainer()
        self.predictor = ForecastPredictor()
        self.evaluator = ForecastEvaluator()

    def run(
        self,
        model: ForecastModel,
        training_data: pd.DataFrame,
        periods: int,
    ) -> ForecastResult:

        trained_model = self.trainer.train(
            model,
            training_data,
        )

        result = self.predictor.predict(
            trained_model,
            periods,
        )

        return result