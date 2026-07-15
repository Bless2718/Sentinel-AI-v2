"""
Trend Intelligence Service
"""

import pandas as pd

from app.trends.trend_detector import TrendDetector
from app.trends.seasonality import SeasonalityDetector
from app.trends.anomaly import AnomalyDetector
from app.trends.summarizer import TrendSummarizer


class TrendService:
    """
    Executes the complete trend analysis pipeline.
    """

    def __init__(self):

        self.detector = TrendDetector()

        self.seasonality = SeasonalityDetector()

        self.anomaly = AnomalyDetector()

        self.summarizer = TrendSummarizer()

    def analyze(
        self,
        df: pd.DataFrame,
    ) -> dict:

        trend = self.detector.detect(df)

        seasonal = self.seasonality.detect(df)

        anomalies = self.anomaly.detect(df)

        summary = self.summarizer.summarize(
            trend=trend,
            seasonality=seasonal,
            anomalies=anomalies,
        )

        return {
            "trend": trend,
            "seasonality": seasonal,
            "anomalies": anomalies,
            "summary": summary,
        }