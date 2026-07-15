"""
Recommendation Aggregator
"""


class RecommendationAggregator:
    """
    Combines all recommendation outputs
    into a single structure.
    """

    def aggregate(
        self,
        patrol: str,
        resources: dict,
        alert: dict,
    ) -> dict:

        return {
            "patrol": patrol,
            "resources": resources,
            "alert": alert,
        }