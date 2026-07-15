from app.recommendations.recommendation_service import (
    RecommendationService,
)


def test_recommendation_service():

    service = RecommendationService()

    result = service.recommend(0.9)

    assert result["patrol"] == (
        "Increase patrol frequency."
    )

    assert result["resources"]["officers"] == 10

    assert result["resources"]["vehicles"] == 3

    assert result["alert"]["level"] == "HIGH"