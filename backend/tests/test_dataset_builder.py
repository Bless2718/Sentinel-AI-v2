import pandas as pd

from app.forecasting.dataset_builder import (
    ForecastDatasetBuilder,
)


def test_dataset_builder():

    df = pd.DataFrame(
        {
            "incident_date": [
                "2024-01-01",
                "2024-01-05",
                "2024-02-01",
                "2024-02-03",
                "2024-02-10",
            ]
        }
    )

    builder = ForecastDatasetBuilder()

    result = builder.build(df)

    assert len(result) == 2

    assert list(result["crime_count"]) == [2, 3]