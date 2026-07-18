from app.forecasting.pipeline_result import ForecastPipelineResult


def test_pipeline_result():

    result = ForecastPipelineResult(
        best_model="arima",
        best_forecast=None,
        comparison=None,
    )

    assert result.best_model == "arima"