import pandas as pd

from app.forecasting.pipeline import ForecastPipeline


def test_forecast_pipeline():

    df = pd.DataFrame(
        {
            "incident_date": pd.date_range(
                "2022-01-01",
                periods=730,
                freq="D",
            )
        }
    )

    pipeline = ForecastPipeline()

    results = pipeline.run(df)

    assert len(results) == 3

    assert "arima" in results

    assert "random_forest" in results

    assert "xgboost" in results