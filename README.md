# AI Cart Rescue System

Full-stack application to predict shopping cart abandonment from an XGBoost
model, with an enterprise-grade React dashboard frontend and a Flask backend
ready to serve `cart_rescue_final_optimized.pkl`.

```
ai-cart-rescue/
├── frontend/     React 18 + Vite + Tailwind dashboard
└── backend/      Flask API serving the trained model
```

## 1. Installation

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Runs at `http://localhost:5173`. Works immediately in **mock mode** even
without the backend running.

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```
Runs at `http://localhost:5000`.

## 2. Connect Your Trained Model

1. Train your XGBoost model exactly on these six features, **in this order**:
   `hour_of_day, user_total_sessions, avg_products_per_user, user_total_carts, average_session_duration_per_user, is_weekend`
2. Save it with `joblib.dump(model, "cart_rescue_final_optimized.pkl")`.
3. Copy the file into `backend/model/cart_rescue_final_optimized.pkl`.
4. Restart the backend (`python app.py`). No frontend or route code changes
   are required — `services/model_service.py` auto-loads the file on startup.
5. Verify with `curl http://localhost:5000/model-info`.

The frontend already targets `POST http://localhost:5000/predict` and
expects `{ "prediction": 0|1, "probability": 0.0–1.0 }` — exactly what
`routes/prediction.py` returns once your model is loaded.

## 3. How the Mock Fallback Works

`frontend/src/services/api.js` calls the real backend first. If the request
fails because the backend isn't running (connection refused, timeout, CORS
issue before backend starts), it automatically returns a locally generated
mock prediction so you can keep building/demoing the UI. Once your backend
is live, real predictions are used automatically — no code changes needed.
Set `VITE_FORCE_MOCK=true` in `frontend/.env` to force mock mode regardless
of backend availability.

## 4. Deployment

### Frontend → Vercel
1. Push the `frontend/` folder to a Git repo (or the whole monorepo with
   Vercel's root directory set to `frontend`).
2. In Vercel: **New Project → Import Repo**, set **Root Directory** to
   `frontend`, framework preset **Vite**.
3. Add environment variable `VITE_API_BASE_URL` = your deployed backend URL
   (e.g. `https://ai-cart-rescue-api.onrender.com`).
4. Deploy. Build command `npm run build`, output directory `dist`.

### Backend → Render
1. Push `backend/` to a Git repo.
2. In Render: **New → Web Service**, connect the repo, root directory
   `backend`.
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn app:app --bind 0.0.0.0:$PORT`
5. Add environment variables from `.env.example` (`CORS_ORIGINS` should
   include your deployed Vercel frontend URL).
6. Make sure `cart_rescue_final_optimized.pkl` is committed to
   `backend/model/` (or loaded from an external storage bucket at startup —
   update `MODEL_PATH` / `model_service.py` accordingly for large files).
7. Deploy, then update the frontend's `VITE_API_BASE_URL` to this service's
   URL and redeploy the frontend.

## 5. Run Commands Summary

| Task                     | Command                                      |
|---------------------------|-----------------------------------------------|
| Install frontend deps      | `cd frontend && npm install`                   |
| Start frontend dev server  | `cd frontend && npm run dev`                   |
| Build frontend for prod    | `cd frontend && npm run build`                 |
| Install backend deps       | `cd backend && pip install -r requirements.txt` |
| Start backend dev server   | `cd backend && python app.py`                  |
| Start backend (prod)       | `cd backend && gunicorn app:app --bind 0.0.0.0:5000` |
