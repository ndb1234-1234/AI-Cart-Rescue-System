import React from 'react'
import { motion } from 'framer-motion'
import { classNames } from '../utils/helpers'

/**
 * Generic stat/metric card used across the Dashboard page.
 * Props:
 *  - title: string
 *  - value: string | number
 *  - subtitle: string (optional)
 *  - icon: lucide-react component
 *  - accent: 'primary' | 'success' | 'warning' | 'danger'
 *  - trend: { direction: 'up' | 'down', value: string } (optional)
 */
export default function DashboardCard({ title, value, subtitle, icon: Icon, accent = 'primary', trend, delay = 0 }) {
  const accentStyles = {
    primary: 'from-primary-500/15 to-primary-500/5 text-primary-600 dark:text-primary-400 border-primary-500/20',
    success: 'from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-500/20',
    danger: 'from-red-500/15 to-red-500/5 text-red-600 dark:text-red-400 border-red-500/20',
  }[accent]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      className="card-base p-5 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className={classNames('h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center border', accentStyles)}>
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        {trend && (
          <span
            className={classNames(
              'badge',
              trend.direction === 'up'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
            )}
          >
            {trend.direction === 'up' ? '▲' : '▼'} {trend.value}
          </span>
        )}
      </div>
    </motion.div>
  )
}
