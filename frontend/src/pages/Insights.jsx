import React from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { BarChart3, Info, Layers, Target } from 'lucide-react'
import FeatureImportanceChart from '../components/FeatureImportanceChart.jsx'
import { MOCK_FEATURE_IMPORTANCE, MOCK_ROC_CURVE, MOCK_MODEL_STATUS } from '../utils/mockData.js'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Insights() {
  const { theme } = useTheme()
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0'
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b'

  return (
    <div className="flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-1">
          Model Insights
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Explainability & Performance
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
          Understand what drives the model's predictions and how well it performs on held-out data.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Feature Importance */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={18} className="text-primary-600 dark:text-primary-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">Feature Importance</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Relative contribution of each feature to the XGBoost model's gain-based importance.
          </p>
          <FeatureImportanceChart data={MOCK_FEATURE_IMPORTANCE} />
        </motion.div>

        {/* ROC Curve Placeholder */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-base p-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Target size={18} className="text-primary-600 dark:text-primary-400" />
              <h3 className="font-bold text-slate-900 dark:text-white">ROC Curve</h3>
            </div>
            <span className="badge bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400">
              AUC = {MOCK_MODEL_STATUS.rocAuc.toFixed(3)}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Placeholder curve — replace with real fpr/tpr values returned by your training pipeline.
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={MOCK_ROC_CURVE} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="fpr"
                type="number"
                domain={[0, 1]}
                tick={{ fill: textColor, fontSize: 12 }}
                label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5, fill: textColor, fontSize: 12 }}
              />
              <YAxis
                domain={[0, 1]}
                tick={{ fill: textColor, fontSize: 12 }}
                label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: textColor, fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
                  border: `1px solid ${gridColor}`,
                  borderRadius: 12,
                  fontSize: 13,
                }}
              />
              <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke={gridColor} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="tpr" stroke="#6366f1" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Model Information */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-base p-6">
          <div className="flex items-center gap-2 mb-5">
            <Info size={18} className="text-primary-600 dark:text-primary-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">Model Information</h3>
          </div>
          <dl className="grid grid-cols-2 gap-y-4 text-sm">
            <InfoRow label="Algorithm" value={MOCK_MODEL_STATUS.algorithm} />
            <InfoRow label="Model File" value={MOCK_MODEL_STATUS.modelName} mono />
            <InfoRow label="Version" value={MOCK_MODEL_STATUS.version} />
            <InfoRow label="Last Trained" value={MOCK_MODEL_STATUS.lastTrained} />
            <InfoRow label="ROC-AUC" value={MOCK_MODEL_STATUS.rocAuc.toFixed(3)} />
            <InfoRow label="Accuracy" value={`${(MOCK_MODEL_STATUS.accuracy * 100).toFixed(1)}%`} />
            <InfoRow label="Precision" value={`${(MOCK_MODEL_STATUS.precision * 100).toFixed(1)}%`} />
            <InfoRow label="Recall" value={`${(MOCK_MODEL_STATUS.recall * 100).toFixed(1)}%`} />
            <InfoRow label="F1 Score" value={`${(MOCK_MODEL_STATUS.f1Score * 100).toFixed(1)}%`} />
          </dl>
        </motion.div>

        {/* Training Statistics */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-base p-6">
          <div className="flex items-center gap-2 mb-5">
            <Layers size={18} className="text-primary-600 dark:text-primary-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">Training Statistics</h3>
          </div>
          <ul className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            <StatItem label="Boosting Rounds" value="450 (early stopping @ 387)" />
            <StatItem label="Max Depth" value="6" />
            <StatItem label="Learning Rate" value="0.05" />
            <StatItem label="Subsample" value="0.8" />
            <StatItem label="Colsample by Tree" value="0.8" />
            <StatItem label="Cross-Validation" value="5-fold Stratified" />
            <StatItem label="Class Weighting" value="scale_pos_weight tuned" />
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, mono }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{label}</dt>
      <dd className={`font-semibold text-slate-700 dark:text-slate-200 ${mono ? 'font-mono text-xs' : ''}`}>{value}</dd>
    </div>
  )
}

function StatItem({ label, value }) {
  return (
    <li className="flex items-center justify-between py-2.5">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-semibold text-slate-700 dark:text-slate-200">{value}</span>
    </li>
  )
}
