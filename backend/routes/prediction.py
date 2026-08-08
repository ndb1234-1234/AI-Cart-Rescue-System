"""
Prediction routes for the AI Cart Rescue System API.

Exposes:
    POST /predict  — run cart-abandonment inference
    GET  /health    — service + model health check
    GET  /model-info — metadata about the currently loaded model
"""

from flask import Blueprint, request, jsonify

from services.model_service import predict, is_model_loaded, get_model_info
from utils.preprocess import validate_payload, ValidationError

prediction_bp = Blueprint("prediction", __name__)


@prediction_bp.route("/predict", methods=["POST"])
def predict_route():
    if not request.is_json:
        return jsonify({"error": "Request must have Content-Type: application/json"}), 400

    data = request.get_json(silent=True) or {}

    try:
        cleaned = validate_payload(data)
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400

    if not is_model_loaded():
        return jsonify({
            "error": (
                "Model is not loaded on the server. Place "
                "'cart_rescue_final_optimized.pkl' inside backend/model/ and restart "
                "the API."
            )
        }), 503

    try:
        result = predict(cleaned)
    except Exception as e:  # noqa: BLE001
        return jsonify({"error": f"Inference failed: {e}"}), 500

    return jsonify(result), 200


@prediction_bp.route("/health", methods=["GET"])
def health_route():
    return jsonify({
        "status": "ok",
        "model_loaded": is_model_loaded(),
    }), 200


@prediction_bp.route("/model-info", methods=["GET"])
def model_info_route():
    return jsonify(get_model_info()), 200
