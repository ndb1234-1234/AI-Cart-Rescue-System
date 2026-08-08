import { RISK_LEVELS } from './constants'

/**
 * Normalize a raw backend/mock prediction response into a consistent shape
 * used throughout the UI, regardless of whether "prediction" is 0/1 or a
 * string label like "Abandoned" / "Completed".
 */
export function normalizePrediction(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid prediction response received from server')
  }

  const { prediction, probability } = raw

  let isAbandoned
  if (typeof prediction === 'number') {
    isAbandoned = prediction === 1
  } else if (typeof prediction === 'string') {
    isAbandoned = prediction.trim().toLowerCase() === 'abandoned'
  } else {
    isAbandoned = Boolean(prediction)
  }

  const prob = typeof probability === 'number' ? probability : Number(probability)
  const safeProb = Number.isFinite(prob) ? Math.min(Math.max(prob, 0), 1) : 0.5

  return {
    isAbandoned,
    label: isAbandoned ? 'Abandoned' : 'Completed',
    probability: safeProb,
    confidencePercent: Math.round(safeProb * 100),
    riskLevel: getRiskLevel(isAbandoned, safeProb),
    timestamp: new Date().toISOString(),
  }
}

export function getRiskLevel(isAbandoned, probability) {
  if (isAbandoned && probability >= 0.7) return RISK_LEVELS.HIGH
  if (isAbandoned && probability >= 0.4) return RISK_LEVELS.MEDIUM
  if (!isAbandoned && probability >= 0.7) return RISK_LEVELS.LOW
  return RISK_LEVELS.MEDIUM
}

export function formatPercent(value, decimals = 1) {
  if (!Number.isFinite(value)) return '—'
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatDate(isoString) {
  try {
    const d = new Date(isoString)
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}

export function validateFormData(formData) {
  const errors = {}

  const numericFields = [
    'hour_of_day',
    'user_total_sessions',
    'avg_products_per_user',
    'user_total_carts',
    'average_session_duration_per_user',
  ]

  numericFields.forEach((field) => {
    const value = formData[field]
    if (value === '' || value === null || value === undefined) {
      errors[field] = 'This field is required'
      return
    }
    const num = Number(value)
    if (Number.isNaN(num)) {
      errors[field] = 'Must be a valid number'
      return
    }
    if (num < 0) {
      errors[field] = 'Value cannot be negative'
      return
    }
  })

  if (formData.hour_of_day !== '' && Number(formData.hour_of_day) > 23) {
    errors.hour_of_day = 'Hour must be between 0 and 23'
  }

  if (formData.is_weekend === '' || formData.is_weekend === undefined || formData.is_weekend === null) {
    errors.is_weekend = 'Please select an option'
  }

  return errors
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
