from app.explainability.narrative import (
    NarrativeGenerator,
)


def test_narrative():

    generator = NarrativeGenerator()

    narrative = generator.generate(
        prediction=125.4,
        confidence=0.91,
        explanation={
            "top_features": [
                "district",
                "crime_density",
                "month",
            ]
        },
    )

    assert isinstance(narrative, str)

    assert "district" in narrative

    assert "91.0%" in narrative

    assert "125.4" in narrative