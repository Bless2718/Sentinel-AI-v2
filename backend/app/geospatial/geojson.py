"""
GeoJSON Generator
"""

from __future__ import annotations

from app.geospatial.models import HeatmapPoint


class GeoJSONGenerator:
    """
    Converts HeatmapPoint objects into
    GeoJSON FeatureCollection.
    """

    def generate(
        self,
        heatmap: list[HeatmapPoint],
    ) -> dict:

        features = []

        for point in heatmap:

            features.append(

                {
                    "type": "Feature",

                    "geometry": {

                        "type": "Point",

                        "coordinates": [

                            point.location.longitude,

                            point.location.latitude,

                        ],

                    },

                    "properties": {

                        "crime_count": point.crime_count,

                        "weight": round(
                            point.weight,
                            4,
                        ),

                        "average_risk": round(
                            point.average_risk,
                            4,
                        ),

                    },

                }

            )

        return {

            "type": "FeatureCollection",

            "features": features,

        }