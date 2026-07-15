import pandas as pd

from app.forecasting.comparison import ForecastComparison


def test_model_comparison():

    actual = pd.Series([10, 20, 30, 40])

    predictions = {
        "arima": pd.Series([11, 19, 29, 41]),
        "random_forest": pd.Series([10, 20, 30, 40]),
    }

    comparison = ForecastComparison()

    result = comparison.compare(
        models={},
        actual=actual,
        predictions=predictions,
    )

    assert len(result) == 2

    assert "model" in result.columns
    assert "mae" in result.columns
    assert "rmse" in result.columns
    assert "r2_score" in result.columns