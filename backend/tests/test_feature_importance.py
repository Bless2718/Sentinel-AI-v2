from app.explainability.feature_importance import (
    FeatureImportance,
)


def test_feature_importance():

    calculator = FeatureImportance()

    result = calculator.calculate(
        ["month", "district", "crime_density"],
        [0.2, 0.8, 0.5],
    )

    assert result.iloc[0]["feature"] == "district"

    assert len(result) == 3