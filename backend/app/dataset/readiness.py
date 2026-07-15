"""
Dataset Readiness Assessment
"""

from app.dataset.quality_report import QualityReport
from app.dataset.validation_result import ValidationResult
from app.dataset.readiness_report import ReadinessReport


class DatasetReadiness:
    """
    Determines whether a dataset is ready for
    the Sentinel AI Intelligence Pipeline.
    """

    MINIMUM_QUALITY_SCORE = 70.0

    def assess(
        self,
        validation: ValidationResult,
        quality: QualityReport,
    ) -> ReadinessReport:

        reasons: list[str] = []

        if not validation.is_valid:
            reasons.extend(validation.errors)

        if quality.quality_score < self.MINIMUM_QUALITY_SCORE:
            reasons.append(
                f"Quality score below minimum ({self.MINIMUM_QUALITY_SCORE})."
            )

        ready = len(reasons) == 0

        return ReadinessReport(
            readiness_score=quality.quality_score,
            ready=ready,
            reasons=reasons,
        )