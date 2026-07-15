"""
Crime Hotspot Detection
"""

import pandas as pd


class HotspotDetector:
    """
    Detects crime hotspots based on
    incident frequency.
    """

    def detect(
        self,
        df: pd.DataFrame,
        threshold: int = 5,
    ) -> pd.DataFrame:

        required = ["latitude", "longitude"]

        missing = [
            c for c in required
            if c not in df.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

        hotspots = (
            df.groupby(
                ["latitude", "longitude"]
            )
            .size()
            .reset_index(name="crime_count")
        )

        return hotspots[
            hotspots["crime_count"] >= threshold
        ].reset_index(drop=True)