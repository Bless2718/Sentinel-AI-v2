"""
Geospatial API
"""

from __future__ import annotations

import pandas as pd

from fastapi import APIRouter, HTTPException

from app.dataset.schema_mapper import SchemaMapper

from app.geospatial.geospatial_service import (
    GeospatialService,
)

from app.storage.dataset_store import (
    DatasetStore,
)

from app.storage.intelligence_store import (
    intelligence_store,
)

from app.trends.preparation import (
    TrendDataPreparer,
)

from app.trends.trend_service import (
    TrendService,
)

from app.trends.intelligence_builder import (
    TrendIntelligenceBuilder,
)


router = APIRouter(
    prefix="/geospatial",
    tags=["Geospatial"],
)


store = DatasetStore()

service = GeospatialService()

mapper = SchemaMapper()

trend_preparer = TrendDataPreparer()

trend_service = TrendService()

trend_builder = TrendIntelligenceBuilder()


@router.post("/{dataset_id}")
async def analyze(
    dataset_id: str,
):

    # -------------------------------------------------
    # Find dataset
    # -------------------------------------------------

    path = store.path(
        dataset_id
    )

    if (
        path is None
        or not path.exists()
    ):

        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    # -------------------------------------------------
    # Load dataset
    # -------------------------------------------------

    df = pd.read_csv(
        path
    )

    # -------------------------------------------------
    # Map uploaded schema to Sentinel schema
    # -------------------------------------------------

    mapping = mapper.map_columns(
        df.columns.tolist()
    )

    df = mapper.rename_dataframe(
        df,
        mapping,
    )

    # -------------------------------------------------
    # Run geospatial analysis
    # -------------------------------------------------

    result = service.analyze(
        df
    )

    # -------------------------------------------------
    # Run historical trend analysis
    # -------------------------------------------------

    trend_data = trend_preparer.prepare(
        df
    )

    trend_result = trend_service.analyze(
        trend_data
    )

    trend_intelligence = (
        trend_builder.build(
            trend_result
        )
    )

    # -------------------------------------------------
    # Add trend intelligence
    # -------------------------------------------------

    result["trend"] = (
        trend_intelligence
    )

    # -------------------------------------------------
    # Store complete intelligence
    # -------------------------------------------------

    intelligence_store.save(
        dataset_id,
        result,
    )

    # -------------------------------------------------
    # Return complete intelligence
    # -------------------------------------------------

    return result