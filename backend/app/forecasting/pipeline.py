"""
Forecast Pipeline

Executes the complete forecasting workflow.
"""

from pathlib import Path

import pandas as pd

from app.dataset.reader import DatasetReader
from app.dataset.schema_mapper import SchemaMapper
from app.forecasting.dataset_builder import ForecastDatasetBuilder
from app.forecasting.forecast import ForecastService
from app.forecasting.registry import ForecastModelRegistry


class ForecastPipeline:
    """
    Runs the complete forecasting workflow.
    """

    def __init__(self):

        self.reader = DatasetReader()
        self.mapper = SchemaMapper()
        self.builder = ForecastDatasetBuilder()
        self.registry = ForecastModelRegistry()
        self.service = ForecastService()

    def run(
        self,
        dataset: pd.DataFrame | Path,
        periods: int = 12,
    ) -> dict:

        # -----------------------------------
        # Load dataset if a file path is given
        # -----------------------------------
        if isinstance(dataset, Path):
            df = self.reader.read(dataset)
        else:
            df = dataset.copy()

        # -----------------------------------
        # Map uploaded columns
        # -----------------------------------
        mapping = self.mapper.map_columns(
            df.columns.tolist()
        )

        # -----------------------------------
        # Rename to Sentinel canonical schema
        # -----------------------------------
        df = self.mapper.rename_dataframe(
            df,
            mapping,
        )

        # -----------------------------------
        # Build forecasting dataset
        # -----------------------------------
        training_data = self.builder.build(df)

        # -----------------------------------
        # Run every forecasting model
        # -----------------------------------
        results = {}

        for model_name in self.registry.available_models():

            model = self.registry.create(model_name)

            forecast = self.service.run(
                model=model,
                training_data=training_data,
                periods=periods,
            )

            results[model_name] = forecast

        return results