"""
Geospatial Service

Coordinates the complete geospatial analysis pipeline
and AI intelligence generation.
"""

from __future__ import annotations

from dataclasses import asdict, is_dataclass

import pandas as pd

from app.ai.ai_service import AIService
from app.ai.intelligence_context import (
    IntelligenceContextBuilder,
)

from app.geospatial.clustering import SpatialClusterer
from app.geospatial.geojson import GeoJSONGenerator
from app.geospatial.heatmap import HeatmapGenerator
from app.geospatial.hotspot import HotspotDetector
from app.geospatial.response_builder import (
    GeospatialResponseBuilder,
)
from app.geospatial.risk import GeographicRiskAssessor
from app.geospatial.serializer import GeospatialSerializer
from app.geospatial.statistics import GeospatialStatistics
from app.geospatial.summary import GeospatialSummary
from app.geospatial.density import CrimeDensityAnalyzer


class GeospatialService:
    """
    Main orchestration layer.

    Executes geospatial analysis and then generates
    AI intelligence from the compact analytical results.
    """

    def __init__(self):

        self.clusterer = SpatialClusterer()

        self.hotspots = HotspotDetector()

        self.density = CrimeDensityAnalyzer()

        self.risk = GeographicRiskAssessor()

        self.heatmap = HeatmapGenerator()

        self.geojson = GeoJSONGenerator()

        self.summary = GeospatialSummary()

        self.statistics = GeospatialStatistics()

        self.builder = GeospatialResponseBuilder()

        self.serializer = GeospatialSerializer()

        self.ai_context = IntelligenceContextBuilder()

        self.ai = AIService()

    def analyze(
        self,
        df: pd.DataFrame,
    ) -> dict:

        # -------------------------------------------------
        # 1. Spatial clustering
        # -------------------------------------------------

        clustered = self.clusterer.cluster(df)

        del df

        # -------------------------------------------------
        # 2. Hotspot detection
        # -------------------------------------------------

        hotspots = self.hotspots.detect(
            clustered
        )

        # -------------------------------------------------
        # 3. Density analysis
        # -------------------------------------------------

        clusters = self.density.analyze(
            clustered
        )

        # -------------------------------------------------
        # 4. Heatmap generation
        # -------------------------------------------------

        heatmap = self.heatmap.generate(
            clustered
        )

        # -------------------------------------------------
        # 5. Release large dataframe
        # -------------------------------------------------

        del clustered

        # -------------------------------------------------
        # 6. Risk assessment
        # -------------------------------------------------

        clusters = self.risk.assess(
            clusters
        )

        # -------------------------------------------------
        # 7. GeoJSON generation
        # -------------------------------------------------

        geojson = self.geojson.generate(
            heatmap
        )

        # -------------------------------------------------
        # 8. Dashboard summary
        # -------------------------------------------------

        summary = self.summary.generate(
            hotspots,
            clusters,
            heatmap,
        )

        # -------------------------------------------------
        # 9. Detailed statistics
        # -------------------------------------------------

        statistics = self.statistics.generate(
            clusters,
        )

        # -------------------------------------------------
        # 10. Build geospatial intelligence
        # -------------------------------------------------

        intelligence = self.builder.build(
            summary=summary,
            statistics=statistics,
            hotspots=hotspots,
            clusters=clusters,
            heatmap=heatmap,
            geojson=geojson,
        )

        # -------------------------------------------------
        # 11. Build compact AI context
        # -------------------------------------------------

        ai_context = self.ai_context.build(
            summary=intelligence.summary,
            statistics=intelligence.statistics,
            hotspots=intelligence.hotspots,
            clusters=intelligence.clusters,
        )

        # -------------------------------------------------
        # 12. Generate AI intelligence
        # -------------------------------------------------

        ai_result = self.ai.generate_executive_summary(
            ai_context
        )

        # -------------------------------------------------
        # 13. Serialize geospatial intelligence
        # -------------------------------------------------

        response = self.serializer.serialize(
            intelligence
        )

        # -------------------------------------------------
        # 14. Add AI intelligence
        # -------------------------------------------------

        if hasattr(
            ai_result,
            "model_dump",
        ):

            response["ai"] = (
                ai_result.model_dump()
            )

        elif hasattr(
            ai_result,
            "dict",
        ):

            response["ai"] = (
                ai_result.dict()
            )

        elif is_dataclass(
            ai_result
        ):

            response["ai"] = asdict(
                ai_result
            )

        else:

            response["ai"] = ai_result

        return response