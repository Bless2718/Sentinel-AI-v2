from dataclasses import dataclass


@dataclass(slots=True)
class ReadinessReport:
    """
    Stores dataset readiness information.
    """

    readiness_score: float

    ready: bool

    reasons: list[str]