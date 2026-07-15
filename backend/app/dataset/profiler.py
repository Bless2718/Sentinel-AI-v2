import pandas as pd

from app.dataset.profile import DatasetProfile


class DatasetProfiler:
    """
    Generates statistical information about a dataset.
    """

    def profile(self, df: pd.DataFrame) -> DatasetProfile:

        memory_usage = (
            df.memory_usage(deep=True).sum()
            / 1024
            / 1024
        )

        numeric_columns = (
            df.select_dtypes(include="number")
            .columns
            .tolist()
        )

        categorical_columns = (
            df.select_dtypes(
                include=["object", "string", "category"]
            )
            .columns
            .tolist()
        )

        datetime_columns = (
            df.select_dtypes(include="datetime")
            .columns
            .tolist()
        )

        return DatasetProfile(
            rows=len(df),
            columns=len(df.columns),

            missing_values=int(df.isna().sum().sum()),
            duplicate_rows=int(df.duplicated().sum()),

            memory_usage_mb=round(memory_usage, 2),

            numeric_columns=numeric_columns,
            categorical_columns=categorical_columns,
            datetime_columns=datetime_columns,
        )