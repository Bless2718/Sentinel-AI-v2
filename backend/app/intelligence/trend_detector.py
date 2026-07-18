"""
Trend Detector

Determines the overall trend of
forecasted crime activity.
"""

import numpy as np

from app.intelligence.trend import Trend


class TrendDetector:
    """
    Detects the overall direction
    of forecasted crime.
    """

    def detect(
        self,
        predictions: list[float],
    ) -> Trend:

        if len(predictions) < 2:
            return Trend.STABLE

        x = np.arange(len(predictions))
        y = np.asarray(predictions, dtype=float)

        slope, _ = np.polyfit(x, y, 1)

        if slope > 1:
            return Trend.INCREASING

        if slope < -1:
            return Trend.DECREASING

        return Trend.STABLE