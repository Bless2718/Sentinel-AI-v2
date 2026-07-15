import pandas as pd

from app.feature_engineering.spatial import (
    SpatialFeatureEngineer,
)


def test_spatial_features():

    df = pd.DataFrame(
        {
            "latitude": ["13.0827"],
            "longitude": ["80.2707"],
        }
    )

    engineer = SpatialFeatureEngineer()

    result = engineer.transform(df)

    assert result["latitude"].dtype.kind == "f"

    assert result["longitude"].dtype.kind == "f"

    assert result.loc[0, "latitude"] == 13.0827

    assert result.loc[0, "longitude"] == 80.2707