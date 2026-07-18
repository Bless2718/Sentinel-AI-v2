"""
Risk Levels

Defines the standard crime risk levels
used throughout Sentinel AI.
"""

from enum import Enum


class RiskLevel(str, Enum):
    """
    Crime risk categories.
    """

    LOW = "LOW"

    MEDIUM = "MEDIUM"

    HIGH = "HIGH"

    CRITICAL = "CRITICAL"