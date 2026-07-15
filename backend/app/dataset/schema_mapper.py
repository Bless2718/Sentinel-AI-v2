"""
Schema Mapper

Maps uploaded dataset columns to Sentinel AI's
canonical schema.
"""

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

    @staticmethod
    def _normalize(name: str) -> str:
        """
        Normalize column names for comparison.
        """

        return (
            name.strip()
            .lower()
            .replace(" ", "")
            .replace("_", "")
            .replace("-", "")
        )