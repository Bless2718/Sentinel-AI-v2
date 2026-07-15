import pandas as pd

from app.forecasting.forecast_result import ForecastResult
from app.forecasting.model import ForecastModel
from app.forecasting.trainer import ForecastTrainer


class DummyForecastModel(ForecastModel):

    def __init__(self):
        self.trained = False

    def train(self, df: pd.DataFrame) -> None:
        self.trained = True

    def predict(self, periods: int) -> ForecastResult:
        return ForecastResult(
            predictions=pd.DataFrame(),
            model_name="Dummy",
        )


def test_trainer():

    trainer = ForecastTrainer()

    model = DummyForecastModel()

    df = pd.DataFrame({"x": [1, 2, 3]})

    trained_model = trainer.train(model, df)

    assert trained_model.trained is True