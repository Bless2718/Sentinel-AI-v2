import pandas as pd

from app.forecasting.models.xgboost_model import (
    XGBoostForecastModel,
)


def test_xgboost():

    df = pd.DataFrame(
        {
            "month": [1, 2, 3, 4, 5, 6],
            "weekday": [1, 2, 3, 4, 5, 6],
            "crime_count": [10, 15, 18, 22, 30, 35],
        }
    )

    model = XGBoostForecastModel()

    model.train(df)

    result = model.predict(3)

    assert len(result.predictions) == 3

    assert result.model_name == "XGBoost"

    assert not result.predictions["prediction"].isna().any()