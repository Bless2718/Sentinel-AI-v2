"""Upload files quickly and profile them after the response is sent.

Note: FastAPI BackgroundTasks run in the web process; use a durable queue and
persistent object storage before scaling to multiple instances or handling
uploads that must survive restarts.
"""
import json
import logging
from dataclasses import asdict
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, File, HTTPException, UploadFile
from starlette.concurrency import run_in_threadpool

from app.storage.dataset_store import DatasetStore
from app.dataset.streaming_profile import profile_file
from app.dataset.schema_mapper import SchemaMapper
from app.dataset.validator import DatasetValidator
from app.dataset.quality import QualityAssessment
from app.dataset.readiness import DatasetReadiness

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/upload", tags=["Upload"])
STATUS_DIR = Path("storage/upload_status")
STATUS_DIR.mkdir(parents=True, exist_ok=True)


def _status_path(dataset_id: str) -> Path:
    return STATUS_DIR / f"{dataset_id}.json"


def _set_status(dataset_id: str, data: dict) -> None:
    target = _status_path(dataset_id)
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_suffix(".tmp")
    temporary.write_text(json.dumps(data), encoding="utf-8")
    temporary.replace(target)


def _process(dataset_id: str, path: Path, filename: str) -> None:
    _set_status(dataset_id, {"dataset_id": dataset_id, "status": "processing"})
    try:
        columns, profile = profile_file(path)
        mapper = SchemaMapper()
        mapping = mapper.map_columns(columns)
        # No need to copy/rename the entire dataset to validate column names.
        validation = DatasetValidator().validate(mapping)
        quality = QualityAssessment().assess(profile)
        readiness = DatasetReadiness().assess(validation, quality)
        _set_status(dataset_id, {
            "dataset_id": dataset_id,
            "status": "completed",
            "filename": filename,
            "rows": profile.rows,
            "columns": profile.columns,
            "mapping": mapping,
            "validation": asdict(validation),
            "quality": asdict(quality),
            "readiness": asdict(readiness),
        })
    except Exception:
        logger.exception("Dataset processing failed for %s", dataset_id)
        _set_status(dataset_id, {
            "dataset_id": dataset_id,
            "status": "failed",
            "detail": "Dataset processing failed. Check the file format or contact support.",
        })


@router.post("/", status_code=202)
async def upload_dataset(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    filename = Path(file.filename or "dataset").name
    suffix = Path(filename).suffix.lower()
    if suffix not in {".csv", ".xlsx"}:
        raise HTTPException(status_code=400, detail="Upload a CSV or XLSX dataset.")

    store = DatasetStore()
    # Stream from the multipart spool, without loading the whole upload into memory.
    await file.seek(0)
    dataset_id = await run_in_threadpool(store.save_file, file.file, filename)
    path = store.path(dataset_id)
    _set_status(dataset_id, {"dataset_id": dataset_id, "status": "queued"})
    background_tasks.add_task(_process, dataset_id, path, filename)
    return {"dataset_id": dataset_id, "status": "queued"}


@router.get("/{dataset_id}/status")
def upload_status(dataset_id: str):
    if len(dataset_id) != 32 or not all(c in "0123456789abcdef" for c in dataset_id):
        raise HTTPException(status_code=404, detail="Upload not found.")
    path = _status_path(dataset_id)
    if not path.exists():
        raise HTTPException(status_code=404, detail="Upload status not found.")
    return json.loads(path.read_text(encoding="utf-8"))
