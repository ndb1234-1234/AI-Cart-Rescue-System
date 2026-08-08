"""
Preprocessing utilities for the AI Cart Rescue System backend.

This module validates and transforms raw JSON input from the frontend into
the exact feature vector/order expected by the trained XGBoost model.
"""

import pandas as pd

# Canonical feature order — MUST match the order used during model training.
FEATURE_ORDER = [
    "hour_of_day",
    "user_total_sessions",
    "avg_products_per_user",
    "user_total_carts",
    "average_session_duration_per_user",
    "is_weekend",
]

REQUIRED_FIELDS = set(FEATURE_ORDER)


class ValidationError(Exception):
    """Raised when incoming request data fails validation."""
    pass


def validate_payload(data: dict) -> dict:
    """
    Validates that the incoming JSON payload contains all required fields
    with sensible numeric values. Raises ValidationError with a descriptive
    message if validation fails. Returns a cleaned dict of numeric values.
    """
    if not isinstance(data, dict):
        raise ValidationError("Request body must be a JSON object.")

    missing = REQUIRED_FIELDS - set(data.keys())
    if missing:
        raise ValidationError(f"Missing required field(s): {', '.join(sorted(missing))}")

    cleaned = {}
    for field in FEATURE_ORDER:
        value = data.get(field)
        try:
            num = float(value)
        except (TypeError, ValueError):
            raise ValidationError(f"Field '{field}' must be numeric, got: {value!r}")

        if num < 0:
            raise ValidationError(f"Field '{field}' cannot be negative.")

        cleaned[field] = num

    if not (0 <= cleaned["hour_of_day"] <= 23):
        raise ValidationError("Field 'hour_of_day' must be between 0 and 23.")

    if cleaned["is_weekend"] not in (0.0, 1.0):
        raise ValidationError("Field 'is_weekend' must be 0 or 1.")

    return cleaned


def to_dataframe(cleaned: dict) -> pd.DataFrame:
    """
    Converts a cleaned feature dict into a single-row pandas DataFrame with
    columns in the exact order the model expects.
    """
    row = {field: [cleaned[field]] for field in FEATURE_ORDER}
    return pd.DataFrame(row, columns=FEATURE_ORDER)
