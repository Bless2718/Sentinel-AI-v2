"""
Trend Types

Defines the possible forecast trends.
"""

from enum import Enum


class Trend(str, Enum):
    """
    Forecast trend categories.
    """

    INCREASING = "INCREASING"

    DECREASING = "DECREASING"

    STABLE = "STABLE"