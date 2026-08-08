<div align="center">

# 🛒 AI Cart Rescue System
### Predictive Cart Abandonment Detection & WhatsApp Recovery Alerts

**A Full-Stack AI/ML Web Application that predicts cart abandonment in real time and automatically recovers lost sales through WhatsApp notifications.**

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-Python-000000?style=for-the-badge&logo=flask&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-ML%20Model-EB5E28?style=for-the-badge)
![Twilio](https://img.shields.io/badge/Twilio-WhatsApp%20API-F22F46?style=for-the-badge&logo=twilio&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## 📖 Overview

The **AI Cart Rescue System** predicts whether a customer is likely to abandon their shopping cart *before* they leave — using behavioral analytics and a trained machine learning model to estimate abandonment probability in real time.

When the predicted risk crosses a set threshold, the system automatically triggers a **WhatsApp reminder** via the Twilio API, nudging the customer back to complete their purchase.

> 💡 Turning silent cart abandonment into an automated, real-time recovery opportunity.

---

## ❗ Problem Statement

E-commerce businesses lose a significant share of revenue to cart abandonment. Most platforms only react *after* a cart is abandoned — often too late to recover the sale — and lack a real-time, automated way to re-engage at-risk customers in the moment.

## ✅ Proposed Solution

AI Cart Rescue System analyzes live user session behavior (time on site, session count, cart size, etc.), scores each session's abandonment risk using an **XGBoost classifier**, and automatically fires a **WhatsApp recovery message** to high-risk customers before they're lost for good — closing the gap between prediction and action.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔮 **Real-Time Prediction** | Predicts purchase completion probability using a trained XGBoost model |
| 📊 **Risk Classification** | Categorizes sessions as Low / Medium / High risk |
| 📈 **Interactive Dashboard** | Modern responsive UI with risk gauge and confidence score visualization |
| 🧠 **ML Engine** | XGBoost classifier with a custom feature engineering pipeline and Joblib model persistence |
| 📲 **WhatsApp Alerts** | Automated, real-time recovery messages via Twilio WhatsApp API |
| 🔌 **REST API** | Clean endpoints for prediction, health checks, and model info |
| ❤️ **Model Monitoring** | Live health and status reporting for the deployed model |

---

## 🏗️ Architecture

```
Frontend (React)
        │
        ▼
Backend API (Flask)
        │
        ▼
Feature Validation
        │
        ▼
XGBoost Model
        │
        ▼
Prediction Engine
        │
        ▼
Risk Analysis
        │
        ├──────────────┬──────────────┐
        ▼              ▼
Dashboard UI    WhatsApp Notification
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Vite, Axios, Tailwind CSS |
| **Backend** | Python, Flask, Flask-CORS |
| **Data Processing** | Pandas, NumPy |
| **Machine Learning** | XGBoost, Scikit-learn, Feature Engineering, Joblib |
| **Notifications** | Twilio WhatsApp API |

---

## 📊 Dataset & Features

The model is trained on behavioral session data using the following input features:

| # | Feature | Description |
|---|---|---|
| 1 | `hour_of_day` | Hour at which the session occurs |
| 2 | `user_total_sessions` | Total number of sessions by the user |
| 3 | `avg_products_per_user` | Average products viewed/added per user |
| 4 | `user_total_carts` | Total carts created by the user |
| 5 | `avg_session_duration` | Average session duration |
| 6 | `is_weekend` | Weekend indicator (binary) |

### Prediction Output

```json
{
  "prediction": 1,
  "probability": 0.87
}
```

| Value | Meaning |
|---|---|
| `0` | Purchase Completed |
| `1` | Cart Abandoned |

---

## 🤖 Machine Learning Workflow

1. **Data Collection** — Capture live session behavior signals
2. **Feature Engineering** — Transform raw session data into model-ready features
3. **Model Training** — XGBoost Classifier trained on historical abandonment data
4. **Model Persistence** — Trained model serialized with Joblib for fast inference
5. **Real-Time Inference** — `/predict` endpoint scores incoming sessions instantly
6. **Risk Bucketing** — Probability score mapped to Low / Medium / High risk tiers

---

## 📲 WhatsApp Integration

When a session's abandonment probability crosses the configured threshold, the backend automatically calls the **Twilio WhatsApp API** to send a real-time recovery message to the customer — no manual intervention required.

- ✅ Twilio WhatsApp Sandbox supported for development/testing
- ✅ Configurable risk threshold for triggering alerts
- ✅ Real-time, automated dispatch on high-risk prediction

---

## ⚙️ Installation Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- A Twilio account with WhatsApp Sandbox enabled

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Environment Variables

Create a `.env` file inside `backend/`:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=your_twilio_whatsapp_number
TWILIO_WHATSAPP_TO=recipient_whatsapp_number
```

---

## 📡 API Documentation

### `POST /predict`
Predicts cart abandonment probability for a given session.

**Request Body:**
```json
{
  "hour_of_day": 21,
  "user_total_sessions": 4,
  "avg_products_per_user": 3.2,
  "user_total_carts": 2,
  "avg_session_duration": 145,
  "is_weekend": 1
}
```

**Response:**
```json
{
  "prediction": 1,
  "probability": 0.87
}
```

### `GET /health`
Returns backend and model service health status.

### `GET /model-info`
Returns metadata about the currently loaded ML model.

---

## 📁 Folder Structure

```
ai-cart-rescue/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── utils/
│
├── backend/
│   ├── model/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.py
│   └── .env
│
├── requirements.txt
└── README.md
```

---

## 🖼️ Screenshots

> _Add screenshots below to showcase the dashboard, risk gauge, and prediction results._

| Dashboard | Risk Gauge | Prediction Result |
|---|---|---|
| _placeholder_ | _placeholder_ | _placeholder_ |

---

## 🚀 Future Scope

- 📧 Email notification channel
- 📱 SMS alerts
- 🔐 User authentication
- ☁️ Cloud deployment (AWS/Render/Vercel)
- 📍 Live customer tracking
- 🎯 Recommendation engine integration
- 🔗 Multi-channel marketing integration

---

## 🎓 Learning Outcomes

Building this project involved hands-on experience across the full stack:

- Designing and training a classification model (XGBoost) with a real feature engineering pipeline
- Building a production-style Flask REST API with model persistence via Joblib
- Integrating a third-party notification API (Twilio WhatsApp) into an automated backend workflow
- Building a responsive React + Tailwind dashboard consuming a live prediction API
- Structuring a full-stack project with clear separation between frontend, backend, and ML components

---

## 👤 Contributors

**Nemala Dhana Babu**
[LinkedIn](https://www.linkedin.com/in/nemala-dhana-babu-03580a331) • [GitHub](https://github.com/ndb1234-1234)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ If you found this project useful, consider giving it a star!**

</div>
