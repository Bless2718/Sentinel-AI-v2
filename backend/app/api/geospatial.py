"""
Geospatial API
"""

from __future__ import annotations

import pandas as pd

from fastapi import APIRouter, HTTPException
from app.dataset.schema_mapper import SchemaMapper
from app.geospatial.geospatial_service import GeospatialService
from app.storage.dataset_store import DatasetStore

router = APIRouter(
    prefix="/geospatial",
    tags=["Geospatial"],
)

store = DatasetStore()
service = GeospatialService()


@router.post("/{dataset_id}")
async def analyze(dataset_id: str):

    path = store.path(dataset_id)

    if path is None or not path.exists():
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    df = pd.read_csv(path)

    mapper = SchemaMapper()

    mapping = mapper.map_columns(df.columns.tolist())

    df = mapper.rename_dataframe(df, mapping)

    result = service.analyze(df)

    return result