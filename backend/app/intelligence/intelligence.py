"""
Intelligence Service

Coordinates trend detection and explanation
generation to produce an intelligence report.
"""

from app.intelligence.explanation import ExplanationEngine
from app.intelligence.explanation_result import ExplanationResult
from app.intelligence.trend_detector import TrendDetector
from app.risk.risk_level import RiskLevel


class IntelligenceService:
    """
    Generates intelligence reports
    from forecast predictions.
    """

    def __init__(self):

        self.trend_detector = TrendDetector()
        self.explainer = ExplanationEngine()

    def generate(
        self,
        predictions: list[float],
        risk_level: RiskLevel,
    ) -> ExplanationResult:

        trend = self.trend_detector.detect(
            predictions
        )

        return self.explainer.generate(
            trend,
            risk_level,
        )