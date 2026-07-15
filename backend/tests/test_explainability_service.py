import pandas as pd

from app.explainability.explainability_service import (
    ExplainabilityService,
)


def test_explainability_service():

    service = ExplainabilityService()

    result = service.explain(
        prediction=150,
        predictions=pd.Series(
            [148, 150, 151, 149]
        ),
        feature_names=[
            "district",
            "crime_density",
            "month",
        ],
        importances=[
            0.8,
            0.6,
            0.4,
        ],
    )

    assert "importance" in result

    assert "explanation" in result

    assert "confidence" in result

    assert "narrative" in result