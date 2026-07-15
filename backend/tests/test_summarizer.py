import pandas as pd

from app.trends.summarizer import (
    TrendSummarizer,
)


def test_trend_summary():

    seasonality = pd.DataFrame(
        {
            "month": [1, 2, 3],
            "average_crime": [10, 20, 15],
        }
    )

    anomalies = pd.DataFrame(
        {
            "crime_count": [10, 20, 100],
            "is_anomaly": [False, False, True],
        }
    )

    summarizer = TrendSummarizer()

    summary = summarizer.summarize(
        trend="increasing",
        seasonality=seasonality,
        anomalies=anomalies,
    )

    assert summary["trend"] == "increasing"

    assert summary["seasonal_periods"] == 3

    assert summary["anomaly_count"] == 1