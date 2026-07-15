import pandas as pd

from app.feature_engineering.pipeline import (
    FeatureEngineeringPipeline,
)


def test_feature_pipeline():

    df = pd.DataFrame(
        {
            "incident_date": ["2025-01-14 18:30:00"],
            "latitude": ["13.0827"],
            "longitude": ["80.2707"],
            "crime_type": [" Theft "],
            "district": [" D1 "],
            "neighborhood": [" Downtown "],
        }
    )

    pipeline = FeatureEngineeringPipeline()

    result = pipeline.transform(df)

    assert result.loc[0, "year"] == 2025

    assert result.loc[0, "month"] == 1

    assert result.loc[0, "crime_type"] == "theft"

    assert result.loc[0, "district"] == "d1"

    assert result.loc[0, "latitude"] == 13.0827

    assert result.loc[0, "longitude"] == 80.2707