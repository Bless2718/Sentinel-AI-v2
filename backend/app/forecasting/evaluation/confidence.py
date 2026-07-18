"""
Forecast Confidence
"""

from app.forecasting.evaluation.metrics import ForecastMetrics


class ConfidenceCalculator:
    """
    Calculates a confidence score from evaluation metrics.
    """

    def calculate(
        self,
        metrics: ForecastMetrics,
    ) -> float:

        score = metrics.r2 * 100

        score = max(0.0, min(score, 100.0))

        return round(score, 2)