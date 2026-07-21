"""
Base Forecast Model Interface
"""

from abc import ABC, abstractmethod

import pandas as pd

from app.forecasting.forecast_result import ForecastResult


class ForecastModel(ABC):
    """
    Base interface for all forecasting models.
    """

    @abstractmethod
    def train(
        self,
        df: pd.DataFrame,
    ) -> None:
        """
        Train the forecasting model.
        """
        pass

    @abstractmethod
    def predict_validation(
        self,
        df: pd.DataFrame,
    ) -> pd.Series:
        """
        Predict an existing validation dataset.
        Used for evaluation only.
        """
        pass

    @abstractmethod
    def predict(
        self,
        periods: int,
    ) -> ForecastResult:
        """
        Forecast future periods.
        """
        pass