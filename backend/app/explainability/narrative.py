"""
Narrative Generator
"""


class NarrativeGenerator:
    """
    Generates human-readable explanations
    for model predictions.
    """

    def generate(
        self,
        prediction: float,
        confidence: float,
        explanation: dict,
    ) -> str:

        features = ", ".join(
            explanation["top_features"]
        )

        confidence_percent = round(
            confidence * 100,
            1,
        )

        return (
            f"Sentinel AI forecasts approximately "
            f"{prediction:.1f} crimes. "
            f"The model confidence is "
            f"{confidence_percent}%. "
            f"The most influential factors are "
            f"{features}."
        )