import pandas as pd

from app.trends.seasonality import (
    SeasonalityDetector,
)


def test_monthly_seasonality():

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
                15,
                25,
            ],
        }
    )

    detector = SeasonalityDetector()

    result = detector.detect(df)

    assert len(result) == 3

    assert "average_crime" in result.columns

    assert result.loc[
        result["month"] == 1,
        "average_crime",
    ].iloc[0] == 15