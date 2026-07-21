"""
Forecast Trainer

Responsible for training and evaluating forecasting models.
"""

import pandas as pd
from sklearn.model_selection import train_test_split

from app.forecasting.builders.feature_builder import ForecastFeatureBuilder
from app.forecasting.evaluation.confidence import ConfidenceCalculator
from app.forecasting.evaluation.evaluator import ForecastEvaluator
from app.forecasting.model import ForecastModel



class ForecastTrainer:

    def __init__(self):

        self.feature_builder = ForecastFeatureBuilder()

        self.evaluator = ForecastEvaluator()

        self.confidence_calculator = ConfidenceCalculator()

    def train(
        self,
        model: ForecastModel,
        df: pd.DataFrame,
    ):

        data = df.copy()

        # ----------------------------------
        # Feature Engineering (ML Models)
        # ----------------------------------

        data = self.feature_builder.build(data)

        # ----------------------------------
        # Chronological Train/Test Split
        # ----------------------------------
        train_df, test_df = train_test_split(
            data,
            test_size=0.2,
            shuffle=False,
        )

        # ----------------------------------
        # Train
        # ----------------------------------
        model.train(train_df)

        # ----------------------------------
        # Validation Prediction
        # ----------------------------------
        predictions = model.predict_validation(test_df)

        # ----------------------------------
        # Metrics
        # ----------------------------------
        metrics = self.evaluator.evaluate(
            actual=test_df["target"],
            predicted=predictions,
        )
        confidence = self.confidence_calculator.calculate(metrics)
        # ----------------------------------
        # Retrain on Full Dataset
        # ----------------------------------
        model.train(data)
       
        return model, metrics, confidence