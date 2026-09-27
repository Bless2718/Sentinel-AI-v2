"""
Forecast Intelligence Builder
"""

from __future__ import annotations

from typing import Any

import pandas as pd

from app.forecasting.forecast_result import ForecastResult
from app.forecasting.selector import ForecastSelector
from app.intelligence.trend_detector import TrendDetector


class ForecastIntelligenceBuilder:
    """
    Converts forecast model results into compact,
    JSON-compatible intelligence for Sentinel AI.
    """

    def __init__(self):

        self.selector = ForecastSelector()

        self.trend_detector = TrendDetector()

    def build(
        self,
        results: dict[str, ForecastResult],
    ) -> dict[str, Any]:

        if not results:

            return {
                "models": {},
                "best_model": None,
                "best_forecast": None,
                "comparison": [],
            }

        comparison = self._build_comparison(
            results
        )

        best_model = self.selector.select(
            comparison,
            metric="mae",
        )

        best_result = results.get(
            best_model
        )

        models = {}

        for name, result in results.items():

            models[name] = {
                "model_name": result.model_name,
                "mae": self._number(result.mae),
                "rmse": self._number(result.rmse),
                "r2_score": self._number(
                    result.r2_score
                ),
                "confidence": self._number(
                    result.confidence
                ),
                "predictions": (
                    self._serialize_predictions(
                        result.predictions
                    )
                ),
            }

        best_forecast = None

        if best_result is not None:

            predictions = (
                best_result.predictions[
                    "prediction"
                ]
                .astype(float)
                .tolist()
            )

            trend = self.trend_detector.detect(
                predictions
            )

            best_forecast = {
                "model_name": best_result.model_name,
                "trend": trend.value,
                "mae": self._number(
                    best_result.mae
                ),
                "rmse": self._number(
                    best_result.rmse
                ),
                "r2_score": self._number(
                    best_result.r2_score
                ),
                "confidence": self._number(
                    best_result.confidence
                ),
                "predictions": (
                    self._serialize_predictions(
                        best_result.predictions
                    )
                ),
            }

        return {
            "models": models,
            "best_model": best_model,
            "best_forecast": best_forecast,
            "comparison": comparison.to_dict(
                orient="records"
            ),
        }

    @staticmethod
    def _build_comparison(
        results: dict[str, ForecastResult],
    ) -> pd.DataFrame:

        rows = []

        for name, result in results.items():

            rows.append(
                {
                    "model": name,
                    "mae": result.mae,
                    "rmse": result.rmse,
                    "r2_score": result.r2_score,
                    "confidence": result.confidence,
                }
            )

        return pd.DataFrame(rows)

    @staticmethod
    def _serialize_predictions(
        predictions: pd.DataFrame,
    ) -> list[dict[str, Any]]:

        result = predictions.copy()

        if (
            "year" in result.columns
            and "month" in result.columns
        ):

            result["period"] = result.apply(
                lambda row: (
                    f"{int(row['year']):04d}-"
                    f"{int(row['month']):02d}"
                ),
                axis=1,
            )

            result = result[
                [
                    "period",
                    "prediction",
                ]
            ]

        return result.to_dict(
            orient="records"
        )

    @staticmethod
    def _number(
        value: float | None,
    ) -> float | None:

        if value is None:
            return None

        return float(value)