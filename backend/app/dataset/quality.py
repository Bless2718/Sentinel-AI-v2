"""
Dataset Quality Assessment
"""

from app.dataset.profile import DatasetProfile
from app.dataset.quality_report import QualityReport


class QualityAssessment:
    """
    Computes dataset quality metrics.
    """

    def assess(
        self,
        profile: DatasetProfile,
    ) -> QualityReport:

        total_cells = profile.rows * profile.columns

        if total_cells == 0:
            missing_percentage = 0.0
        else:
            missing_percentage = (
                profile.missing_values / total_cells
            ) * 100

        if profile.rows == 0:
            duplicate_percentage = 0.0
        else:
            duplicate_percentage = (
                profile.duplicate_rows / profile.rows
            ) * 100

        quality_score = max(
            0.0,
            100.0
            - missing_percentage
            - duplicate_percentage,
        )

        return QualityReport(
            quality_score=round(quality_score, 2),
            missing_percentage=round(
                missing_percentage,
                2,
            ),
            duplicate_percentage=round(
                duplicate_percentage,
                2,
            ),
            total_rows=profile.rows,
            total_columns=profile.columns,
        )