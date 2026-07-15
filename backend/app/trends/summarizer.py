"""
Crime Trend Summarizer
"""

import pandas as pd


class TrendSummarizer:
    """
    Combines trend analysis results into a
    single structured summary.
    """

    def summarize(
        self,
        trend: str,
        seasonality: pd.DataFrame,
        anomalies: pd.DataFrame,
    ) -> dict:

        return {
            "trend": trend,
            "seasonal_periods": len(seasonality),
            "anomaly_count": int(
                anomalies["is_anomaly"].sum()
            ),
        }