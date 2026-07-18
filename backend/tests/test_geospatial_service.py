import pandas as pd

from app.geospatial.geospatial_service import (
    GeospatialService,
)


def test_geospatial_service():

    df = pd.DataFrame(
        {
            "latitude": [
                13.08,
                13.08,
                13.08,
                13.09,
                13.09,
                13.10,
            ],
            "longitude": [
                80.27,
                80.27,
                80.27,
                80.28,
                80.28,
                80.29,
            ],
        }
    )

    service = GeospatialService()

    result = service.analyze(df)

    assert "hotspots" in result

    assert "clusters" in result

    assert "density" in result

    assert "risk" in result

    assert "heatmap" in result