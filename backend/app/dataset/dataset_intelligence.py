"""
Dataset Intelligence

Creates compact, AI-safe information about a dataset.
"""

from __future__ import annotations

from typing import Any

import pandas as pd


class DatasetIntelligence:
    """
    Generates compact analytical information from
    the uploaded dataset.

    Supports both canonical Sentinel column names
    and common raw dataset column names.
    """

    COLUMN_ALIASES = {
        "crime_type": [
            "crime_type",
            "TYPE",
            "type",
        ],
        "neighborhood": [
            "neighborhood",
            "NEIGHBOURHOOD",
            "neighborhood_name",
        ],
        "location": [
            "location",
            "HUNDRED_BLOCK",
            "hundred_block",
        ],
        "latitude": [
            "latitude",
            "Latitude",
            "LATITUDE",
        ],
        "longitude": [
            "longitude",
            "Longitude",
            "LONGITUDE",
        ],
        "incident_date": [
            "incident_date",
            "Date",
            "date",
        ],
        "year": [
            "YEAR",
            "year",
        ],
        "month": [
            "MONTH",
            "month",
        ],
        "day": [
            "DAY",
            "day",
        ],
    }

    def analyze(
        self,
        df: pd.DataFrame,
    ) -> dict[str, Any]:

        result: dict[str, Any] = {}

        # -------------------------------------------------
        # Basic dataset information
        # -------------------------------------------------

        result["total_rows"] = int(
            len(df)
        )

        result["total_columns"] = int(
            len(df.columns)
        )

        result["columns"] = [
            str(column)
            for column in df.columns
        ]

        # -------------------------------------------------
        # Detect actual columns
        # -------------------------------------------------

        crime_column = self._find_column(
            df,
            "crime_type",
        )

        neighborhood_column = self._find_column(
            df,
            "neighborhood",
        )

        location_column = self._find_column(
            df,
            "location",
        )

        latitude_column = self._find_column(
            df,
            "latitude",
        )

        longitude_column = self._find_column(
            df,
            "longitude",
        )

        date_column = self._find_column(
            df,
            "incident_date",
        )

        year_column = self._find_column(
            df,
            "year",
        )

        month_column = self._find_column(
            df,
            "month",
        )

        # -------------------------------------------------
        # Detected schema
        # -------------------------------------------------

        result["detected_schema"] = {
            "crime_type": crime_column,
            "neighborhood": neighborhood_column,
            "location": location_column,
            "latitude": latitude_column,
            "longitude": longitude_column,
            "incident_date": date_column,
            "year": year_column,
            "month": month_column,
        }

        # -------------------------------------------------
        # Crime type analysis
        # -------------------------------------------------

        if crime_column is not None:

            crime_values = (
                df[crime_column]
                .dropna()
                .astype(str)
                .str.strip()
            )

            crime_values = crime_values[
                crime_values != ""
            ]

            if not crime_values.empty:

                crime_counts = (
                    crime_values
                    .value_counts()
                )

                result["crime_type_count"] = int(
                    len(crime_counts)
                )

                result["top_crime_types"] = [
                    {
                        "crime_type": str(
                            crime_type
                        ),
                        "count": int(
                            count
                        ),
                    }
                    for crime_type, count
                    in crime_counts.head(10).items()
                ]

                result["most_common_crime"] = {
                    "crime_type": str(
                        crime_counts.index[0]
                    ),
                    "count": int(
                        crime_counts.iloc[0]
                    ),
                }

        # -------------------------------------------------
        # Geographic concentration of most common crime
        # -------------------------------------------------

        if (
            crime_column is not None
            and neighborhood_column is not None
        ):

            crime_values = (
                df[crime_column]
                .dropna()
                .astype(str)
                .str.strip()
            )

            if not crime_values.empty:

                crime_counts = (
                    crime_values
                    .value_counts()
                )

                most_common_crime = (
                    crime_counts.index[0]
                )

                crime_subset = df[
                    df[crime_column]
                    .astype(str)
                    .str.strip()
                    == most_common_crime
                ]

                neighborhood_counts = (
                    crime_subset[
                        neighborhood_column
                    ]
                    .dropna()
                    .astype(str)
                    .str.strip()
                )

                neighborhood_counts = (
                    neighborhood_counts[
                        neighborhood_counts != ""
                    ]
                    .value_counts()
                )

                result[
                    "most_common_crime_concentration"
                ] = {
                    "crime_type": str(
                        most_common_crime
                    ),
                    "total_count": int(
                        len(crime_subset)
                    ),
                    "top_neighborhoods": [
                        {
                            "neighborhood": str(
                                neighborhood
                            ),
                            "count": int(
                                count
                            ),
                        }
                        for neighborhood, count
                        in neighborhood_counts
                        .head(10)
                        .items()
                    ],
                }

        # -------------------------------------------------
        # Overall neighborhood analysis
        # -------------------------------------------------

        if neighborhood_column is not None:

            neighborhood_values = (
                df[neighborhood_column]
                .dropna()
                .astype(str)
                .str.strip()
            )

            neighborhood_values = (
                neighborhood_values[
                    neighborhood_values != ""
                ]
            )

            if not neighborhood_values.empty:

                neighborhood_counts = (
                    neighborhood_values
                    .value_counts()
                )

                result["neighborhood_count"] = int(
                    len(neighborhood_counts)
                )

                result["top_neighborhoods"] = [
                    {
                        "neighborhood": str(
                            neighborhood
                        ),
                        "count": int(
                            count
                        ),
                    }
                    for neighborhood, count
                    in neighborhood_counts
                    .head(10)
                    .items()
                ]

        # -------------------------------------------------
        # Location analysis
        # -------------------------------------------------

        if location_column is not None:

            location_values = (
                df[location_column]
                .dropna()
                .astype(str)
                .str.strip()
            )

            location_values = location_values[
                location_values != ""
            ]

            if not location_values.empty:

                result["unique_locations"] = int(
                    location_values.nunique()
                )

        # -------------------------------------------------
        # Date analysis
        # -------------------------------------------------

        if date_column is not None:

            dates = pd.to_datetime(
                df[date_column],
                errors="coerce",
            ).dropna()

            if not dates.empty:

                result["date_range"] = {
                    "start": str(
                        dates.min().date()
                    ),
                    "end": str(
                        dates.max().date()
                    ),
                }

        # -------------------------------------------------
        # Year analysis
        # -------------------------------------------------

        if year_column is not None:

            years = (
                pd.to_numeric(
                    df[year_column],
                    errors="coerce",
                )
                .dropna()
            )

            if not years.empty:

                years = years.astype(int)

                result["year_range"] = {
                    "start": int(
                        years.min()
                    ),
                    "end": int(
                        years.max()
                    ),
                }

                yearly_counts = (
                    years
                    .value_counts()
                    .sort_index()
                )

                result["yearly_crime_counts"] = {
                    str(year): int(count)
                    for year, count
                    in yearly_counts.items()
                }

        # -------------------------------------------------
        # Month analysis
        # -------------------------------------------------

        if month_column is not None:

            months = (
                pd.to_numeric(
                    df[month_column],
                    errors="coerce",
                )
                .dropna()
            )

            if not months.empty:

                monthly_counts = (
                    months
                    .astype(int)
                    .value_counts()
                    .sort_index()
                )

                result["monthly_crime_counts"] = {
                    str(month): int(count)
                    for month, count
                    in monthly_counts.items()
                }

        # -------------------------------------------------
        # Geographic coordinates
        # -------------------------------------------------

        if (
            latitude_column is not None
            and longitude_column is not None
        ):

            coordinates = df[
                [
                    latitude_column,
                    longitude_column,
                ]
            ].copy()

            coordinates[
                latitude_column
            ] = pd.to_numeric(
                coordinates[
                    latitude_column
                ],
                errors="coerce",
            )

            coordinates[
                longitude_column
            ] = pd.to_numeric(
                coordinates[
                    longitude_column
                ],
                errors="coerce",
            )

            valid_coordinates = coordinates.dropna()

            result["geographic_points"] = int(
                len(valid_coordinates)
            )

            result["invalid_coordinates"] = int(
                len(df)
                - len(valid_coordinates)
            )

        # -------------------------------------------------
        # Missing values
        # -------------------------------------------------

        missing = df.isna().sum()

        result["missing_values"] = {
            str(column): int(count)
            for column, count
            in missing.items()
            if count > 0
        }

        return result

    # -----------------------------------------------------
    # Column resolver
    # -----------------------------------------------------

    @classmethod
    def _find_column(
        cls,
        df: pd.DataFrame,
        canonical_name: str,
    ) -> str | None:

        aliases = cls.COLUMN_ALIASES.get(
            canonical_name,
            [],
        )

        columns = {
            str(column).lower(): column
            for column in df.columns
        }

        for alias in aliases:

            if alias in df.columns:
                return alias

            alias_lower = alias.lower()

            if alias_lower in columns:
                return columns[alias_lower]

        return None