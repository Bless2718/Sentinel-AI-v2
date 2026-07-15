import pandas as pd

from app.trends.anomaly import (
    AnomalyDetector,
)


def test_anomaly_detection():

    df = pd.DataFrame(
        {
            "crime_count": [
                10,
                12,
                11,
                13,
                100,
            ]
        }
    )

    detector = AnomalyDetector()

    result = detector.detect(df)

    assert "is_anomaly" in result.columns

    assert result["is_anomaly"].sum() == 1

    assert result.iloc[-1]["is_anomaly"]