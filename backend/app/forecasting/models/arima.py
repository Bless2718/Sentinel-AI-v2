"""
ARIMA Forecast Model
"""

import pandas as pd
from statsmodels.tsa.arima.model import ARIMA

from app.forecasting.forecast_result import ForecastResult
from app.forecasting.model import ForecastModel


class ARIMAForecastModel(ForecastModel):

    def __init__(self, order=(1, 1, 1)):
        self.order = order
        self.model = None

    def train(
        self,
        df: pd.DataFrame,
    ) -> None:

        if "crime_count" not in df.columns:
            raise ValueError(
                "crime_count column not found."
            )

        series = df["crime_count"]

        self.model = ARIMA(
            series,
            order=self.order,
        ).fit()

    def predict(
        self,
        periods: int,
    ) -> ForecastResult:

        forecast = self.model.forecast(
            steps=periods
        )

        predictions = pd.DataFrame(
            {
                "prediction": forecast
            }
        )

        return ForecastResult(
            predictions=predictions,
            model_name="ARIMA",
        )