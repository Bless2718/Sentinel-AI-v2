from dataclasses import dataclass


@dataclass(slots=True)
class DatasetProfile:
    """
    Stores statistical information about an uploaded dataset.
    """

    rows: int
    columns: int

    missing_values: int
    duplicate_rows: int

    memory_usage_mb: float

    numeric_columns: list[str]
    categorical_columns: list[str]
    datetime_columns: list[str]