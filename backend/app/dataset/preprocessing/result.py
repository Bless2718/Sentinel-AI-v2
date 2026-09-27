from dataclasses import dataclass
from typing import Any

import pandas as pd


@dataclass
class PreprocessingResult:
    data: pd.DataFrame
    mapping: dict[str, str]
    warnings: list[str]
    rows_before: int
    rows_after: int
