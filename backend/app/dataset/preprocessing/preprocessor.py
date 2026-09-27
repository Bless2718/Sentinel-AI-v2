from __future__ import annotations

import pandas as pd

from app.dataset.schema_mapper import SchemaMapper

from .result import PreprocessingResult


class DatasetPreprocessor:
    """
    Converts uploaded datasets into Sentinel's
    canonical internal dataframe without modifying
    the original uploaded file.
    """

    def __init__(self):
        self.mapper = SchemaMapper()

    def prepare(
        self,
        df: pd.DataFrame,
    ) -> PreprocessingResult:

        if df.empty:
            raise ValueError("Dataset is empty.")

        rows_before = len(df)
        warnings: list[str] = []

        # Work on a copy so the original dataframe
        # remains untouched.
        data = df.copy()

        # Remove completely empty rows.
        data = data.dropna(
            how="all"
        )

        # Detect uploaded column names.
        mapping = self.mapper.map_columns(
            data.columns.tolist()
        )

        if not mapping:
            raise ValueError(
                "Unable to map dataset columns."
            )

        # Convert to Sentinel's canonical
        # internal schema in memory.
        data = self.mapper.rename_dataframe(
            data,
            mapping,
        )

        # Normalize column names.
        data.columns = [
            str(column).strip().lower()
            for column in data.columns
        ]

        # -------------------------------------------------
        # Date preprocessing
        # -------------------------------------------------

        if "incident_date" in data.columns:

            data["incident_date"] = pd.to_datetime(
                data["incident_date"],
                errors="coerce",
            )

            invalid_dates = int(
                data["incident_date"].isna().sum()
            )

            if invalid_dates:
                warnings.append(
                    f"{invalid_dates} rows have invalid dates."
                )

        # -------------------------------------------------
        # Geographic preprocessing
        # -------------------------------------------------

        for column in [
            "latitude",
            "longitude",
        ]:

            if column in data.columns:

                data[column] = pd.to_numeric(
                    data[column],
                    errors="coerce",
                )

                invalid_values = int(
                    data[column].isna().sum()
                )

                if invalid_values:
                    warnings.append(
                        f"{invalid_values} rows have invalid {column} values."
                    )

        # -------------------------------------------------
        # Text preprocessing
        # -------------------------------------------------

        for column in [
            "crime_type",
            "neighborhood",
            "location",
        ]:

            if column in data.columns:

                data[column] = (
                    data[column]
                    .astype("string")
                    .str.strip()
                )

        # -------------------------------------------------
        # Remove exact duplicate rows
        # -------------------------------------------------

        duplicate_count = int(
            data.duplicated().sum()
        )

        if duplicate_count:
            data = data.drop_duplicates()

            warnings.append(
                f"{duplicate_count} duplicate rows removed."
            )

        # Reset dataframe index.
        data = data.reset_index(
            drop=True
        )

        return PreprocessingResult(
            data=data,
            mapping=mapping,
            warnings=warnings,
            rows_before=rows_before,
            rows_after=len(data),
        )
