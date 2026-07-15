import pandas as pd

from app.geospatial.hotspot import HotspotDetector


def test_hotspot_detector():

    df = pd.DataFrame(
        {
            "latitude": [
                13.08,
                13.08,
                13.08,
                13.08,
                13.08,
                13.10,
            ],
            "longitude": [
                80.27,
                80.27,
                80.27,
                80.27,
                80.27,
                80.30,
            ],
        }
    )

    detector = HotspotDetector()

    hotspots = detector.detect(
        df,
        threshold=5,
    )

    assert len(hotspots) == 1

    assert hotspots.loc[0, "crime_count"] == 5