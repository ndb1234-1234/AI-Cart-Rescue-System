// Mock data used across the dashboard and insights pages so the UI is fully
// explorable before the real Flask/FastAPI backend is connected.

export const MOCK_MODEL_STATUS = {
  status: 'Online (Mock Mode)',
  modelName: 'cart_rescue_final_optimized.pkl',
  algorithm: 'XGBoost Classifier',
  version: 'v1.3.0',
  lastTrained: '2026-07-28',
  rocAuc: 0.913,
  accuracy: 0.887,
  precision: 0.86,
  recall: 0.84,
  f1Score: 0.85,
}

export const MOCK_DATASET_STATS = {
  totalRecords: 148230,
  totalFeatures: 6,
  abandonedRate: 0.612,
  completedRate: 0.388,
  trainSize: 118584,
  testSize: 29646,
}

export const MOCK_FEATURE_IMPORTANCE = [
  { feature: 'average_session_duration_per_user', importance: 0.284 },
  { feature: 'user_total_sessions', importance: 0.231 },
  { feature: 'avg_products_per_user', importance: 0.198 },
  { feature: 'hour_of_day', importance: 0.152 },
  { feature: 'user_total_carts', importance: 0.098 },
  { feature: 'is_weekend', importance: 0.037 },
]

export const MOCK_ROC_CURVE = Array.from({ length: 21 }, (_, i) => {
  const fpr = i / 20
  // Smooth-ish curve above the diagonal to simulate ROC-AUC ~0.91
  const tpr = Math.min(1, Math.pow(fpr, 0.35) + (i === 0 ? 0 : 0.03))
  return { fpr: Number(fpr.toFixed(2)), tpr: Number(tpr.toFixed(3)) }
})

export function generateMockPrediction(formData) {
  // Lightweight heuristic so mock predictions feel responsive to input,
  // purely for demo purposes when the backend is unavailable.
  const duration = Number(formData.average_session_duration_per_user) || 0
  const sessions = Number(formData.user_total_sessions) || 0
  const carts = Number(formData.user_total_carts) || 0
  const products = Number(formData.avg_products_per_user) || 0

  let score = 0.5
  score += duration < 60 ? 0.2 : -0.1
  score += sessions < 3 ? 0.15 : -0.1
  score += carts > 5 ? 0.1 : -0.05
  score += products < 2 ? 0.1 : -0.05
  score = Math.min(Math.max(score, 0.05), 0.97)

  const isAbandoned = score >= 0.5

  return {
    prediction: isAbandoned ? 'Abandoned' : 'Completed',
    probability: Number(score.toFixed(2)),
  }
}

export function generateMockHistory() {
  const now = Date.now()
  return [
    { id: 1, label: 'Abandoned', probability: 0.84, timestamp: new Date(now - 1000 * 60 * 12).toISOString() },
    { id: 2, label: 'Completed', probability: 0.79, timestamp: new Date(now - 1000 * 60 * 47).toISOString() },
    { id: 3, label: 'Abandoned', probability: 0.68, timestamp: new Date(now - 1000 * 60 * 92).toISOString() },
    { id: 4, label: 'Completed', probability: 0.91, timestamp: new Date(now - 1000 * 60 * 130).toISOString() },
    { id: 5, label: 'Abandoned', probability: 0.73, timestamp: new Date(now - 1000 * 60 * 210).toISOString() },
  ]
}
