import pandas as pd

from app.forecasting.aggregator import (
    TimeAggregator,
)


def test_monthly_aggregation():

    df = pd.DataFrame(
        {
            "incident_date": [
                "2024-01-01",
                "2024-01-02",
                "2024-01-10",
                "2024-02-01",
                "2024-02-02",
            ]
        }
    )

    aggregator = TimeAggregator()

    result = aggregator.aggregate(df)

    assert len(result) == 2

    assert result.iloc[0]["crime_count"] == 3

    assert result.iloc[1]["crime_count"] == 2