import pandas as pd

from app.explainability.explanation import (
    PredictionExplainer,
)


def test_prediction_explanation():

    importance = pd.DataFrame(
        {
            "feature": [
                "district",
                "crime_density",
                "month",
                "weekday",
            ],
            "importance": [
                0.9,
                0.7,
                0.5,
                0.2,
            ],
        }
    )

    explainer = PredictionExplainer()

    result = explainer.explain(importance)

    assert result["feature_count"] == 3

    assert result["top_features"][0] == "district"