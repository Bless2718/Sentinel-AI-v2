"""
Crime Trend Detection
"""

import pandas as pd


class TrendDetector:
    """
    Detects whether crime is increasing,
    decreasing or stable.
    """

    def detect(
        self,
        df: pd.DataFrame,
        value_column: str = "crime_count",
    ) -> str:

        if value_column not in df.columns:
            raise ValueError(
                f"Missing column: {value_column}"
            )

        values = df[value_column]

        if len(values) < 2:
            return "stable"

        if values.iloc[-1] > values.iloc[0]:
            return "increasing"

        if values.iloc[-1] < values.iloc[0]:
            return "decreasing"

        return "stable"