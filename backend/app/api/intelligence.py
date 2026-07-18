from dataclasses import asdict

from fastapi import APIRouter, HTTPException

from app.forecasting.pipeline import ForecastPipeline
from app.intelligence.intelligence import IntelligenceService
from app.risk.risk import RiskAssessmentService
from app.storage.dataset_store import DatasetStore

router = APIRouter(
    prefix="/intelligence",
    tags=["Intelligence"],
)

store = DatasetStore()
pipeline = ForecastPipeline()
risk_service = RiskAssessmentService()
intelligence_service = IntelligenceService()


@router.post("/{dataset_id}")
async def generate_intelligence(dataset_id: str):

    path = store.path(dataset_id)

    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    forecasts = pipeline.run(path)

    response = {}

    for model_name, forecast in forecasts.items():

        predictions = (
            forecast.predictions["prediction"]
            .astype(float)
            .tolist()
        )

        highest_prediction = max(predictions)

        risk = risk_service.assess(
            highest_prediction,
            predictions,
        )

        intelligence = intelligence_service.generate(
            predictions,
            risk.risk_level,
        )

        response[model_name] = {
            "model_name": forecast.model_name,
            "forecast": forecast.predictions.to_dict(
                orient="records"
            ),
            "risk": asdict(risk),
            "intelligence": asdict(intelligence),
        }

    return response