"""
Geospatial Intelligence Service
"""

from __future__ import annotations

import pandas as pd

from app.geospatial.hotspot import HotspotDetector
from app.geospatial.clustering import SpatialClusterer
from app.geospatial.density import CrimeDensityAnalyzer
from app.geospatial.risk import GeographicRiskAssessor
from app.geospatial.heatmap import HeatmapGenerator
from app.geospatial.summary import GeospatialSummary
from app.geospatial.statistics import GeospatialStatistics
from app.geospatial.serializer import GeospatialSerializer
from app.geospatial.geojson import GeoJSONGenerator


class GeospatialService:
    """
    Executes the complete geospatial intelligence pipeline.
    """

    def __init__(self):

        self.hotspots = HotspotDetector()

        self.clusterer = SpatialClusterer()

        self.density = CrimeDensityAnalyzer()

        self.risk = GeographicRiskAssessor()

        self.heatmap = HeatmapGenerator()

        self.summary = GeospatialSummary()

        self.statistics = GeospatialStatistics()

        self.serializer = GeospatialSerializer()

        self.geojson = GeoJSONGenerator()

    def analyze(
        self,
        df: pd.DataFrame,
    ) -> dict:

        # Detect hotspot locations
        hotspots = self.hotspots.detect(df)

        # Perform spatial clustering
        clustered = self.clusterer.cluster(df)

        # Analyze cluster density
        density = self.density.analyze(clustered)

        # Calculate geographic risk
        risk = self.risk.assess(density)

        # Merge risk scores back into clustered data
        clustered_with_risk = clustered.merge(
            risk[
                [
                    "cluster",
                    "risk_score",
                ]
            ],
            on="cluster",
            how="left",
        )

        # Generate heatmap data
        heatmap = self.heatmap.generate(
            clustered_with_risk
        )

        # Generate dashboard summary
        summary = self.summary.generate(
            hotspots=hotspots,
            clusters=clustered,
            density=density,
            risk=risk,
            heatmap=heatmap,
        )

        # Generate detailed statistics
        statistics = self.statistics.generate(
            clusters=clustered,
            risk=risk,
        )

        # Generate GeoJSON for mapping frameworks
        geojson = self.geojson.generate(
            clustered_with_risk
        )

        # Return serialized API-ready response
        return self.serializer.serialize(
            summary=summary,
            statistics=statistics,
            hotspots=hotspots,
            clusters=clustered,
            density=density,
            risk=risk,
            heatmap=heatmap,
            geojson=geojson,
        )