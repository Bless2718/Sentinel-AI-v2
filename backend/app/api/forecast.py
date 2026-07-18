from fastapi import APIRouter, HTTPException

from app.forecasting.pipeline import ForecastPipeline
from app.storage.dataset_store import DatasetStore

router = APIRouter(
    prefix="/forecast",
    tags=["Forecast"],
)

store = DatasetStore()
pipeline = ForecastPipeline()


def serialize_forecast(result):
    """
    Convert ForecastResult into JSON-safe data.
    """

    return {
        "model_name": result.model_name,
        "predictions": result.predictions.to_dict(
            orient="records"
        ),
        "mae": (
            float(result.mae)
            if result.mae is not None
            else None
        ),
        "rmse": (
            float(result.rmse)
            if result.rmse is not None
            else None
        ),
        "r2_score": (
            float(result.r2_score)
            if result.r2_score is not None
            else None
        ),
    }


@router.post("/{dataset_id}")
async def forecast(dataset_id: str):

    path = store.path(dataset_id)

    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    results = pipeline.run(path)

    return {
        model_name: serialize_forecast(result)
        for model_name, result in results.items()
    }