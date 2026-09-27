"""
Recursive Predictor
"""

import pandas as pd


class RecursivePredictor:
    """
    Performs recursive multi-step forecasting for tree models.
    """

    def predict(
        self,
        model,
        features: pd.DataFrame,
        periods: int,
    ) -> pd.DataFrame:

        current = features.copy()

        predictions = []

        month = int(
            current["month"].iloc[0]
        )

        year = int(
            current["year"].iloc[0]
        )

        for _ in range(periods):

            prediction = float(
                model.predict(current)[0]
            )

            month += 1

            if month > 12:

                month = 1

                year += 1

            predictions.append(
                {
                    "year": year,
                    "month": month,
                    "prediction": prediction,
                }
            )

            current["lag_3"] = (
                current["lag_2"].values
            )

            current["lag_2"] = (
                current["lag_1"].values
            )

            current["lag_1"] = prediction

            lags = [
                current["lag_1"].iloc[0],
                current["lag_2"].iloc[0],
                current["lag_3"].iloc[0],
            ]

            current["rolling_mean_3"] = (
                sum(lags) / 3
            )

            current["rolling_std_3"] = (
                pd.Series(lags).std()
            )

            current["month"] = month

            current["year"] = year

            current["quarter"] = (
                (month - 1) // 3
            ) + 1

        return pd.DataFrame(
            predictions
        )