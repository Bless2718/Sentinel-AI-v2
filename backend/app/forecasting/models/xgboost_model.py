"""
XGBoost Forecast Model
"""

import pandas as pd
from xgboost import XGBRegressor

from app.forecasting.forecast_result import ForecastResult
from app.forecasting.model import ForecastModel


class XGBoostForecastModel(ForecastModel):

    def __init__(self):

        self.model = XGBRegressor(
            n_estimators=100,
            random_state=42,
            objective="reg:squarederror",
        )

        self.last_row = None

    def train(
        self,
        df: pd.DataFrame,
    ) -> None:

        x = df.iloc[:, :-1]

        y = df.iloc[:, -1]

        self.model.fit(x, y)

        self.last_row = x.iloc[[-1]]

    def predict(
        self,
        periods: int,
    ) -> ForecastResult:

        predictions = []

        current = self.last_row.copy()

        for _ in range(periods):

            value = self.model.predict(current)[0]

            predictions.append(value)

        return ForecastResult(
            predictions=pd.DataFrame(
                {
                    "prediction": predictions
                }
            ),
            model_name="XGBoost",
        )