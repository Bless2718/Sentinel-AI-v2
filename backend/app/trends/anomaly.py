"""
Crime Anomaly Detection
"""

import pandas as pd


class AnomalyDetector:
    """
    Detects anomalies using the
    Interquartile Range (IQR) method.
    """

    def detect(
        self,
        df: pd.DataFrame,
        value_column: str = "crime_count",
    ) -> pd.DataFrame:

        if value_column not in df.columns:
            raise ValueError(
                f"Missing column: {value_column}"
            )

        result = df.copy()

        q1 = result[value_column].quantile(0.25)
        q3 = result[value_column].quantile(0.75)

        iqr = q3 - q1

        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr

        result["is_anomaly"] = (
            (result[value_column] < lower)
            | (result[value_column] > upper)
        )

        return result