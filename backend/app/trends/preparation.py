"""
Trend Data Preparation
"""

from __future__ import annotations

import pandas as pd


class TrendDataPreparer:
    """
    Converts the preprocessed Sentinel dataset into the
    chronological crime-count format required by the
    trend analysis pipeline.
    """

    def prepare(
        self,
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        # Sentinel preprocessing creates these canonical
        # derived temporal fields.
        required = ["year", "month"]

        missing = [
            column
            for column in required
            if column not in df.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

        result = df[
            ["year", "month"]
        ].copy()

        # Ensure numeric temporal values.
        result["year"] = pd.to_numeric(
            result["year"],
            errors="coerce",
        )

        result["month"] = pd.to_numeric(
            result["month"],
            errors="coerce",
        )

        # Remove invalid temporal records.
        result = result.dropna(
            subset=["year", "month"]
        )

        result["year"] = (
            result["year"]
            .astype(int)
        )

        result["month"] = (
            result["month"]
            .astype(int)
        )

        # Keep only valid calendar months.
        result = result[
            (result["month"] >= 1)
            & (result["month"] <= 12)
        ]

        # Aggregate crimes by year/month.
        result = (
            result
            .groupby(
                ["year", "month"],
                as_index=False,
            )
            .size()
            .rename(
                columns={
                    "size": "crime_count",
                }
            )
        )

        # Chronological ordering.
        result = (
            result
            .sort_values(
                ["year", "month"]
            )
            .reset_index(
                drop=True
            )
        )

        return result