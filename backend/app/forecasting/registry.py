"""
Forecast Model Registry
"""

from app.forecasting.models.arima import ARIMAForecastModel
from app.forecasting.models.random_forest import RandomForestForecastModel
from app.forecasting.models.xgboost_model import XGBoostForecastModel


class ForecastModelRegistry:
    """
    Registry of available forecasting models.
    """

    def __init__(self):

        self._models = {
            "arima": ARIMAForecastModel,
            "random_forest": RandomForestForecastModel,
            "xgboost": XGBoostForecastModel,
        }

    def available_models(self) -> list[str]:

        return sorted(self._models.keys())

    def create(self, name: str):

        if name not in self._models:
            raise ValueError(
                f"Unknown model: {name}"
            )

        return self._models[name]()