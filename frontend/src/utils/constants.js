export const APP_NAME = 'AI Cart Rescue System'
export const APP_TAGLINE = 'Predictive Intelligence for Shopping Cart Abandonment'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
export const FORCE_MOCK = (import.meta.env.VITE_FORCE_MOCK || 'false').toLowerCase() === 'true'

export const PREDICT_ENDPOINT = '/predict'

export const NAV_LINKS = [
  { name: 'Dashboard', path: '/' },
  { name: 'Prediction', path: '/prediction' },
  { name: 'Model Insights', path: '/insights' },
  { name: 'About', path: '/about' },
]

export const FORM_FIELDS = [
  {
    name: 'hour_of_day',
    label: 'Hour of Day',
    type: 'number',
    min: 0,
    max: 23,
    step: 1,
    placeholder: 'e.g. 14',
    help: 'Hour of the session, 0–23 (24-hour format)',
  },
  {
    name: 'user_total_sessions',
    label: 'User Total Sessions',
    type: 'number',
    min: 0,
    max: 100000,
    step: 1,
    placeholder: 'e.g. 12',
    help: 'Total number of sessions by this user historically',
  },
  {
    name: 'avg_products_per_user',
    label: 'Avg. Products per User',
    type: 'number',
    min: 0,
    max: 10000,
    step: 0.01,
    placeholder: 'e.g. 4.5',
    help: 'Average number of products viewed/added per user',
  },
  {
    name: 'user_total_carts',
    label: 'User Total Carts',
    type: 'number',
    min: 0,
    max: 100000,
    step: 1,
    placeholder: 'e.g. 3',
    help: 'Total number of carts created by this user',
  },
  {
    name: 'average_session_duration_per_user',
    label: 'Avg. Session Duration (sec)',
    type: 'number',
    min: 0,
    max: 100000,
    step: 1,
    placeholder: 'e.g. 245',
    help: 'Average session duration per user, in seconds',
  },
  {
    name: 'is_weekend',
    label: 'Is Weekend?',
    type: 'select',
    options: [
      { label: 'No (Weekday)', value: 0 },
      { label: 'Yes (Weekend)', value: 1 },
    ],
    help: 'Whether the session occurred on a weekend',
  },
]

export const RISK_LEVELS = {
  HIGH: { label: 'High Risk', color: '#ef4444', bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400', ring: 'ring-red-500/30' },
  MEDIUM: { label: 'Medium Risk', color: '#f59e0b', bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-500/30' },
  LOW: { label: 'Low Risk', color: '#10b981', bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500/30' },
}
