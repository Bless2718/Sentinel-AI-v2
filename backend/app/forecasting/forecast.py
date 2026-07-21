"""
Forecast Service

Coordinates the complete forecasting workflow.
"""

import pandas as pd

from app.forecasting.forecast_result import ForecastResult
from app.forecasting.model import ForecastModel
from app.forecasting.predictor import ForecastPredictor
from app.forecasting.trainer import ForecastTrainer


class ForecastService:

    def __init__(self):

        self.trainer = ForecastTrainer()

        self.predictor = ForecastPredictor()

    def run(
        self,
        model: ForecastModel,
        training_data: pd.DataFrame,
        periods: int,
    ) -> ForecastResult:

        # ----------------------------------
        # Train + Evaluate
        # ----------------------------------
        trained_model, metrics, confidence = self.trainer.train(
            model,
            training_data,
        )

        # ----------------------------------
        # Future Forecast
        # ----------------------------------
        result = self.predictor.predict(
            trained_model,
            periods,
        )

        # ----------------------------------
        # Attach Metrics
        # ----------------------------------
        result.mae = metrics.mae
        result.rmse = metrics.rmse
        result.r2_score = metrics.r2
        result.confidence = confidence
        
        return result