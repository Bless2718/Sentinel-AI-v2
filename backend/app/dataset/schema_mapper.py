"""
Schema Mapper

Maps uploaded dataset columns to Sentinel AI's
canonical schema.
"""

import pandas as pd

from app.dataset.canonical_schema import CANONICAL_SCHEMA


class SchemaMapper:
    """
    Maps uploaded column names to canonical fields.
    """

    def map_columns(
        self,
        columns: list[str],
    ) -> dict[str, str]:

        mapping: dict[str, str] = {}

        normalized_columns = {
            self._normalize(column): column
            for column in columns
        }

        for canonical_field, aliases in CANONICAL_SCHEMA.items():

            for alias in aliases:

                normalized_alias = self._normalize(alias)

                if normalized_alias in normalized_columns:

                    mapping[canonical_field] = normalized_columns[
                        normalized_alias
                    ]

                    break

        return mapping

    def rename_dataframe(
        self,
        df: pd.DataFrame,
        mapping: dict[str, str],
    ) -> pd.DataFrame:
        """
        Renames dataframe columns to the
        Sentinel AI canonical schema.
        """

        rename_dict = {
            original: canonical
            for canonical, original in mapping.items()
        }

        return df.rename(columns=rename_dict)

    @staticmethod
    def _normalize(name: str) -> str:

        return (
            name.strip()
            .lower()
            .replace(" ", "")
            .replace("_", "")
            .replace("-", "")
        )