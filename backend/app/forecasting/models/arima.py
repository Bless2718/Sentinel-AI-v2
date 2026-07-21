"""
ARIMA Forecast Model
"""

import pandas as pd
from statsmodels.tsa.arima.model import ARIMA

from app.forecasting.forecast_result import ForecastResult
from app.forecasting.model import ForecastModel


class ARIMAForecastModel(ForecastModel):

    def __init__(self):

        self.order = (2, 1, 2)

        self.model = None

        self.training_series = None

    def train(
        self,
        df: pd.DataFrame,
    ) -> None:

        self.training_series = df["target"].copy()

        self.model = ARIMA(
            self.training_series,
            order=self.order,
        ).fit()

    def predict_validation(
        self,
        test_df: pd.DataFrame,
    ) -> pd.Series:
        """
        Forecast the validation period immediately after
        the training series.
        """

        predictions = self.model.forecast(
            steps=len(test_df)
        )

        return pd.Series(
            predictions,
            index=test_df.index,
            name="prediction",
        )

    def predict(
        self,
        periods: int,
    ) -> ForecastResult:
        """
        Forecast future periods.
        """

        predictions = self.model.forecast(
            steps=periods
        )

        return ForecastResult(
            predictions=pd.DataFrame(
                {
                    "prediction": predictions
                }
            ),
            model_name="ARIMA",
        )