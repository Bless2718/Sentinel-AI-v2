"""
Explainability Service
"""

import pandas as pd

from app.explainability.feature_importance import FeatureImportance
from app.explainability.explanation import PredictionExplainer
from app.explainability.confidence import ConfidenceScorer
from app.explainability.narrative import NarrativeGenerator


class ExplainabilityService:
    """
    Executes the complete explainability pipeline.
    """

    def __init__(self):

        self.importance = FeatureImportance()

        self.explainer = PredictionExplainer()

        self.confidence = ConfidenceScorer()

        self.narrative = NarrativeGenerator()

    def explain(
        self,
        prediction: float,
        predictions: pd.Series,
        feature_names: list[str],
        importances: list[float],
    ) -> dict:

        importance = self.importance.calculate(
            feature_names,
            importances,
        )

        explanation = self.explainer.explain(
            importance
        )

        confidence = self.confidence.score(
            predictions
        )

        narrative = self.narrative.generate(
            prediction=prediction,
            confidence=confidence,
            explanation=explanation,
        )

        return {
            "importance": importance,
            "explanation": explanation,
            "confidence": confidence,
            "narrative": narrative,
        }