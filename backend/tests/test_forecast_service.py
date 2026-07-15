import pandas as pd

from app.forecasting.forecast import ForecastService
from app.forecasting.forecast_result import ForecastResult
from app.forecasting.model import ForecastModel


class DummyForecastModel(ForecastModel):

    def __init__(self):
        self.trained = False

    def train(self, df: pd.DataFrame) -> None:
        self.trained = True

    def predict(self, periods: int) -> ForecastResult:

        predictions = pd.DataFrame(
            {
                "prediction": [100] * periods
            }
        )

        return ForecastResult(
            predictions=predictions,
            model_name="Dummy",
        )


def test_forecast_service():

    service = ForecastService()

    model = DummyForecastModel()

    training = pd.DataFrame(
        {
            "crime_count": [10, 20, 30]
        }
    )

    result = service.run(
        model=model,
        training_data=training,
        periods=5,
    )

    assert model.trained is True

    assert len(result.predictions) == 5

    assert result.model_name == "Dummy"