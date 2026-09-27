from __future__ import annotations

from pydantic import BaseModel, Field


class AIInsight(BaseModel):

    title: str

    summary: str

    key_findings: list[str] = Field(
        default_factory=list
    )

    recommendations: list[str] = Field(
        default_factory=list
    )

    confidence: float = 0.0


class AIRequest(BaseModel):

    context: dict


class AIResponse(BaseModel):

    success: bool

    insight: AIInsight | None = None

    error: str | None = None