import pandas as pd

from app.forecasting.forecast_result import ForecastResult


def test_forecast_result():

    result = ForecastResult(
        predictions=pd.DataFrame(),
        model_name="Test Model",
    )

    assert result.model_name == "Test Model"

    assert isinstance(result.predictions, pd.DataFrame)