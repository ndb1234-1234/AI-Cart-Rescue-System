PLACE YOUR TRAINED MODEL FILE IN THIS FOLDER:

    cart_rescue_final_optimized.pkl

The backend (services/model_service.py) loads the model from this exact path
by default:

    backend/model/cart_rescue_final_optimized.pkl

You can override the path via the MODEL_PATH environment variable in your .env
file if you'd like to store it elsewhere.

The .pkl file should contain a trained XGBoost classifier (or an sklearn
Pipeline wrapping one) that accepts a 2D array/DataFrame with these six
columns, in this exact order:

    1. hour_of_day
    2. user_total_sessions
    3. avg_products_per_user
    4. user_total_carts
    5. average_session_duration_per_user
    6. is_weekend

and exposes standard scikit-learn-compatible `.predict()` and
`.predict_proba()` methods.
