import React from 'react'
import { motion } from 'framer-motion'
import { Workflow, Layers3, Rocket, ShoppingCart, Database, Cpu, Server, Monitor } from 'lucide-react'

const WORKFLOW_STEPS = [
  { title: 'Data Collection', desc: 'Raw e-commerce session and cart events are captured (clicks, sessions, cart actions, timestamps).' },
  { title: 'Feature Engineering', desc: 'Six behavioral features are derived per user: hour of day, session counts, avg. products, cart counts, session duration, weekend flag.' },
  { title: 'Model Training', desc: 'An XGBoost classifier is trained and tuned via cross-validation, optimizing ROC-AUC on held-out data.' },
  { title: 'Model Serialization', desc: 'The trained model is exported as cart_rescue_final_optimized.pkl for serving.' },
  { title: 'API Serving', desc: 'A Flask/FastAPI backend loads the .pkl file and exposes a POST /predict endpoint.' },
  { title: 'Frontend Prediction', desc: 'This React dashboard collects input features and displays the abandonment risk in real time.' },
]

const TECH_STACK = [
  { group: 'Frontend', icon: Monitor, items: ['React 18', 'Vite', 'Tailwind CSS', 'Axios', 'Recharts', 'Framer Motion', 'React Router'] },
  { group: 'Backend', icon: Server, items: ['Flask / FastAPI', 'Python 3.10+', 'REST API'] },
  { group: 'Machine Learning', icon: Cpu, items: ['XGBoost', 'scikit-learn', 'pandas', 'NumPy', 'joblib / pickle'] },
  { group: 'Data', icon: Database, items: ['E-commerce session logs', 'Engineered behavioral features'] },
]

const FUTURE_SCOPE = [
  'Real-time streaming predictions via WebSockets for live dashboards.',
  'Automated retention actions (email/SMS/discount triggers) on high-risk predictions.',
  'Model monitoring & drift detection with automated retraining pipelines.',
  'A/B testing framework to measure the impact of interventions on abandoned carts.',
  'Multi-model ensemble (XGBoost + LightGBM + Neural Net) for improved accuracy.',
  'User-level explainability using SHAP values surfaced directly in the UI.',
]

export default function About() {
  return (
    <div className="flex flex-col gap-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-1">
          About the Project
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Cart Rescue System
        </h1>
      </motion.div>

      {/* Project explanation */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-base p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart size={19} className="text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">What This Project Does</h2>
        </div>
        <p className="text-sm sm:text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">
          Online retailers lose a significant share of revenue to shopping cart abandonment. The{' '}
          <strong>AI Cart Rescue System</strong> uses a trained <strong>XGBoost</strong> machine learning
          model to predict — in real time — whether a given customer session is likely to end in cart
          abandonment or a completed purchase. Store operators and retention teams can use this signal to
          trigger timely interventions (discounts, reminders, live chat) exactly when they matter most,
          turning at-risk sessions into recovered revenue.
        </p>
      </motion.section>

      {/* Workflow */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-base p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Workflow size={19} className="text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">End-to-End Workflow</h2>
        </div>
        <div className="relative">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <div className="flex flex-col gap-6">
            {WORKFLOW_STEPS.map((step, idx) => (
              <div key={step.title} className="flex gap-4 relative">
                <div className="shrink-0 h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold z-10">
                  {idx + 1}
                </div>
                <div className="pt-0.5">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{step.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Technology stack */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-base p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Layers3 size={19} className="text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Technology Stack</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {TECH_STACK.map((group) => (
            <div key={group.group} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
              <div className="flex items-center gap-2 mb-3">
                <group.icon size={16} className="text-primary-600 dark:text-primary-400" />
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{group.group}</p>
              </div>
              <ul className="flex flex-col gap-1.5">
                {group.items.map((item) => (
                  <li key={item} className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-primary-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Future scope */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-base p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Rocket size={19} className="text-primary-600 dark:text-primary-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Future Scope</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FUTURE_SCOPE.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div className="h-6 w-6 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Rocket size={13} className="text-primary-500" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
