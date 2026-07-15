from app.dataset.schema_mapper import SchemaMapper


def test_schema_mapping():

    columns = [
        "Occurred_On",
        "Primary Type",
        "Lat",
        "Lng",
        "Beat",
        "Community Area",
    ]

    mapper = SchemaMapper()

    mapping = mapper.map_columns(columns)

    assert mapping["incident_date"] == "Occurred_On"

    assert mapping["crime_type"] == "Primary Type"

    assert mapping["latitude"] == "Lat"

    assert mapping["longitude"] == "Lng"

    assert mapping["police_beat"] == "Beat"

    assert mapping["neighborhood"] == "Community Area"


def test_normalization():

    mapper = SchemaMapper()

    assert mapper._normalize("Primary Type") == "primarytype"

    assert mapper._normalize("Occurred_On") == "occurredon"

    assert mapper._normalize("Crime-Date") == "crimedate"