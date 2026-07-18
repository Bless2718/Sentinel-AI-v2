"""
Explanation Result

Represents the intelligence generated
for a crime forecast.
"""

from dataclasses import dataclass

from app.intelligence.trend import Trend


@dataclass(slots=True)
class ExplanationResult:
    """
    Intelligence generated from
    forecast and risk assessment.
    """

    trend: Trend

    summary: str

    recommendation: str