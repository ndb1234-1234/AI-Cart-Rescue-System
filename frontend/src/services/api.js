import axios from 'axios'
import { API_BASE_URL, PREDICT_ENDPOINT, FORCE_MOCK } from '../utils/constants'
import { generateMockPrediction } from '../utils/mockData'

// Central Axios instance for all backend communication.
// Point VITE_API_BASE_URL at your Flask/FastAPI server (see .env.example).
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request/response interceptors kept lightweight and extensible so an auth
// token, request id, or logging hook can be added later without touching
// call sites.
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

/**
 * Sends the six engineered features to POST /predict on the Flask/FastAPI
 * backend and returns the raw JSON response:
 *   { prediction: 0 | 1 | "Abandoned" | "Completed", probability: number }
 *
 * If the backend is unreachable (network error, connection refused, or
 * timeout) OR VITE_FORCE_MOCK=true, this automatically falls back to a
 * local mock prediction so the UI is always demoable.
 */
export async function predictCartAbandonment(payload) {
  if (FORCE_MOCK) {
    return simulateNetworkDelay(generateMockPrediction(payload))
  }

  try {
    const response = await apiClient.post(PREDICT_ENDPOINT, payload)
    return response.data
  } catch (error) {
    const isNetworkIssue =
      error.code === 'ECONNABORTED' ||
      error.message === 'Network Error' ||
      !error.response

    if (isNetworkIssue) {
      // Backend not running yet — fall back to mock so the UI remains usable.
      console.warn('[AI Cart Rescue] Backend unreachable, using mock prediction.', error.message)
      return simulateNetworkDelay(generateMockPrediction(payload))
    }

    // Backend responded with an error status (4xx/5xx) — surface it.
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      `Backend returned status ${error.response?.status}`
    throw new Error(message)
  }
}

/**
 * Optional health check helper — call this to verify backend availability
 * (e.g. for the Dashboard's Model Status card).
 */
export async function checkBackendHealth() {
  try {
    const response = await apiClient.get('/health', { timeout: 3000 })
    return { online: true, data: response.data }
  } catch (error) {
    return { online: false, error: error.message }
  }
}

function simulateNetworkDelay(data, ms = 900) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export default apiClient
