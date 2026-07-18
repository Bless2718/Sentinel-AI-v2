"""
Risk Result

Represents the output of a crime risk assessment.
"""

from dataclasses import dataclass, field

from app.risk.risk_level import RiskLevel


@dataclass(slots=True)
class RiskResult:
    """
    Stores the result of a crime risk assessment.
    """

    risk_score: float

    risk_level: RiskLevel

    confidence: float

    recommendations: list[str] = field(default_factory=list)

    alerts: list[str] = field(default_factory=list)