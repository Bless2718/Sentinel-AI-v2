import pandas as pd

from app.explainability.confidence import (
    ConfidenceScorer,
)


def test_confidence():

    predictions = pd.Series(
        [
            100,
            102,
            101,
            99,
            100,
        ]
    )

    scorer = ConfidenceScorer()

    confidence = scorer.score(predictions)

    assert 0 <= confidence <= 1