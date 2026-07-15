from app.recommendations.recommendation import (
    RecommendationAggregator,
)


def test_recommendation_aggregator():

    aggregator = RecommendationAggregator()

    result = aggregator.aggregate(
        patrol="Increase patrol frequency.",
        resources={
            "officers": 10,
            "vehicles": 3,
        },
        alert={
            "level": "HIGH",
            "message": "Immediate attention required.",
        },
    )

    assert result["patrol"] == "Increase patrol frequency."

    assert result["resources"]["officers"] == 10

    assert result["alert"]["level"] == "HIGH"