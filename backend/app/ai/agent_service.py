"""
Sentinel AI Agent Service
"""

from __future__ import annotations

from app.ai.agent_prompt import agent_prompt
from app.ai.gemini_client import GeminiClient
from app.ai.agent_models import AIChatResponse


class AIAgentService:
    """
    Platform-wide Sentinel AI conversational agent.
    """

    def __init__(self):

        self.client = GeminiClient()

    def chat(
        self,
        message: str,
        context: dict,
    ) -> AIChatResponse:

        message = message.strip()

        if not message:

            return AIChatResponse(
                answer=(
                    "Please enter a question "
                    "about your dataset or "
                    "Sentinel analysis."
                ),
                confidence=0.0,
                sources=[],
            )

        prompt = agent_prompt(
            message,
            context,
        )

        response = self.client.generate(
            prompt
        )

        return AIChatResponse(
            answer=response.strip(),
            confidence=0.95,
            sources=self._detect_sources(
                context
            ),
        )

    @staticmethod
    def _detect_sources(
        context: dict,
    ) -> list[str]:

        sources = []

        if "dataset" in context:
            sources.append("dataset")

        if "geospatial" in context:
            sources.append("geospatial")

        if "trends" in context:
            sources.append("trends")

        if "forecast" in context:
            sources.append("forecast")

        if "risk" in context:
            sources.append("risk")

        return sources