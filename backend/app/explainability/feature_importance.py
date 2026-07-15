"""
Feature Importance
"""

import pandas as pd


class FeatureImportance:

    def calculate(
        self,
        feature_names: list[str],
        importances: list[float],
    ) -> pd.DataFrame:

        if len(feature_names) != len(importances):
            raise ValueError(
                "Feature names and importances must have equal length."
            )

        result = pd.DataFrame(
            {
                "feature": feature_names,
                "importance": importances,
            }
        )

        return result.sort_values(
            by="importance",
            ascending=False,
        ).reset_index(drop=True)