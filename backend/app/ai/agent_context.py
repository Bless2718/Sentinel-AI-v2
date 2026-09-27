"""
Sentinel AI Agent Context
"""

from __future__ import annotations

from typing import Any


class AgentContextBuilder:
    """
    Builds the context supplied to the Sentinel AI Agent.
    """

    def build(
        self,
        *,
        dataset: dict[str, Any] | None = None,
        geospatial: dict[str, Any] | None = None,
        trends: dict[str, Any] | None = None,
        forecast: dict[str, Any] | None = None,
        risk: dict[str, Any] | None = None,
        current_page: str | None = None,
        current_view: str | None = None,
        selected_location: dict[str, Any] | None = None,
    ) -> dict[str, Any]:

        context: dict[str, Any] = {}

        if dataset is not None:
            context["dataset"] = dataset

        if geospatial is not None:
            context["geospatial"] = geospatial

        if trends is not None:
            context["trends"] = trends

        if forecast is not None:
            context["forecast"] = forecast

        if risk is not None:
            context["risk"] = risk

        if current_page is not None:
            context["current_page"] = current_page

        if current_view is not None:
            context["current_view"] = current_view

        if selected_location is not None:
            context["selected_location"] = (
                selected_location
            )

        return context