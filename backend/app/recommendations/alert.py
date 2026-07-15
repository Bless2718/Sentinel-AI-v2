"""
Alert Generation
"""


class AlertGenerator:
    """
    Generates alert levels
    based on geographic risk.
    """

    def generate(
        self,
        risk_score: float,
    ) -> dict:

        if risk_score >= 0.8:
            return {
                "level": "HIGH",
                "message": "Immediate attention required.",
            }

        if risk_score >= 0.5:
            return {
                "level": "MEDIUM",
                "message": "Monitor the area closely.",
            }

        return {
            "level": "LOW",
            "message": "Routine monitoring.",
        }