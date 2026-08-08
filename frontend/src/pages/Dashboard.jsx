import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Database, Gauge, Percent, TrendingUp, History, Server, Clock } from 'lucide-react'
import DashboardCard from '../components/DashboardCard.jsx'
import { MOCK_MODEL_STATUS, MOCK_DATASET_STATS, generateMockHistory } from '../utils/mockData.js'
import { checkBackendHealth } from '../services/api.js'
import { formatPercent, formatDate, classNames } from '../utils/helpers.js'
import { APP_NAME, APP_TAGLINE } from '../utils/constants.js'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [backendOnline, setBackendOnline] = useState(null)
  const [history] = useState(() => generateMockHistory())

  useEffect(() => {
    let mounted = true
    checkBackendHealth().then((res) => {
      if (mounted) setBackendOnline(res.online)
    })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-1">
          Overview
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {APP_NAME}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">{APP_TAGLINE}</p>
      </motion.div>

      {/* System overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard
          title="Model Status"
          value={backendOnline ? 'Live Backend' : 'Mock Mode'}
          subtitle={backendOnline ? 'Connected to Flask API' : 'Backend not detected — using mock data'}
          icon={Server}
          accent={backendOnline ? 'success' : 'warning'}
          delay={0}
        />
        <DashboardCard
          title="ROC-AUC Score"
          value={MOCK_MODEL_STATUS.rocAuc.toFixed(3)}
          subtitle="On held-out test set"
          icon={TrendingUp}
          accent="primary"
          trend={{ direction: 'up', value: '+0.021 vs v1.2' }}
          delay={0.05}
        />
        <DashboardCard
          title="Model Accuracy"
          value={formatPercent(MOCK_MODEL_STATUS.accuracy, 1)}
          subtitle={`Precision ${formatPercent(MOCK_MODEL_STATUS.precision, 0)} · Recall ${formatPercent(MOCK_MODEL_STATUS.recall, 0)}`}
          icon={Gauge}
          accent="success"
          delay={0.1}
        />
        <DashboardCard
          title="Dataset Records"
          value={MOCK_DATASET_STATS.totalRecords.toLocaleString()}
          subtitle={`${MOCK_DATASET_STATS.totalFeatures} engineered features`}
          icon={Database}
          accent="primary"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Model status card (detailed) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-base p-6 xl:col-span-1"
        >
          <div className="flex items-center gap-2 mb-5">
            <Server size={18} className="text-primary-600 dark:text-primary-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">Model Status</h3>
          </div>
          <div className="flex flex-col gap-3.5 text-sm">
            <Row label="Model File" value={MOCK_MODEL_STATUS.modelName} mono />
            <Row label="Algorithm" value={MOCK_MODEL_STATUS.algorithm} />
            <Row label="Version" value={MOCK_MODEL_STATUS.version} />
            <Row label="Last Trained" value={MOCK_MODEL_STATUS.lastTrained} />
            <Row
              label="Connection"
              value={
                backendOnline === null ? 'Checking...' : backendOnline ? 'Online' : 'Offline (Mock)'
              }
              badgeColor={backendOnline ? 'success' : 'warning'}
            />
          </div>
          <Link
            to="/prediction"
            className="btn-primary w-full mt-6 justify-center"
          >
            Run a Prediction
          </Link>
        </motion.div>

        {/* Dataset statistics */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card-base p-6 xl:col-span-2"
        >
          <div className="flex items-center gap-2 mb-5">
            <Database size={18} className="text-primary-600 dark:text-primary-400" />
            <h3 className="font-bold text-slate-900 dark:text-white">Dataset Statistics</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatTile label="Total Records" value={MOCK_DATASET_STATS.totalRecords.toLocaleString()} />
            <StatTile label="Training Set" value={MOCK_DATASET_STATS.trainSize.toLocaleString()} />
            <StatTile label="Test Set" value={MOCK_DATASET_STATS.testSize.toLocaleString()} />
            <StatTile label="Abandoned Rate" value={formatPercent(MOCK_DATASET_STATS.abandonedRate, 1)} accent="danger" />
            <StatTile label="Completed Rate" value={formatPercent(MOCK_DATASET_STATS.completedRate, 1)} accent="success" />
            <StatTile label="Features Used" value={MOCK_DATASET_STATS.totalFeatures} />
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Abandoned vs Completed</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
              <div
                className="h-full bg-red-500"
                style={{ width: `${MOCK_DATASET_STATS.abandonedRate * 100}%` }}
              />
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${MOCK_DATASET_STATS.completedRate * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Prediction history */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-base p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <History size={18} className="text-primary-600 dark:text-primary-400" />
          <h3 className="font-bold text-slate-900 dark:text-white">Recent Prediction History</h3>
          <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 ml-auto">
            Demo Data
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="pb-3 pr-4">#</th>
                <th className="pb-3 pr-4">Prediction</th>
                <th className="pb-3 pr-4">Probability</th>
                <th className="pb-3 pr-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                  <td className="py-3 pr-4 text-slate-400">{idx + 1}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={classNames(
                        'badge',
                        item.label === 'Abandoned'
                          ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                          : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      )}
                    >
                      {item.label}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-semibold text-slate-700 dark:text-slate-200">
                    {formatPercent(item.probability, 0)}
                  </td>
                  <td className="py-3 pr-4 text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock size={12} />
                    {formatDate(item.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

function Row({ label, value, mono, badgeColor }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      {badgeColor ? (
        <span
          className={classNames(
            'badge',
            badgeColor === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
          )}
        >
          {value}
        </span>
      ) : (
        <span className={classNames('font-semibold text-slate-700 dark:text-slate-200', mono && 'font-mono text-xs')}>
          {value}
        </span>
      )}
    </div>
  )
}

function StatTile({ label, value, accent }) {
  const accentClass = {
    danger: 'text-red-600 dark:text-red-400',
    success: 'text-emerald-600 dark:text-emerald-400',
  }[accent]

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className={classNames('text-lg font-extrabold text-slate-800 dark:text-slate-100', accentClass)}>{value}</p>
    </div>
  )
}
