"""
Forecast Metrics
"""

from dataclasses import dataclass


@dataclass
class ForecastMetrics:

    mae: float
    rmse: float
    r2: float