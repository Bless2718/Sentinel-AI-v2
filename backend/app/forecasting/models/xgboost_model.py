"""
XGBoost Forecast Model
"""

import pandas as pd
from xgboost import XGBRegressor

from app.forecasting.forecast_result import ForecastResult
from app.forecasting.model import ForecastModel
from app.forecasting.recursive_predictor import RecursivePredictor


class XGBoostForecastModel(ForecastModel):
    """
    XGBoost model trained using engineered time-series features.
    """

    def __init__(self):

        self.model = XGBRegressor(
            n_estimators=200,
            learning_rate=0.05,
            max_depth=6,
            random_state=42,
            objective="reg:squarederror",
        )

        self.feature_columns = [
            "lag_1",
            "lag_2",
            "lag_3",
            "rolling_mean_3",
            "rolling_std_3",
            "year",
            "month",
            "quarter",
        ]

        self.last_features = None
        self.training_data = None

        self.predictor = RecursivePredictor()

    def train(
        self,
        df: pd.DataFrame,
    ) -> None:

        self.training_data = df.copy()

        x = df[self.feature_columns]
        y = df["target"]

        self.model.fit(x, y)

        self.last_features = x.iloc[[-1]].copy()

    def predict_validation(
        self,
        df: pd.DataFrame,
    ) -> pd.Series:
        """
        Predict an existing validation dataset.
        Used only for model evaluation.
        """

        x = df[self.feature_columns]

        predictions = self.model.predict(x)

        return pd.Series(
            predictions,
            index=df.index,
            name="prediction",
        )

    def predict(
        self,
        periods: int,
    ) -> ForecastResult:
        """
        Forecast future periods recursively.
        """

        predictions = self.predictor.predict(
            model=self.model,
            features=self.last_features,
            periods=periods,
        )

        return ForecastResult(
            predictions=pd.DataFrame(
                {
                    "prediction": predictions
                }
            ),
            model_name="XGBoost",
        )