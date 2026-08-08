import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, X } from 'lucide-react'

/**
 * Reusable inline error banner.
 * Props:
 *  - message: string
 *  - onRetry: () => void (optional, shows a "Retry" button)
 *  - onDismiss: () => void (optional, shows a close button)
 */
export default function ErrorMessage({ message, onRetry, onDismiss }) {
  if (!message) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3.5"
      role="alert"
    >
      <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-red-700 dark:text-red-400">Something went wrong</p>
        <p className="text-sm text-red-600/90 dark:text-red-400/80 mt-0.5 break-words">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:underline"
          >
            <RefreshCw size={12} />
            Try again
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
          aria-label="Dismiss error"
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  )
}
