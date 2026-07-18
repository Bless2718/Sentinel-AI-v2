"""
Risk Alert

Represents an operational alert generated
from a crime risk assessment.
"""

from dataclasses import dataclass

from app.risk.risk_level import RiskLevel


@dataclass(slots=True)
class Alert:
    """
    Represents a crime risk alert.
    """

    title: str

    risk_level: RiskLevel

    message: str