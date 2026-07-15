from app.recommendations.patrol import (
    PatrolRecommender,
)


def test_patrol_recommendation():

    recommender = PatrolRecommender()

    assert (
        recommender.recommend(0.9)
        == "Increase patrol frequency."
    )

    assert (
        recommender.recommend(0.6)
        == "Maintain regular patrols."
    )

    assert (
        recommender.recommend(0.2)
        == "Routine monitoring is sufficient."
    )