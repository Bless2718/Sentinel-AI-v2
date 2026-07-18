import pandas as pd

from app.geospatial.heatmap import (
    HeatmapGenerator,
)


def test_heatmap():

    df = pd.DataFrame(
        {
            "latitude": [
                13.0827,
                13.0900,
            ],
            "longitude": [
                80.2707,
                80.2800,
            ],
            "risk_score": [
                1.0,
                0.45,
            ],
        }
    )

    generator = HeatmapGenerator()

    result = generator.generate(df)

    assert len(result) == 2

    assert "latitude" in result.columns

    assert "longitude" in result.columns

    assert "risk_score" in result.columns