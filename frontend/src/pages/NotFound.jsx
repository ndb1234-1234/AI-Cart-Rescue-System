import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertOctagon, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-24"
    >
      <div className="h-16 w-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-5">
        <AlertOctagon size={28} className="text-red-500" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">404</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        <Home size={16} />
        Back to Dashboard
      </Link>
    </motion.div>
  )
}
