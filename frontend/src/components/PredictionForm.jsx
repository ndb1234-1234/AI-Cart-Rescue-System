import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RotateCcw } from 'lucide-react'
import { FORM_FIELDS } from '../utils/constants'
import LoadingSpinner from './LoadingSpinner'
import { classNames } from '../utils/helpers'

export default function PredictionForm({ formData, errors, loading, onChange, onSubmit, onReset }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="card-base p-6">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={19} className="text-primary-600 dark:text-primary-400" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Session Feature Input</h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Enter the six engineered features exactly as computed by your data pipeline. These are sent
        as-is to the <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">/predict</code> endpoint.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {FORM_FIELDS.map((field, i) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={field.type === 'select' ? 'sm:col-span-2' : ''}
          >
            <label htmlFor={field.name} className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              {field.label}
            </label>

            {field.type === 'select' ? (
              <select
                id={field.name}
                value={formData[field.name]}
                onChange={(e) => onChange(field.name, e.target.value)}
                className={classNames('input-base', errors[field.name] && 'border-red-400 focus:ring-red-400/40 focus:border-red-500')}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                type="number"
                min={field.min}
                max={field.max}
                step={field.step}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={(e) => onChange(field.name, e.target.value)}
                className={classNames('input-base', errors[field.name] && 'border-red-400 focus:ring-red-400/40 focus:border-red-500')}
              />
            )}

            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-slate-400">{field.help}</p>
            </div>
            {errors[field.name] && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors[field.name]}</p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-7">
        <button type="submit" disabled={loading} className="btn-primary flex-1 sm:flex-none sm:min-w-[180px]">
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              Predicting...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Run Prediction
            </>
          )}
        </button>
        <button type="button" onClick={onReset} disabled={loading} className="btn-secondary">
          <RotateCcw size={15} />
          Reset Form
        </button>
      </div>
    </form>
  )
}
