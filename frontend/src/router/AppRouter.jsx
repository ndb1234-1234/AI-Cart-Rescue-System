import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard.jsx'
import Prediction from '../pages/Prediction.jsx'
import Insights from '../pages/Insights.jsx'
import About from '../pages/About.jsx'
import NotFound from '../pages/NotFound.jsx'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/prediction" element={<Prediction />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
