"""
Dataset Storage
"""

import json
import shutil
from datetime import datetime
from pathlib import Path
from uuid import uuid4
from datetime import datetime, UTC

class DatasetStore:
    """
    Stores uploaded datasets and keeps a registry.
    """

    STORAGE_DIR = Path("storage")

    REGISTRY = STORAGE_DIR / "datasets.json"

    def __init__(self):

        self.STORAGE_DIR.mkdir(exist_ok=True)

        if not self.REGISTRY.exists():

            self.REGISTRY.write_text(
                "{}",
                encoding="utf-8",
            )

    def save(
        self,
        source: Path,
        original_filename: str,
    ) -> str:

        dataset_id = uuid4().hex

        destination = (
            self.STORAGE_DIR
            / f"{dataset_id}{source.suffix}"
        )

        shutil.copy2(
            source,
            destination,
        )

        registry = self._load()

        registry[dataset_id] = {
            "filename": original_filename,
            "path": str(destination),
            "uploaded_at": datetime.now(UTC).isoformat(),
        }

        self._save(registry)

        return dataset_id

    def path(
        self,
        dataset_id: str,
    ) -> Path | None:

        registry = self._load()

        info = registry.get(dataset_id)

        if info is None:
            return None

        return Path(info["path"])

    def info(
        self,
        dataset_id: str,
    ) -> dict | None:

        registry = self._load()

        return registry.get(dataset_id)

    def _load(self):

        with open(
            self.REGISTRY,
            "r",
            encoding="utf-8",
        ) as f:

            return json.load(f)

    def _save(
        self,
        registry,
    ):

        with open(
            self.REGISTRY,
            "w",
            encoding="utf-8",
        ) as f:

            json.dump(
                registry,
                f,
                indent=4,
            )