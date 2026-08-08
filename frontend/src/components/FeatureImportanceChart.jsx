import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '../context/ThemeContext'

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff']

export default function FeatureImportanceChart({ data }) {
  const { theme } = useTheme()
  const gridColor = theme === 'dark' ? '#1e293b' : '#e2e8f0'
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b'

  const sorted = [...data].sort((a, b) => a.importance - b.importance)

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 5, right: 24, left: 8, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 'dataMax + 0.05']}
          tickFormatter={(v) => `${Math.round(v * 100)}%`}
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={{ stroke: gridColor }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="feature"
          width={190}
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={{ stroke: gridColor }}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Importance']}
          contentStyle={{
            backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
            border: `1px solid ${gridColor}`,
            borderRadius: 12,
            fontSize: 13,
          }}
          cursor={{ fill: theme === 'dark' ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.06)' }}
        />
        <Bar dataKey="importance" radius={[0, 8, 8, 0]} barSize={22}>
          {sorted.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
