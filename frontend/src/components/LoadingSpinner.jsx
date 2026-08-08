import React from 'react'
import { motion } from 'framer-motion'

/**
 * Reusable loading indicator.
 * size: 'sm' | 'md' | 'lg'
 * label: optional text shown below the spinner
 * fullScreen: renders as a centered overlay within its parent
 */
export default function LoadingSpinner({ size = 'md', label, fullScreen = false }) {
  const dimensions = { sm: 20, md: 32, lg: 48 }[size]

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        style={{ width: dimensions, height: dimensions }}
        className="rounded-full border-[3px] border-primary-200 dark:border-primary-900 border-t-primary-600"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      {label && <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center py-16 w-full">
        {spinner}
      </div>
    )
  }

  return spinner
}
