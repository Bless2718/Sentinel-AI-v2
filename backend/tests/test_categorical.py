import pandas as pd

from app.feature_engineering.categorical import (
    CategoricalFeatureEngineer,
)


def test_categorical_features():

    df = pd.DataFrame(
        {
            "crime_type": [" Theft "],
            "district": [" D1 "],
            "neighborhood": [" Downtown "],
        }
    )

    engineer = CategoricalFeatureEngineer()

    result = engineer.transform(df)

    assert result.loc[0, "crime_type"] == "theft"

    assert result.loc[0, "district"] == "d1"

    assert result.loc[0, "neighborhood"] == "downtown"