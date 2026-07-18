"""
Forecast Trainer

Responsible for preparing data and training forecasting models.
"""

import pandas as pd

from app.forecasting.builders.feature_builder import ForecastFeatureBuilder
from app.forecasting.model import ForecastModel


class ForecastTrainer:
    """
    Trains forecasting models using engineered features.
    """

    def __init__(self):

        self.feature_builder = ForecastFeatureBuilder()

    def train(
        self,
        model: ForecastModel,
        df: pd.DataFrame,
    ) -> ForecastModel:

        data = df.copy()

        # Only engineer features for ML models
        if model.__class__.__name__ != "ARIMAForecastModel":
            data = self.feature_builder.build(data)

        model.train(data)

        return model