"""
Spatial Crime Clustering
"""

import pandas as pd

from sklearn.cluster import DBSCAN


class SpatialClusterer:
    """
    Groups nearby crime incidents into clusters.
    """

    def cluster(
        self,
        df: pd.DataFrame,
        eps: float = 0.01,
        min_samples: int = 3,
    ) -> pd.DataFrame:

        required = ["latitude", "longitude"]

        missing = [
            c for c in required
            if c not in df.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

        data = df.copy()

        coordinates = data[
            ["latitude", "longitude"]
        ]

        model = DBSCAN(
            eps=eps,
            min_samples=min_samples,
        )

        data["cluster"] = model.fit_predict(
            coordinates
        )

        return data