"""
Sentinel AI Canonical Crime Schema

Defines the standard field names used throughout
the Intelligence Engine.

Every uploaded dataset is mapped to these fields.
"""

CANONICAL_SCHEMA = {

    # ==========================
    # Temporal
    # ==========================

    "incident_date": [
        "incident_date",
        "date",
        "crime_date",
        "occurred_on",
        "reported_date",
        "incidentdate",
        "event_date",
    ],

    "incident_time": [
        "incident_time",
        "time",
        "occurred_time",
        "event_time",
    ],

    # ==========================
    # Crime Information
    # ==========================
"crime_type": [
    "crime_type",
    "primary_type",
    "offense",
    "offence",
    "crime_category",
    "incident_type",
    "category",
    "type",
],

    "description": [
        "description",
        "crime_description",
        "offense_description",
    ],

    # ==========================
    # Geographic
    # ==========================

    "latitude": [
        "latitude",
        "lat",
        "y",
    ],

    "longitude": [
        "longitude",
        "lng",
        "lon",
        "long",
        "x",
    ],

    "district": [
        "district",
        "police_district",
        "precinct",
    ],

    "police_beat": [
        "beat",
        "police_beat",
        "beat_number",
    ],

    "neighborhood": [
    "neighborhood",
    "neighbourhood",
    "community_area",
    "community",
    "ward",
],

    "location": [
    "location",
    "address",
    "block",
    "street",
    "hundred_block",
],

    # ==========================
    # Case Information
    # ==========================

    "arrest": [
        "arrest",
        "is_arrest",
        "arrest_made",
    ],

    "domestic": [
        "domestic",
        "domestic_incident",
    ],
}