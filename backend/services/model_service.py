"""
Model loading and inference service for the AI Cart Rescue System.

Loads the trained XGBoost model (serialized with joblib or pickle) once at
startup and exposes a simple predict() function used by the /predict route.

============================================================================
 WHERE TO PLACE YOUR TRAINED MODEL
============================================================================
Drop your trained model file here:

    backend/model/cart_rescue_final_optimized.pkl

That's it — no other code changes are required. This service auto-loads it
on first import. If the file is missing, the API will still start (so you
can develop the frontend independently) but /predict will return a clear
503 error explaining that the model is not loaded.
============================================================================
"""

import os
import pickle
import logging

import joblib

from utils.preprocess import FEATURE_ORDER, to_dataframe

logger = logging.getLogger(__name__)

DEFAULT_MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "model",
    "cart_rescue_final_optimized.pkl",
)

MODEL_PATH = os.environ.get("MODEL_PATH", DEFAULT_MODEL_PATH)

_model = None
_model_load_error = None


def load_model():
    """Loads the model from disk. Tries joblib first, falls back to pickle."""
    global _model, _model_load_error

    if not os.path.exists(MODEL_PATH):
        _model_load_error = (
            f"Model file not found at '{MODEL_PATH}'. "
            "Place your trained 'cart_rescue_final_optimized.pkl' file in the "
            "backend/model/ directory."
        )
        logger.warning(_model_load_error)
        return None

    try:
        _model = joblib.load(MODEL_PATH)
        logger.info("Model loaded successfully via joblib from %s", MODEL_PATH)
        return _model
    except Exception as joblib_error:  # noqa: BLE001
        logger.warning("joblib.load failed (%s), trying pickle...", joblib_error)
        try:
            with open(MODEL_PATH, "rb") as f:
                _model = pickle.load(f)
            logger.info("Model loaded successfully via pickle from %s", MODEL_PATH)
            return _model
        except Exception as pickle_error:  # noqa: BLE001
            _model_load_error = f"Failed to load model: {pickle_error}"
            logger.error(_model_load_error)
            return None


# Attempt to load the model as soon as this module is imported.
_model = load_model()


def is_model_loaded() -> bool:
    return _model is not None


def get_model_load_error() -> str:
    return _model_load_error or ""


def predict(cleaned_features: dict) -> dict:
    """
    Runs inference on a single validated feature dict.
    Returns: {"prediction": 0 | 1, "probability": float}
    """
    if _model is None:
        raise RuntimeError(get_model_load_error() or "Model is not loaded.")

    df = to_dataframe(cleaned_features)

    # Predicted class (0 = Completed, 1 = Abandoned)
    prediction = int(_model.predict(df)[0])

    # Predicted probability of the positive class (Abandoned = 1)
    if hasattr(_model, "predict_proba"):
        probability = float(_model.predict_proba(df)[0][1])
    else:
        # Fallback for models without predict_proba (e.g. raw Booster)
        probability = float(prediction)

    return {"prediction": prediction, "probability": round(probability, 4)}


def get_model_info() -> dict:
    """Returns basic metadata about the currently loaded model."""
    return {
        "loaded": is_model_loaded(),
        "path": MODEL_PATH,
        "feature_order": FEATURE_ORDER,
        "error": get_model_load_error() if not is_model_loaded() else None,
    }
