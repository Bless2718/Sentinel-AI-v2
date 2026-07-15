"""
Patrol Recommendation
"""


class PatrolRecommender:
    """
    Generates patrol recommendations
    based on geographic risk.
    """

    def recommend(
        self,
        risk_score: float,
    ) -> str:

        if risk_score >= 0.8:
            return "Increase patrol frequency."

        if risk_score >= 0.5:
            return "Maintain regular patrols."

        return "Routine monitoring is sufficient."