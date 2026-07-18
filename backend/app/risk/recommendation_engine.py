"""
Recommendation Engine

Generates recommendations based on
crime risk levels.
"""

from app.risk.risk_level import RiskLevel


class RecommendationEngine:
    """
    Produces operational recommendations
    for each risk level.
    """

    def generate(
        self,
        risk_level: RiskLevel,
    ) -> list[str]:

        if risk_level == RiskLevel.LOW:
            return [
                "Maintain routine patrols.",
                "Continue monitoring crime trends.",
            ]

        if risk_level == RiskLevel.MEDIUM:
            return [
                "Increase patrol visibility.",
                "Review recent crime patterns.",
                "Monitor high-traffic locations.",
            ]

        if risk_level == RiskLevel.HIGH:
            return [
                "Increase patrol frequency.",
                "Deploy surveillance units.",
                "Coordinate with nearby police stations.",
                "Monitor repeat offenders.",
            ]

        return [
            "Activate emergency response planning.",
            "Deploy maximum patrol coverage.",
            "Notify senior command staff.",
            "Increase surveillance in hotspot areas.",
            "Issue public safety advisories if necessary.",
        ]