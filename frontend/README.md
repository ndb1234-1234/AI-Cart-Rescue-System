# AI Cart Rescue System — Frontend

Enterprise-style React dashboard for predicting shopping cart abandonment using a
trained XGBoost model served from a Flask/FastAPI backend.

## Tech Stack
React 18 · Vite · Tailwind CSS · Axios · React Router · Recharts · Framer Motion

## Quick Start

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

- `VITE_API_BASE_URL` — base URL of your Flask/FastAPI backend (default `http://localhost:5000`)
- `VITE_FORCE_MOCK` — set to `true` to always use mock predictions, even if the backend is running

## Mock Mode

If the backend at `VITE_API_BASE_URL` is unreachable, `src/services/api.js` automatically
falls back to a local mock prediction so the UI stays fully functional during frontend-only
development. No code changes are needed once your real backend is live — it just starts
being used automatically.

## Folder Structure

```
src/
 ├── components/    Reusable UI building blocks
 ├── pages/         Route-level pages (Dashboard, Prediction, Insights, About)
 ├── layouts/        MainLayout (Navbar + Sidebar + Footer shell)
 ├── router/         React Router route definitions
 ├── services/       Axios API layer (api.js)
 ├── hooks/          usePrediction (form state, validation, submission)
 ├── context/         ThemeContext (dark mode)
 ├── utils/          constants, helpers, mock data
 └── styles/          Tailwind global styles
```

## Build

```bash
npm run build
npm run preview
```

See the root-level `README.md` for full backend integration and deployment instructions.
