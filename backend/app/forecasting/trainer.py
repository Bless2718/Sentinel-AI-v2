"""
Forecast Trainer

Responsible for training forecasting models.
"""

import pandas as pd

from app.forecasting.model import ForecastModel


class ForecastTrainer:
    """
    Trains forecasting models.
    """

    def train(
        self,
        model: ForecastModel,
        df: pd.DataFrame,
    ) -> ForecastModel:

        model.train(df)

        return model