import pandas as pd

from app.geospatial.clustering import (
    SpatialClusterer,
)


def test_spatial_clustering():

    df = pd.DataFrame(
        {
            "latitude": [
                13.080,
                13.081,
                13.082,
                13.500,
                13.501,
                13.502,
            ],
            "longitude": [
                80.270,
                80.271,
                80.272,
                80.600,
                80.601,
                80.602,
            ],
        }
    )

    clusterer = SpatialClusterer()

    result = clusterer.cluster(df)

    assert "cluster" in result.columns

    assert len(result) == len(df)

    assert result["cluster"].nunique() >= 2