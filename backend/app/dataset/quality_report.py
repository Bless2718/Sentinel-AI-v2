from dataclasses import dataclass


@dataclass(slots=True)
class QualityReport:
    """
    Stores dataset quality metrics.
    """

    quality_score: float

    missing_percentage: float

    duplicate_percentage: float

    total_rows: int

    total_columns: int