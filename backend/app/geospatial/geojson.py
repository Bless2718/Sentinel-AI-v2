"""
GeoJSON Generator
"""

from __future__ import annotations

import pandas as pd


class GeoJSONGenerator:
    """
    Converts geospatial analysis results into
    GeoJSON FeatureCollections.
    """

    @staticmethod
    def _feature(row: pd.Series, properties: list[str]) -> dict:

        return {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    float(row["longitude"]),
                    float(row["latitude"]),
                ],
            },
            "properties": {
                key: row[key]
                for key in properties
                if key in row.index
            },
        }

    def generate(
        self,
        df: pd.DataFrame,
        properties: list[str] | None = None,
    ) -> dict:

        if df.empty:
            return {
                "type": "FeatureCollection",
                "features": [],
            }

        if (
            "latitude" not in df.columns
            or
            "longitude" not in df.columns
        ):
            raise ValueError(
                "latitude and longitude columns are required."
            )

        if properties is None:

            properties = [
                col
                for col in df.columns
                if col not in (
                    "latitude",
                    "longitude",
                )
            ]

        features = []

        for _, row in df.iterrows():

            features.append(
                self._feature(
                    row,
                    properties,
                )
            )

        return {
            "type": "FeatureCollection",
            "features": features,
        }