import pandas as pd

from app.geospatial.density import (
    CrimeDensityAnalyzer,
)


def test_density():

    df = pd.DataFrame(
        {
            "cluster": [
                0,
                0,
                0,
                1,
                1,
            ]
        }
    )

    analyzer = CrimeDensityAnalyzer()

    result = analyzer.analyze(df)

    assert len(result) == 2

    assert "density" in result.columns

    assert abs(result["density"].sum() - 1.0) < 1e-6