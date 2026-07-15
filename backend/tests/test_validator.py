from app.dataset.validator import DatasetValidator


def test_valid_dataset():

    mapping = {
        "incident_date": "Occurred_On",
        "crime_type": "Primary Type",
        "latitude": "Lat",
        "longitude": "Lng",
    }

    validator = DatasetValidator()

    result = validator.validate(mapping)

    assert result.is_valid is True

    assert result.errors == []


def test_invalid_dataset():

    mapping = {
        "incident_date": "Occurred_On",
        "crime_type": "Primary Type",
    }

    validator = DatasetValidator()

    result = validator.validate(mapping)

    assert result.is_valid is False

    assert len(result.errors) == 2

    assert "Missing required field: latitude" in result.errors

    assert "Missing required field: longitude" in result.errors