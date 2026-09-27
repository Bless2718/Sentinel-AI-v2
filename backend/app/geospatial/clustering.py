"""
Spatial Crime Clustering
"""

from __future__ import annotations

import pandas as pd
from sklearn.cluster import DBSCAN


class SpatialClusterer:
    """
    Groups nearby crime incidents into spatial clusters.

    Optimized by clustering only unique coordinate pairs
    and merging the cluster labels back into the dataset.
    """

    def cluster(
        self,
        df: pd.DataFrame,
        eps: float = 0.01,
        min_samples: int = 3,
    ) -> pd.DataFrame:

        required = ["latitude", "longitude"]

        missing = [
            column
            for column in required
            if column not in df.columns
        ]

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

        # ---------------------------------------------------
        # Copy dataset
        # ---------------------------------------------------

        data = df.copy()

      
        # ---------------------------------------------------
        # Remove invalid coordinates
        # ---------------------------------------------------

        invalid = (
            (data["latitude"] == 0)
            &
            (data["longitude"] == 0)
        )

      

        data = data.loc[~invalid].copy()

       

        # ---------------------------------------------------
        # Remove missing coordinates
        # ---------------------------------------------------

        data = data.dropna(
            subset=[
                "latitude",
                "longitude",
            ]
        )

        # ---------------------------------------------------
        # Unique coordinate pairs
        # ---------------------------------------------------

        unique_locations = (
            data[
                [
                    "latitude",
                    "longitude",
                ]
            ]
            .drop_duplicates()
            .reset_index(drop=True)
        )


        # ---------------------------------------------------
        # DBSCAN
        # ---------------------------------------------------

       

        model = DBSCAN(
            eps=eps,
            min_samples=min_samples,
            algorithm="ball_tree",
            n_jobs=-1,
        )

        unique_locations["cluster"] = model.fit_predict(
            unique_locations[
                [
                    "latitude",
                    "longitude",
                ]
            ]
        )

      

        # ---------------------------------------------------
        # Merge cluster labels back
        # ---------------------------------------------------

        clustered = data.merge(
            unique_locations,
            on=[
                "latitude",
                "longitude",
            ],
            how="left",
        )

        clustered["cluster"] = (
            clustered["cluster"]
            .fillna(-1)
            .astype(int)
        )

       
       

       

        return clustered