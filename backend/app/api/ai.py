"""
Sentinel AI API
"""

from __future__ import annotations

from dataclasses import asdict

import pandas as pd

from fastapi import APIRouter, HTTPException

from app.ai.agent_context import AgentContextBuilder
from app.ai.agent_models import AIChatRequest
from app.ai.agent_service import AIAgentService
from app.dataset.dataset_intelligence import DatasetIntelligence
from app.storage.dataset_store import DatasetStore
from app.storage.intelligence_store import intelligence_store


router = APIRouter(
    prefix="/ai",
    tags=["Sentinel AI"],
)


store = DatasetStore()

agent = AIAgentService()

context_builder = AgentContextBuilder()

dataset_intelligence = DatasetIntelligence()


@router.post("/chat/{dataset_id}")
async def chat(
    dataset_id: str,
    request: AIChatRequest,
):
    """
    Ask Sentinel AI a question about the
    selected dataset and available intelligence.
    """

    # -------------------------------------------------
    # Verify dataset
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
    # Build dataset intelligence
    # -------------------------------------------------

    dataset_context = (
        dataset_intelligence.analyze(
            df
        )
    )

    del df

    # -------------------------------------------------
    # Load persisted Sentinel intelligence
    # -------------------------------------------------

    stored_intelligence = (
        intelligence_store.get(
            dataset_id
        )
    )

    # -------------------------------------------------
    # Extract intelligence sections
    # -------------------------------------------------

    geospatial_context = None
    trend_context = None
    forecast_context = None

    if stored_intelligence is not None:

        geospatial_context = {
            "summary": stored_intelligence.get(
                "summary"
            ),
            "statistics": stored_intelligence.get(
                "statistics"
            ),
            "hotspots": stored_intelligence.get(
                "hotspots"
            ),
            "clusters": stored_intelligence.get(
                "clusters"
            ),
        }

        trend_context = (
            stored_intelligence.get(
                "trends"
            )
            or stored_intelligence.get(
                "trend"
            )
        )

        forecast_context = (
            stored_intelligence.get(
                "forecast"
            )
        )

    # -------------------------------------------------
    # Build unified AI context
    # -------------------------------------------------

    context = context_builder.build(
        dataset=dataset_context,
        geospatial=geospatial_context,
        trends=trend_context,
        forecast=forecast_context,
    )

    # -------------------------------------------------
    # Ask Sentinel AI
    # -------------------------------------------------

    result = agent.chat(
        message=request.message,
        context=context,
    )

    return asdict(
        result
    )