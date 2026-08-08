import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Gauge, Percent } from 'lucide-react'
import RiskGauge from './RiskGauge'
import { formatPercent, formatDate } from '../utils/helpers'
import { classNames } from '../utils/helpers'

export default function PredictionResult({ result }) {
  if (!result) return null

  const { isAbandoned, label, probability, confidencePercent, riskLevel, timestamp } = result

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className={classNames(
        'card-base p-6 ring-1',
        riskLevel.ring
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {isAbandoned ? (
            <XCircle size={22} className="text-red-500" />
          ) : (
            <CheckCircle2 size={22} className="text-emerald-500" />
          )}
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Prediction Result</h3>
        </div>
        <span className={classNames('badge', isAbandoned ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400')}>
          {label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex justify-center">
          <RiskGauge probability={probability} color={riskLevel.color} label={riskLevel.label} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatBlock icon={Gauge} label="Risk Level" value={riskLevel.label} valueClass={riskLevel.text} />
          <StatBlock icon={Percent} label="Confidence" value={`${confidencePercent}%`} />
          <StatBlock label="Probability" value={formatPercent(probability, 1)} />
          <StatBlock label="Predicted At" value={formatDate(timestamp)} small />
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {isAbandoned ? (
            <>
              This customer session shows a <strong>{confidencePercent}% probability</strong> of cart
              abandonment. Consider triggering a retention action — a discount nudge, an exit-intent
              popup, or a follow-up email — to recover this potential sale.
            </>
          ) : (
            <>
              This customer session shows a <strong>{confidencePercent}% probability</strong> of
              completing checkout. No intervention needed, though a lightweight upsell could
              increase order value.
            </>
          )}
        </p>
      </div>
    </motion.div>
  )
}

function StatBlock({ icon: Icon, label, value, valueClass, small }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3.5">
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && <Icon size={13} className="text-slate-400" />}
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</p>
      </div>
      <p className={classNames(small ? 'text-sm' : 'text-base', 'font-bold text-slate-800 dark:text-slate-100', valueClass)}>
        {value}
      </p>
    </div>
  )
}
