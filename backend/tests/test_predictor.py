import pandas as pd

from app.forecasting.forecast_result import ForecastResult
from app.forecasting.model import ForecastModel
from app.forecasting.predictor import ForecastPredictor


class DummyForecastModel(ForecastModel):

    def train(self, df: pd.DataFrame) -> None:
        pass

    def predict(self, periods: int) -> ForecastResult:

        predictions = pd.DataFrame(
            {
                "prediction": [10] * periods
            }
        )

        return ForecastResult(
            predictions=predictions,
            model_name="Dummy",
        )


def test_predictor():

    predictor = ForecastPredictor()

    model = DummyForecastModel()

    result = predictor.predict(
        model=model,
        periods=5,
    )

    assert len(result.predictions) == 5

    assert result.model_name == "Dummy"