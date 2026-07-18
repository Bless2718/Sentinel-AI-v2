"""
Forecast Predictor

Generates forecasts using the selected model.
"""

from app.forecasting.forecast_result import ForecastResult
from app.forecasting.model import ForecastModel


class ForecastPredictor:
    """
    Executes forecasting.
    """

    def predict(
        self,
        model: ForecastModel,
        periods: int,
    ) -> ForecastResult:

        return model.predict(periods)