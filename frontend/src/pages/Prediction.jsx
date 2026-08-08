import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import PredictionForm from '../components/PredictionForm.jsx'
import PredictionResult from '../components/PredictionResult.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import { usePrediction } from '../hooks/usePrediction.js'

export default function Prediction() {
  const { formData, errors, result, loading, apiError, updateField, resetForm, submitPrediction } = usePrediction()

  return (
    <div className="flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-1 flex items-center gap-1.5">
          <Sparkles size={13} />
          Cart Abandonment Predictor
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Run a Prediction
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
          Enter session-level features to get a real-time abandonment probability from the XGBoost model.
        </p>
      </motion.div>

      <AnimatePresence>
        {apiError && <ErrorMessage message={apiError} onRetry={submitPrediction} />}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
        <div className="xl:col-span-3">
          <PredictionForm
            formData={formData}
            errors={errors}
            loading={loading}
            onChange={updateField}
            onSubmit={submitPrediction}
            onReset={resetForm}
          />
        </div>

        <div className="xl:col-span-2">
          <AnimatePresence mode="wait">
            {result ? (
              <PredictionResult key="result" result={result} />
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-base p-10 flex flex-col items-center justify-center text-center h-full min-h-[320px]"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-4">
                  <Sparkles size={24} className="text-primary-500" />
                </div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">No prediction yet</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                  Fill out the session features and click <strong>Run Prediction</strong> to see the risk
                  score, confidence, and recommended action here.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
