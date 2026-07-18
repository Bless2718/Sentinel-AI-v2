import pandas as pd

from app.dataset.schema_mapper import SchemaMapper


def test_dataframe_rename():

    df = pd.DataFrame(
        {
            "TYPE": ["Theft"],
            "Date": ["2024-01-01"],
            "Latitude": [13.08],
            "Longitude": [80.27],
        }
    )

    mapper = SchemaMapper()

    mapping = mapper.map_columns(
        df.columns.tolist()
    )

    renamed = mapper.rename_dataframe(
        df,
        mapping,
    )

    assert "crime_type" in renamed.columns

    assert "incident_date" in renamed.columns

    assert "latitude" in renamed.columns

    assert "longitude" in renamed.columns