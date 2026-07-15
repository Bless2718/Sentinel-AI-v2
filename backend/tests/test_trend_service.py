import pandas as pd

from app.trends.trend_service import (
    TrendService,
)


def test_trend_service():

    df = pd.DataFrame(
        {
            "month": [
                1,
                1,
                2,
                2,
                3,
                3,
            ],
            "crime_count": [
                10,
                20,
                30,
                40,
                50,
                60,
            ],
        }
    )

    service = TrendService()

    result = service.analyze(df)

    assert "trend" in result

    assert "seasonality" in result

    assert "anomalies" in result

    assert "summary" in result