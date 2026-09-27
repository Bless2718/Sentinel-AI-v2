"""
Sentinel Intelligence Store

Persists compact analytical results as JSON files.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


class IntelligenceStore:

    def __init__(
        self,
        directory: str | Path | None = None,
    ):

        if directory is None:

            backend_root = (
                Path(__file__)
                .resolve()
                .parents[2]
            )

            directory = (
                backend_root
                / "storage"
                / "intelligence"
            )

        self.directory = Path(
            directory
        ).resolve()

        self.directory.mkdir(
            parents=True,
            exist_ok=True,
        )

    def _path(
        self,
        dataset_id: str,
    ) -> Path:

        return (
            self.directory
            / f"{dataset_id}.json"
        )

    def save(
        self,
        dataset_id: str,
        intelligence: dict[str, Any],
    ) -> None:

        path = self._path(
            dataset_id
        )

        with path.open(
            "w",
            encoding="utf-8",
        ) as file:

            json.dump(
                intelligence,
                file,
                ensure_ascii=False,
                indent=2,
            )

    def get(
        self,
        dataset_id: str,
    ) -> dict[str, Any] | None:

        path = self._path(
            dataset_id
        )

        if not path.exists():
            return None

        try:

            with path.open(
                "r",
                encoding="utf-8",
            ) as file:

                return json.load(
                    file
                )

        except (
            json.JSONDecodeError,
            OSError,
        ):

            return None

    def delete(
        self,
        dataset_id: str,
    ) -> None:

        path = self._path(
            dataset_id
        )

        if path.exists():
            path.unlink()

    def exists(
        self,
        dataset_id: str,
    ) -> bool:

        return self._path(
            dataset_id
        ).exists()


intelligence_store = IntelligenceStore()