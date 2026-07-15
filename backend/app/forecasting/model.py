from abc import ABC, abstractmethod

import pandas as pd

from app.forecasting.forecast_result import ForecastResult


class ForecastModel(ABC):
    """
    Base interface for all forecasting models.
    """

    @abstractmethod
    def train(self, df: pd.DataFrame) -> None:
        """Train the forecasting model."""

    @abstractmethod
    def predict(self, periods: int) -> ForecastResult:
        """Generate future predictions."""