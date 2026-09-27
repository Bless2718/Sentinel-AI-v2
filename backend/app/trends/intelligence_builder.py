"""
Trend Intelligence Builder
"""

from __future__ import annotations

from typing import Any

import pandas as pd


class TrendIntelligenceBuilder:
    """
    Converts TrendService results into compact,
    JSON-compatible intelligence for Sentinel AI.
    """

    def build(
        self,
        result: dict[str, Any],
    ) -> dict[str, Any]:

        seasonality = result.get(
            "seasonality"
        )

        anomalies = result.get(
            "anomalies"
        )

        return {
            "trend": result.get(
                "trend"
            ),
            "summary": result.get(
                "summary",
                {},
            ),
            "seasonality": self._dataframe_to_records(
                seasonality
            ),
            "anomalies": self._dataframe_to_records(
                anomalies
            ),
        }

    @staticmethod
    def _dataframe_to_records(
        value: Any,
    ) -> list[dict[str, Any]]:

        if not isinstance(
            value,
            pd.DataFrame,
        ):
            return []

        result = value.copy()

        result = result.where(
            pd.notna(result),
            None,
        )

        return result.to_dict(
            orient="records"
        )
