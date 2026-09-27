"""
Crime Hotspot Detection
"""

from __future__ import annotations

import pandas as pd

from app.geospatial.models import (
    GeoPoint,
    Hotspot,
)


class HotspotDetector:
    """
    Detects geographic crime hotspots.

    Returns lightweight Hotspot objects instead
    of another large DataFrame.
    """

    REQUIRED_COLUMNS = [
        "latitude",
        "longitude",
    ]

    def detect(
        self,
        df: pd.DataFrame,
        threshold: int = 5,
    ) -> list[Hotspot]:

        missing = [
            column
            for column in self.REQUIRED_COLUMNS
            if column not in df.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

        grouped = (
            df.groupby(
                [
                    "latitude",
                    "longitude",
                ]
            )
            .size()
            .reset_index(
                name="crime_count"
            )
        )

        grouped = grouped[
            grouped["crime_count"] >= threshold
        ]

        hotspots: list[Hotspot] = []

        for row in grouped.itertuples(index=False):

            hotspots.append(

                Hotspot(

                    location=GeoPoint(

                        latitude=float(
                            row.latitude
                        ),

                        longitude=float(
                            row.longitude
                        ),

                    ),

                    crime_count=int(
                        row.crime_count
                    ),

                )

            )

        hotspots.sort(
            key=lambda h: h.crime_count,
            reverse=True,
        )

        return hotspots