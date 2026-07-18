"""
Forecast Pipeline Result
"""

from dataclasses import dataclass

import pandas as pd

from app.forecasting.forecast_result import ForecastResult


@dataclass(slots=True)
class ForecastPipelineResult:
    """
    Stores the output of the complete
    forecasting pipeline.
    """

    best_model: str

    best_forecast: ForecastResult | None

    comparison: pd.DataFrame | None