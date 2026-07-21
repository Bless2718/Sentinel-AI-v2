from dataclasses import dataclass

import pandas as pd


@dataclass(slots=True)
class ForecastResult:
    """
    Stores the output of a forecasting operation.
    """

    predictions: pd.DataFrame

    model_name: str

    mae: float | None = None

    rmse: float | None = None

    r2_score: float | None = None

    confidence: float | None = None