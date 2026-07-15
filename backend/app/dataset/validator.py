"""
Dataset Validator

Validates that the uploaded dataset contains the
minimum required information for Sentinel AI.
"""

from app.dataset.validation_result import ValidationResult


class DatasetValidator:
    """
    Validates mapped dataset columns.
    """

    REQUIRED_FIELDS = [
        "incident_date",
        "crime_type",
        "latitude",
        "longitude",
    ]

    def validate(
        self,
        mapping: dict[str, str],
    ) -> ValidationResult:

        errors = []

        for field in self.REQUIRED_FIELDS:

            if field not in mapping:
                errors.append(
                    f"Missing required field: {field}"
                )

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
        )