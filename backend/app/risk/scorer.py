"""
Risk Scorer

Converts crime forecasts into
risk scores and risk levels.
"""

import numpy as np

from app.risk.risk_level import RiskLevel


class RiskScorer:
    """
    Scores crime predictions.
    """

    def score(
        self,
        prediction: float,
        all_predictions: list[float],
    ) -> tuple[float, RiskLevel]:

        values = np.asarray(all_predictions, dtype=float)

        minimum = values.min()
        maximum = values.max()

        if maximum == minimum:
            risk_score = 50.0
        else:
            risk_score = (
                (prediction - minimum)
                / (maximum - minimum)
            ) * 100

        if risk_score < 25:
            level = RiskLevel.LOW
        elif risk_score < 50:
            level = RiskLevel.MEDIUM
        elif risk_score < 75:
            level = RiskLevel.HIGH
        else:
            level = RiskLevel.CRITICAL

        return round(float(risk_score), 2), level