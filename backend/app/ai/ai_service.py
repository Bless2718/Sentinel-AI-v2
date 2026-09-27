"""
Sentinel AI Service
"""

from __future__ import annotations

import re

from app.ai.gemini_client import GeminiClient
from app.ai.models import AIInsight
from app.ai.prompts import executive_summary_prompt


class AIService:
    """
    Generates AI-powered crime intelligence
    from structured analytical context.
    """

    def __init__(self):

        self.client = GeminiClient()

    def generate_executive_summary(
        self,
        context: dict,
    ) -> AIInsight:

        prompt = executive_summary_prompt(
            context
        )

        response = self.client.generate(
            prompt
        )

        return self._parse_response(
            response
        )

    @staticmethod
    def _parse_response(
        response: str,
    ) -> AIInsight:

        lines = [
            line.strip()
            for line in response.splitlines()
        ]

        title = ""
        summary = ""
        findings: list[str] = []
        recommendations: list[str] = []
        confidence = 0.0

        section = None

        index = 0

        while index < len(lines):

            line = lines[index]

            if not line:
                index += 1
                continue

            upper = line.upper()

            # -----------------------------------------
            # TITLE
            # -----------------------------------------

            if upper.startswith("TITLE:"):

                value = line.split(
                    ":",
                    1,
                )[1].strip()

                title = value

                # Handle:
                #
                # TITLE:
                # Some title
                #
                if not title and index + 1 < len(lines):

                    next_line = lines[index + 1].strip()

                    if (
                        next_line
                        and not next_line.upper().startswith(
                            (
                                "SUMMARY:",
                                "KEY_FINDINGS:",
                                "RECOMMENDATIONS:",
                                "CONFIDENCE:",
                            )
                        )
                    ):

                        title = next_line

                        index += 1

                section = "title"

                index += 1

                continue

            # -----------------------------------------
            # SUMMARY
            # -----------------------------------------

            if upper.startswith("SUMMARY:"):

                value = line.split(
                    ":",
                    1,
                )[1].strip()

                summary = value

                section = "summary"

                index += 1

                continue

            # -----------------------------------------
            # KEY FINDINGS
            # -----------------------------------------

            if (
                upper.startswith("KEY_FINDINGS:")
                or upper.startswith("KEY FINDINGS:")
            ):

                section = "findings"

                index += 1

                continue

            # -----------------------------------------
            # RECOMMENDATIONS
            # -----------------------------------------

            if upper.startswith(
                "RECOMMENDATIONS:"
            ):

                section = "recommendations"

                index += 1

                continue

            # -----------------------------------------
            # CONFIDENCE
            # -----------------------------------------

            if upper.startswith("CONFIDENCE:"):

                value = line.split(
                    ":",
                    1,
                )[1].strip()

                parsed = AIService._extract_confidence(
                    value
                )

                if parsed is not None:

                    confidence = parsed

                elif index + 1 < len(lines):

                    next_line = lines[
                        index + 1
                    ].strip()

                    parsed = AIService._extract_confidence(
                        next_line
                    )

                    if parsed is not None:

                        confidence = parsed

                        index += 1

                section = "confidence"

                index += 1

                continue

            # -----------------------------------------
            # CONTENT
            # -----------------------------------------

            if section == "summary":

                if summary:

                    summary += " "

                summary += line

            elif section == "findings":

                if line.startswith("-"):

                    finding = line[1:].strip()

                    if finding:

                        findings.append(
                            finding
                        )

            elif section == "recommendations":

                if line.startswith("-"):

                    recommendation = (
                        line[1:].strip()
                    )

                    if recommendation:

                        recommendations.append(
                            recommendation
                        )

            index += 1

        # ---------------------------------------------
        # Safety normalization
        # ---------------------------------------------

        confidence = max(
            0.0,
            min(
                1.0,
                confidence,
            ),
        )

        if not title:

            title = (
                "Crime Intelligence Analysis"
            )

        if not summary:

            summary = (
                "The available crime intelligence "
                "was analyzed using the provided "
                "geospatial data."
            )

        return AIInsight(
            title=title,
            summary=summary,
            key_findings=findings,
            recommendations=recommendations,
            confidence=confidence,
        )

    @staticmethod
    def _extract_confidence(
        value: str,
    ) -> float | None:

        if not value:
            return None

        match = re.search(
            r"\b(?:0(?:\.\d+)?|1(?:\.0+)?)\b",
            value,
        )

        if not match:
            return None

        try:

            number = float(
                match.group(0)
            )

        except ValueError:

            return None

        if 0.0 <= number <= 1.0:

            return number

        return None