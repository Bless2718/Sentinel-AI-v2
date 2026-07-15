import pandas as pd

from app.forecasting.models.arima import (
    ARIMAForecastModel,
)


def test_arima():

    df = pd.DataFrame(
        {
            "crime_count": [
                12,
                18,
                15,
                20,
                24,
                28,
                31,
                35,
                38,
                42,
            ]
        }
    )

    model = ARIMAForecastModel()

    model.train(df)

    result = model.predict(3)

    assert len(result.predictions) == 3

    assert result.model_name == "ARIMA"