"""
Sentinel Intelligence API

Orchestrates dataset, preprocessing, geospatial, trend,
forecast, risk, and intelligence analysis.
"""

from __future__ import annotations

from dataclasses import asdict

from fastapi import APIRouter, HTTPException, Query

from app.dataset.reader import DatasetReader
from app.dataset.dataset_intelligence import DatasetIntelligence
from app.dataset.preprocessing import DatasetPreprocessor

from app.forecasting.intelligence_builder import (
    ForecastIntelligenceBuilder,
)
from app.forecasting.pipeline import ForecastPipeline

from app.geospatial.geospatial_service import (
    GeospatialService,
)

from app.intelligence.intelligence import (
    IntelligenceService,
)

from app.risk.risk import RiskAssessmentService
from app.risk.risk_level import RiskLevel

from app.storage.dataset_store import DatasetStore
from app.storage.intelligence_store import (
    intelligence_store,
)

from app.trends.intelligence_builder import (
    TrendIntelligenceBuilder,
)
from app.trends.preparation import TrendDataPreparer
from app.trends.trend_service import TrendService


reader = DatasetReader()

preprocessor = DatasetPreprocessor()

router = APIRouter(
    prefix="/intelligence",
    tags=["Intelligence"],
)

store = DatasetStore()

dataset_intelligence = DatasetIntelligence()

geospatial_service = GeospatialService()

trend_preparer = TrendDataPreparer()
trend_service = TrendService()
trend_builder = TrendIntelligenceBuilder()

forecast_pipeline = ForecastPipeline()
forecast_builder = ForecastIntelligenceBuilder()

risk_service = RiskAssessmentService()

intelligence_service = IntelligenceService()


# Supported monthly forecasting horizons.
SUPPORTED_FORECAST_PERIODS = {
    1,
    3,
    6,
    12,
    24,
    36,
}


@router.post("/{dataset_id}")
async def generate_intelligence(
    dataset_id: str,
    periods: int = Query(
        default=12,
        ge=1,
        le=36,
        description=(
            "Number of future monthly periods to forecast. "
            "Supported values: 1, 3, 6, 12, 24, 36."
        ),
    ),
):
    """
    Generate the complete Sentinel intelligence
    package for a dataset.

    Forecast horizons are monthly:

        1  = 1 month
        3  = 3 months
        6  = 6 months
        12 = 1 year
        24 = 2 years
        36 = 3 years
    """

    # -------------------------------------------------
    # 0. Validate forecast horizon
    # -------------------------------------------------

    if periods not in SUPPORTED_FORECAST_PERIODS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid forecast period. "
                "Supported values are: "
                "1, 3, 6, 12, 24, 36 months."
            ),
        )

    # -------------------------------------------------
    # 1. Verify dataset
    # -------------------------------------------------

    path = store.path(dataset_id)

    if (
        path is None
        or not path.exists()
    ):
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    # -------------------------------------------------
    # 2. Load original dataset
    # -------------------------------------------------

    raw_df = reader.read(path)

    # -------------------------------------------------
    # 3. Preprocess dataset
    #
    # IMPORTANT:
    # The original uploaded file is never modified.
    # Preprocessing happens in memory.
    # -------------------------------------------------

    preprocessing_result = (
        preprocessor.prepare(
            raw_df
        )
    )

    df = preprocessing_result.data

    # Release raw dataframe.
    del raw_df

    # -------------------------------------------------
    # 4. Dataset intelligence
    # -------------------------------------------------

    dataset_context = (
        dataset_intelligence.analyze(
            df
        )
    )

    # -------------------------------------------------
    # 5. Geospatial intelligence
    # -------------------------------------------------

    geospatial_result = (
        geospatial_service.analyze(
            df.copy()
        )
    )

    # -------------------------------------------------
    # 6. Trend intelligence
    # -------------------------------------------------

    trend_data = trend_preparer.prepare(
        df.copy()
    )

    trend_result = trend_service.analyze(
        trend_data
    )

    trend_context = trend_builder.build(
        trend_result
    )

    del trend_data
    del trend_result

    # -------------------------------------------------
    # 7. Forecast intelligence
    # -------------------------------------------------

    forecast_results = (
        forecast_pipeline.run(
            path,
            periods=periods,
        )
    )

    forecast_context = (
        forecast_builder.build(
            forecast_results
        )
    )

    # -------------------------------------------------
    # 8. Risk intelligence
    # -------------------------------------------------

    risk_context = None

    best_forecast = (
        forecast_context.get(
            "best_forecast"
        )
    )

    if best_forecast:

        predictions = [
            float(item["prediction"])
            for item in best_forecast.get(
                "predictions",
                []
            )
        ]

        if predictions:

            highest_prediction = max(
                predictions
            )

            risk = risk_service.assess(
                prediction=highest_prediction,
                all_predictions=predictions,
                model_confidence=(
                    best_forecast.get(
                        "confidence"
                    )
                    or 0.0
                ),
            )

            risk_context = asdict(
                risk
            )

            risk_context["risk_level"] = (
                risk.risk_level.value
            )

    # -------------------------------------------------
    # 9. Forecast explanation
    # -------------------------------------------------

    explanation_context = None

    if best_forecast:

        predictions = [
            float(item["prediction"])
            for item in best_forecast.get(
                "predictions",
                []
            )
        ]

        if predictions:

            risk_level = (
                risk_context.get(
                    "risk_level"
                )
                if risk_context
                else "LOW"
            )

            try:
                level = RiskLevel(
                    risk_level
                )
            except ValueError:
                level = RiskLevel.LOW

            intelligence = (
                intelligence_service.generate(
                    predictions=predictions,
                    risk_level=level,
                )
            )

            explanation_context = asdict(
                intelligence
            )

            explanation_context["trend"] = (
                intelligence.trend.value
            )

    # -------------------------------------------------
    # 10. Preprocessing information
    # -------------------------------------------------

    preprocessing_context = {
        "rows_before": (
            preprocessing_result.rows_before
        ),
        "rows_after": (
            preprocessing_result.rows_after
        ),
        "rows_removed": (
            preprocessing_result.rows_before
            - preprocessing_result.rows_after
        ),
        "mapping": (
            preprocessing_result.mapping
        ),
        "warnings": (
            preprocessing_result.warnings
        ),
    }

    # -------------------------------------------------
    # 11. Build unified intelligence
    # -------------------------------------------------

    unified = {
        "dataset": dataset_context,

        "preprocessing": (
            preprocessing_context
        ),

        "geospatial": geospatial_result,

        "trends": trend_context,

        "forecast": forecast_context,

        "risk": risk_context,

        "intelligence": explanation_context,

        # Record the requested forecast horizon
        # so the frontend knows which horizon was used.
        "forecast_periods": periods,
    }

    # -------------------------------------------------
    # 12. Preserve previous intelligence
    # -------------------------------------------------

    existing = intelligence_store.get(
        dataset_id
    )

    if existing:
        previous = dict(existing)
        previous.pop("previous", None)
        unified["previous"] = previous

    # -------------------------------------------------
    # 13. Persist complete intelligence
    # -------------------------------------------------

    intelligence_store.save(
        dataset_id,
        unified,
    )

    # -------------------------------------------------
    # 14. Return complete intelligence
    # -------------------------------------------------

    return unified