import pandas as pd

from app.geospatial.risk import (
    GeographicRiskAssessor,
)


def test_geographic_risk():

    density = pd.DataFrame(
        {
            "cluster": [0, 1],
            "crime_count": [6, 3],
            "density": [0.67, 0.33],
        }
    )

    assessor = GeographicRiskAssessor()

    result = assessor.assess(density)

    assert "risk_score" in result.columns

    assert result.loc[0, "risk_score"] == 1.0

    assert result.loc[1, "risk_score"] < 1.0