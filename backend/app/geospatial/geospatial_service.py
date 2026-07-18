"""
Geospatial Intelligence Service
"""

import pandas as pd

from app.geospatial.hotspot import HotspotDetector
from app.geospatial.clustering import SpatialClusterer
from app.geospatial.density import CrimeDensityAnalyzer
from app.geospatial.risk import GeographicRiskAssessor
from app.geospatial.heatmap import HeatmapGenerator


class GeospatialService:
    """
    Executes the complete geospatial pipeline.
    """

    def __init__(self):

        self.hotspots = HotspotDetector()

        self.clusterer = SpatialClusterer()

        self.density = CrimeDensityAnalyzer()

        self.risk = GeographicRiskAssessor()

        self.heatmap = HeatmapGenerator()

    def analyze(
        self,
        df: pd.DataFrame,
    ) -> dict[str, pd.DataFrame]:

        hotspots = self.hotspots.detect(df)

        clustered = self.clusterer.cluster(df)

        density = self.density.analyze(clustered)

        risk = self.risk.assess(density)

        heatmap = self.heatmap.generate(
            clustered.merge(
                risk[
                    [
                        "cluster",
                        "risk_score",
                    ]
                ],
                on="cluster",
                how="left",
            )
        )

        return {
            "hotspots": hotspots,
            "clusters": clustered,
            "density": density,
            "risk": risk,
            "heatmap": heatmap,
        }