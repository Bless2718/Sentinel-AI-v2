"""
Prediction Confidence
"""

import pandas as pd


class ConfidenceScorer:
    """
    Calculates a normalized confidence score.
    """

    def score(
        self,
        predictions: pd.Series,
    ) -> float:

        if len(predictions) == 0:
            raise ValueError(
                "Predictions cannot be empty."
            )

        variation = predictions.std()

        if pd.isna(variation):
            variation = 0.0

        confidence = max(
            0.0,
            min(
                1.0,
                1 / (1 + variation),
            ),
        )

        return round(confidence, 4)