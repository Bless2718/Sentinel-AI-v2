from app.dataset.quality_report import QualityReport
from app.dataset.readiness import DatasetReadiness
from app.dataset.validation_result import ValidationResult


def test_dataset_ready():

    validation = ValidationResult(
        is_valid=True,
    )

    quality = QualityReport(
        quality_score=92.0,
        missing_percentage=1.0,
        duplicate_percentage=2.0,
        total_rows=100,
        total_columns=8,
    )

    readiness = DatasetReadiness()

    report = readiness.assess(
        validation,
        quality,
    )

    assert report.ready is True
    assert report.readiness_score == 92.0
    assert report.reasons == []


def test_dataset_not_ready():

    validation = ValidationResult(
        is_valid=False,
        errors=["Missing required field: latitude"],
    )

    quality = QualityReport(
        quality_score=60.0,
        missing_percentage=15.0,
        duplicate_percentage=25.0,
        total_rows=100,
        total_columns=8,
    )

    readiness = DatasetReadiness()

    report = readiness.assess(
        validation,
        quality,
    )

    assert report.ready is False
    assert len(report.reasons) == 2