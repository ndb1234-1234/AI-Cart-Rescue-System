import React from 'react'
import { motion } from 'framer-motion'

/**
 * Semi-circular gauge visualizing the abandonment probability (0–1).
 * Purely SVG + Framer Motion, no external chart dependency needed.
 */
export default function RiskGauge({ probability = 0, color = '#6366f1', label = 'Risk Score' }) {
  const clamped = Math.min(Math.max(probability, 0), 1)
  const radius = 80
  const circumference = Math.PI * radius // semicircle length
  const offset = circumference * (1 - clamped)

  const angle = -180 + clamped * 180
  const needleLength = radius - 14

  const rad = (angle * Math.PI) / 180
  const needleX = 100 + needleLength * Math.cos(rad)
  const needleY = 100 + needleLength * Math.sin(rad)

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 115" className="w-full max-w-[280px]">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-700"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <motion.line
          x1="100"
          y1="100"
          x2={needleX}
          y2={needleY}
          stroke="currentColor"
          className="text-slate-700 dark:text-slate-200"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ x2: 20, y2: 100 }}
          animate={{ x2: needleX, y2: needleY }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <circle cx="100" cy="100" r="6" fill="currentColor" className="text-slate-700 dark:text-slate-200" />
      </svg>
      <div className="-mt-2 text-center">
        <p className="text-3xl font-extrabold tracking-tight" style={{ color }}>
          {Math.round(clamped * 100)}%
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  )
}
