import pandas as pd

from app.forecasting.selector import ForecastSelector


def test_selector_mae():

    comparison = pd.DataFrame(
        {
            "model": [
                "arima",
                "random_forest",
                "xgboost",
            ],
            "mae": [
                5.2,
                3.1,
                4.0,
            ],
            "rmse": [
                7.0,
                5.5,
                6.2,
            ],
            "r2_score": [
                0.90,
                0.95,
                0.93,
            ],
        }
    )

    selector = ForecastSelector()

    winner = selector.select(comparison)

    assert winner == "random_forest"


def test_selector_r2():

    comparison = pd.DataFrame(
        {
            "model": [
                "arima",
                "random_forest",
                "xgboost",
            ],
            "mae": [
                5.2,
                3.1,
                4.0,
            ],
            "rmse": [
                7.0,
                5.5,
                6.2,
            ],
            "r2_score": [
                0.90,
                0.95,
                0.93,
            ],
        }
    )

    selector = ForecastSelector()

    winner = selector.select(
        comparison,
        metric="r2_score",
    )

    assert winner == "random_forest"