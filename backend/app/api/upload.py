"""
Dataset Upload API
"""

import tempfile
from dataclasses import asdict
from pathlib import Path

from fastapi import APIRouter, File, UploadFile

from app.storage.dataset_store import DatasetStore

from app.dataset.reader import DatasetReader
from app.dataset.profiler import DatasetProfiler
from app.dataset.schema_mapper import SchemaMapper
from app.dataset.validator import DatasetValidator
from app.dataset.quality import QualityAssessment
from app.dataset.readiness import DatasetReadiness

router = APIRouter(
    prefix="/upload",
    tags=["Upload"],
)


@router.post("/")
async def upload_dataset(
    file: UploadFile = File(...),
):
    # Save uploaded file temporarily
    suffix = Path(file.filename).suffix

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix,
    ) as tmp:

        tmp.write(await file.read())
        path = Path(tmp.name)

    # Initialize services
    reader = DatasetReader()
    profiler = DatasetProfiler()
    mapper = SchemaMapper()
    validator = DatasetValidator()
    quality = QualityAssessment()
    readiness = DatasetReadiness()
    store = DatasetStore()

    # Store dataset and generate dataset ID
    dataset_id = store.save(
    path,
    file.filename,
)

    # Read dataset
    df = reader.read(path)

    # Profile dataset
    profile = profiler.profile(df)

    # Map dataset columns
    mapping = mapper.map_columns(
        df.columns.tolist()
    )

    # Rename dataframe to canonical schema
    df = mapper.rename_dataframe(
        df,
        mapping,
    )

    # Validate schema
    validation = validator.validate(
        mapping
    )

    # Assess quality
    quality_report = quality.assess(
        profile
    )

    # Assess readiness
    readiness_report = readiness.assess(
        validation,
        quality_report,
    )

    return {
        "dataset_id": dataset_id,
        "filename": file.filename,
        "rows": profile.rows,
        "columns": profile.columns,
        "mapping": mapping,
        "validation": asdict(validation),
        "quality": asdict(quality_report),
        "readiness": asdict(readiness_report),
    }