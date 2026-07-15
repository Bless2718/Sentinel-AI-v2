import pandas as pd

from app.feature_engineering.temporal import (
    TemporalFeatureEngineer,
)


def test_temporal_features():

    df = pd.DataFrame(
        {
            "incident_date": [
                "2025-01-14 18:30:00"
            ]
        }
    )

    engineer = TemporalFeatureEngineer()

    result = engineer.transform(df)

    assert result.loc[0, "year"] == 2025

    assert result.loc[0, "quarter"] == 1

    assert result.loc[0, "month"] == 1

    assert result.loc[0, "day"] == 14

    assert result.loc[0, "weekday"] == 1

    assert result.loc[0, "hour"] == 18