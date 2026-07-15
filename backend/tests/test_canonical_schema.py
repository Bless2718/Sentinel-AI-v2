from app.dataset.canonical_schema import CANONICAL_SCHEMA


def test_canonical_schema_exists():

    assert "incident_date" in CANONICAL_SCHEMA

    assert "crime_type" in CANONICAL_SCHEMA

    assert "latitude" in CANONICAL_SCHEMA

    assert "longitude" in CANONICAL_SCHEMA


def test_incident_date_aliases():

    aliases = CANONICAL_SCHEMA["incident_date"]

    assert "date" in aliases

    assert "occurred_on" in aliases


def test_crime_type_aliases():

    aliases = CANONICAL_SCHEMA["crime_type"]

    assert "primary_type" in aliases

    assert "offense" in aliases