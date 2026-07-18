"""
Risk Assessment Service

Combines scoring, recommendations,
and alerts into a complete risk assessment.
"""

from app.risk.alert import Alert
from app.risk.recommendation_engine import RecommendationEngine
from app.risk.risk_level import RiskLevel
from app.risk.risk_result import RiskResult
from app.risk.scorer import RiskScorer


class RiskAssessmentService:
    """
    Performs crime risk assessment.
    """

    def __init__(self):

        self.scorer = RiskScorer()
        self.recommendations = RecommendationEngine()

    def assess(
        self,
        prediction: float,
        all_predictions: list[float],
    ) -> RiskResult:

        risk_score, risk_level = self.scorer.score(
            prediction,
            all_predictions,
        )

        recommendations = self.recommendations.generate(
            risk_level
        )

        alerts = []

        if risk_level == RiskLevel.HIGH:
            alerts.append(
                Alert(
                    title="High Crime Risk",
                    risk_level=risk_level,
                    message=(
                        "Crime levels are expected to be "
                        "higher than normal."
                    ),
                )
            )

        elif risk_level == RiskLevel.CRITICAL:
            alerts.append(
                Alert(
                    title="Critical Crime Risk",
                    risk_level=risk_level,
                    message=(
                        "Immediate operational attention "
                        "is recommended."
                    ),
                )
            )

        confidence = round(risk_score, 2)

        return RiskResult(
            risk_score=risk_score,
            risk_level=risk_level,
            confidence=confidence,
            recommendations=recommendations,
            alerts=[
                alert.message
                for alert in alerts
            ],
        )