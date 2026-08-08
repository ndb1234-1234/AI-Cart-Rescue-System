"""
AI Cart Rescue System — Flask Backend Entry Point

Serves the trained XGBoost model (cart_rescue_final_optimized.pkl) via a
POST /predict endpoint consumed by the React frontend.

Run locally:
    pip install -r requirements.txt
    python app.py

The server starts on http://localhost:5000 by default.
"""

import os
import logging

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from routes.prediction import prediction_bp

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)


def create_app():
    app = Flask(__name__)

    cors_origins = os.environ.get(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    CORS(app, resources={r"/*": {"origins": cors_origins}})

    app.register_blueprint(prediction_bp)

    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            "service": "AI Cart Rescue System API",
            "status": "running",
            "endpoints": {
                "predict": "POST /predict",
                "health": "GET /health",
                "model_info": "GET /model-info",
            },
        })

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error"}), 500

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV", "development") == "development"
    logger.info("Starting AI Cart Rescue System API on port %s (debug=%s)", port, debug)
    app.run(host="0.0.0.0", port=port, debug=debug)
