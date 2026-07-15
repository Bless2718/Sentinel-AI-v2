"""
Forecast Predictor

Responsible for generating forecasts from
a trained forecasting model.
"""

from app.forecasting.forecast_result import ForecastResult
from app.forecasting.model import ForecastModel


class ForecastPredictor:
    """
    Generates future forecasts.
    """

    def predict(
        self,
        model: ForecastModel,
        periods: int,
    ) -> ForecastResult:

        return model.predict(periods)