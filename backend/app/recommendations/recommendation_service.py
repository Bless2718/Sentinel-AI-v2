"""
Recommendation Service
"""

from app.recommendations.alert import AlertGenerator
from app.recommendations.patrol import PatrolRecommender
from app.recommendations.recommendation import (
    RecommendationAggregator,
)
from app.recommendations.resource import ResourceAllocator


class RecommendationService:
    """
    Executes the complete recommendation pipeline.
    """

    def __init__(self):

        self.patrol = PatrolRecommender()

        self.resources = ResourceAllocator()

        self.alert = AlertGenerator()

        self.aggregator = RecommendationAggregator()

    def recommend(
        self,
        risk_score: float,
    ) -> dict:

        patrol = self.patrol.recommend(
            risk_score
        )

        resources = self.resources.allocate(
            risk_score
        )

        alert = self.alert.generate(
            risk_score
        )

        return self.aggregator.aggregate(
            patrol,
            resources,
            alert,
        )