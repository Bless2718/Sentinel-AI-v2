import pandas as pd

from app.trends.trend_detector import (
    TrendDetector,
)


def test_increasing_trend():

    df = pd.DataFrame(
        {
            "crime_count": [
                10,
                15,
                18,
                25,
            ]
        }
    )

    detector = TrendDetector()

    assert detector.detect(df) == "increasing"


def test_decreasing_trend():

    df = pd.DataFrame(
        {
            "crime_count": [
                25,
                20,
                15,
                10,
            ]
        }
    )

    detector = TrendDetector()

    assert detector.detect(df) == "decreasing"


def test_stable_trend():

    df = pd.DataFrame(
        {
            "crime_count": [
                10,
                10,
                10,
            ]
        }
    )

    detector = TrendDetector()

    assert detector.detect(df) == "stable"