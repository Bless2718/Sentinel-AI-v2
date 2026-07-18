"""
Explanation Engine

Generates human-readable intelligence
from forecasts and risk assessments.
"""

from app.intelligence.explanation_result import ExplanationResult
from app.intelligence.trend import Trend
from app.risk.risk_level import RiskLevel


class ExplanationEngine:
    """
    Produces intelligence summaries
    for crime forecasts.
    """

    def generate(
        self,
        trend: Trend,
        risk_level: RiskLevel,
    ) -> ExplanationResult:

        if trend == Trend.INCREASING:
            trend_text = (
                "Crime activity is expected to increase "
                "over the forecast period."
            )

        elif trend == Trend.DECREASING:
            trend_text = (
                "Crime activity is expected to decrease "
                "over the forecast period."
            )

        else:
            trend_text = (
                "Crime activity is expected to remain "
                "relatively stable."
            )

        if risk_level == RiskLevel.LOW:
            recommendation = (
                "Maintain routine patrols and continue monitoring."
            )

        elif risk_level == RiskLevel.MEDIUM:
            recommendation = (
                "Increase patrol visibility and monitor hotspot areas."
            )

        elif risk_level == RiskLevel.HIGH:
            recommendation = (
                "Deploy additional patrol units and surveillance resources."
            )

        else:
            recommendation = (
                "Initiate enhanced operational response and notify command staff."
            )

        summary = (
            f"{trend_text} "
            f"Current assessed risk level is {risk_level.value}."
        )

        return ExplanationResult(
            trend=trend,
            summary=summary,
            recommendation=recommendation,
        )