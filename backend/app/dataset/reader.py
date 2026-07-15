"""
Dataset Reader

Responsible only for reading datasets
and returning a pandas DataFrame.

This module does NOT:

- validate
- clean
- profile
- map schema
- engineer features
"""

from pathlib import Path
from typing import BinaryIO

import pandas as pd


class DatasetReader:
    """
    Reads supported dataset formats.
    """

    SUPPORTED_EXTENSIONS = {
        ".csv",
        ".xlsx",
    }

    def read(
        self,
        file: str | Path | BinaryIO,
    ) -> pd.DataFrame:

        extension = self._extension(file)

        if extension == ".csv":
            return self._read_csv(file)

        if extension == ".xlsx":
            return self._read_excel(file)

        raise ValueError(
            f"Unsupported file type: {extension}"
        )

    def _extension(
        self,
        file,
    ) -> str:

        if hasattr(file, "filename"):
            return Path(file.filename).suffix.lower()

        return Path(str(file)).suffix.lower()

    def _read_csv(
        self,
        file,
    ) -> pd.DataFrame:

        return pd.read_csv(
            file,
            encoding="utf-8",
            low_memory=False,
        )

    def _read_excel(
        self,
        file,
    ) -> pd.DataFrame:

        return pd.read_excel(
            file,
            engine="openpyxl",
        )