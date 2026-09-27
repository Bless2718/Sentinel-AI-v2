"""
Sentinel AI Intelligence Context
"""

from __future__ import annotations

from dataclasses import asdict, is_dataclass
from typing import Any


class IntelligenceContextBuilder:
    """
    Converts Sentinel analytical results into
    JSON-compatible AI context.
    """

    def build(
        self,
        *,
        summary: Any = None,
        statistics: Any = None,
        hotspots: list | None = None,
        clusters: list | None = None,
        trends: dict | None = None,
        forecast: dict | None = None,
        risk: dict | None = None,
    ) -> dict[str, Any]:

        context: dict[str, Any] = {}

        if summary is not None:
            context["summary"] = self._convert(summary)

        if statistics is not None:
            context["statistics"] = self._convert(statistics)

        if hotspots is not None:
            context["hotspots"] = self._convert_list(
                hotspots,
                limit=10,
            )

        if clusters is not None:
            context["clusters"] = self._convert_list(
                clusters,
                limit=10,
            )

        if trends is not None:
            context["trends"] = self._convert(trends)

        if forecast is not None:
            context["forecast"] = self._convert(forecast)

        if risk is not None:
            context["risk"] = self._convert(risk)

        return context

    @staticmethod
    def _convert(value: Any) -> Any:

        if is_dataclass(value):
            return asdict(value)

        if isinstance(value, dict):
            return {
                key: IntelligenceContextBuilder._convert(item)
                for key, item in value.items()
            }

        if isinstance(value, list):
            return [
                IntelligenceContextBuilder._convert(item)
                for item in value
            ]

        if isinstance(value, tuple):
            return [
                IntelligenceContextBuilder._convert(item)
                for item in value
            ]

        return value

    @staticmethod
    def _convert_list(
        items: list,
        limit: int = 10,
    ) -> list:

        return [
            IntelligenceContextBuilder._convert(item)
            for item in items[:limit]
        ]