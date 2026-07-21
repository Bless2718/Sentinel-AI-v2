from dataclasses import asdict

from fastapi import APIRouter, HTTPException

from app.forecasting.pipeline import ForecastPipeline
from app.risk.risk import RiskAssessmentService
from app.storage.dataset_store import DatasetStore

router = APIRouter(
    prefix="/risk",
    tags=["Risk"],
)

store = DatasetStore()
pipeline = ForecastPipeline()
risk_service = RiskAssessmentService()


@router.post("/{dataset_id}")
async def assess_risk(dataset_id: str):

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

        assessments = [
            asdict(
                risk_service.assess(
                    prediction,
                    predictions,
                    forecast.confidence,
                )
            )
            for prediction in predictions
        ]

        response[model_name] = {
            "model_name": forecast.model_name,
            "forecast": forecast.predictions.to_dict(
                orient="records"
            ),
            "risk": assessments,
        }

    return response