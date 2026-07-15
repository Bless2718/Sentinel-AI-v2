"""
Feature Engineering Pipeline

Executes all feature engineering modules
in the correct order.
"""

import pandas as pd

from app.feature_engineering.temporal import (
    TemporalFeatureEngineer,
)
from app.feature_engineering.spatial import (
    SpatialFeatureEngineer,
)
from app.feature_engineering.categorical import (
    CategoricalFeatureEngineer,
)


class FeatureEngineeringPipeline:
    """
    Executes all feature engineering steps.
    """

    def __init__(self):

        self.temporal = TemporalFeatureEngineer()

        self.spatial = SpatialFeatureEngineer()

        self.categorical = CategoricalFeatureEngineer()

    def transform(
        self,
        df: pd.DataFrame,
    ) -> pd.DataFrame:

        data = self.temporal.transform(df)

        data = self.spatial.transform(data)

        data = self.categorical.transform(data)

        return data