from app.dataset.profile import DatasetProfile
from app.dataset.quality import QualityAssessment


def test_quality_report():

    profile = DatasetProfile(
        rows=100,
        columns=10,
        missing_values=20,
        duplicate_rows=5,
        memory_usage_mb=1.2,
        numeric_columns=[],
        categorical_columns=[],
        datetime_columns=[],
    )

    assessor = QualityAssessment()

    report = assessor.assess(profile)

    assert report.total_rows == 100

    assert report.total_columns == 10

    assert report.missing_percentage == 2.0

    assert report.duplicate_percentage == 5.0

    assert report.quality_score == 93.0