from app.forecasting.registry import (
    ForecastModelRegistry,
)


def test_available_models():

    registry = ForecastModelRegistry()

    models = registry.available_models()

    assert "arima" in models
    assert "random_forest" in models
    assert "xgboost" in models


def test_create_model():

    registry = ForecastModelRegistry()

    model = registry.create("arima")

    assert model is not None