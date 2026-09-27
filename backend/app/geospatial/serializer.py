"""
Geospatial Serializer
"""

from __future__ import annotations

from dataclasses import asdict, is_dataclass
from math import isfinite
from typing import Any

from app.geospatial.models import GeospatialIntelligence


class GeospatialSerializer:
    """
    Converts a GeospatialIntelligence object into a
    JSON-safe dictionary.
    """

    def serialize(
        self,
        intelligence: GeospatialIntelligence,
    ) -> dict:

        return self._clean(
            asdict(intelligence)
        )

    def _clean(
        self,
        value: Any,
    ) -> Any:

        if is_dataclass(value):
            value = asdict(value)

        if isinstance(value, dict):
            return {
                k: self._clean(v)
                for k, v in value.items()
            }

        if isinstance(value, list):
            return [
                self._clean(v)
                for v in value
            ]

        if isinstance(value, tuple):
            return tuple(
                self._clean(v)
                for v in value
            )

        if isinstance(value, float):

            if not isfinite(value):
                return None

            return round(value, 6)

        return value