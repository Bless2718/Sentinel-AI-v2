"""
Forecast API
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.forecasting.pipeline import ForecastPipeline
from app.forecasting.intelligence_builder import (
    ForecastIntelligenceBuilder,
)
from app.storage.dataset_store import DatasetStore
from app.storage.intelligence_store import (
    intelligence_store,
)


router = APIRouter(
    prefix="/forecast",
    tags=["Forecast"],
)


store = DatasetStore()

pipeline = ForecastPipeline()

intelligence_builder = ForecastIntelligenceBuilder()


@router.post("/{dataset_id}")
async def forecast(
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
    # Run forecasting
    # -------------------------------------------------

    results = pipeline.run(
        path,
        periods=12,
    )

    # -------------------------------------------------
    # Build compact forecast intelligence
    # -------------------------------------------------

    forecast_intelligence = (
        intelligence_builder.build(
            results
        )
    )

    # -------------------------------------------------
    # Load existing intelligence
    # -------------------------------------------------

    existing = intelligence_store.get(
        dataset_id
    )

    if existing is None:
        existing = {}

    # -------------------------------------------------
    # Add forecast intelligence
    # -------------------------------------------------

    existing["forecast"] = (
        forecast_intelligence
    )

    # -------------------------------------------------
    # Persist intelligence
    # -------------------------------------------------

    intelligence_store.save(
        dataset_id,
        existing,
    )

    # -------------------------------------------------
    # Return forecast intelligence
    # -------------------------------------------------

    return forecast_intelligence