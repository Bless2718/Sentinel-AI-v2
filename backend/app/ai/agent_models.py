"""
Sentinel AI Agent Models
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class AIChatRequest:
    """
    User message sent to Sentinel AI.
    """

    message: str


@dataclass
class AIChatResponse:
    """
    Response returned by Sentinel AI Agent.
    """

    answer: str

    confidence: float = 0.0

    sources: list[str] = field(
        default_factory=list
    )