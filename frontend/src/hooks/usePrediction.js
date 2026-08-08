import { useCallback, useState } from 'react'
import { predictCartAbandonment } from '../services/api'
import { normalizePrediction, validateFormData } from '../utils/helpers'

const INITIAL_FORM = {
  hour_of_day: '',
  user_total_sessions: '',
  avg_products_per_user: '',
  user_total_carts: '',
  average_session_duration_per_user: '',
  is_weekend: '',
}

/**
 * Encapsulates prediction form state, validation, submission, loading and
 * error handling. Keeps the Prediction page component focused on layout.
 */
export function usePrediction() {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const updateField = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }, [])

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM)
    setErrors({})
    setResult(null)
    setApiError(null)
  }, [])

  const submitPrediction = useCallback(async () => {
    const validationErrors = validateFormData(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setApiError(null)
    setLoading(true)
    setResult(null)

    const payload = {
      hour_of_day: Number(formData.hour_of_day),
      user_total_sessions: Number(formData.user_total_sessions),
      avg_products_per_user: Number(formData.avg_products_per_user),
      user_total_carts: Number(formData.user_total_carts),
      average_session_duration_per_user: Number(formData.average_session_duration_per_user),
      is_weekend: Number(formData.is_weekend),
    }

    try {
      const raw = await predictCartAbandonment(payload)
      const normalized = normalizePrediction(raw)
      setResult(normalized)
      return normalized
    } catch (err) {
      setApiError(err.message || 'Something went wrong while contacting the prediction service.')
    } finally {
      setLoading(false)
    }
  }, [formData])

  return {
    formData,
    errors,
    result,
    loading,
    apiError,
    updateField,
    resetForm,
    submitPrediction,
  }
}
