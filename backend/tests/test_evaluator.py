import pandas as pd

from app.forecasting.evaluator import (
    ForecastEvaluator,
)


def test_evaluator():

    actual = pd.Series(
        [10, 20, 30, 40]
    )

    predicted = pd.Series(
        [12, 19, 31, 41]
    )

    evaluator = ForecastEvaluator()

    metrics = evaluator.evaluate(
        actual,
        predicted,
    )

    assert "mae" in metrics

    assert "rmse" in metrics

    assert "r2_score" in metrics

    assert metrics["mae"] > 0