import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Sparkles, BarChart3, Info, ChevronsLeft, ChevronsRight, Github } from 'lucide-react'

const ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, end: true },
  { name: 'Prediction', path: '/prediction', icon: Sparkles },
  { name: 'Model Insights', path: '/insights', icon: BarChart3 },
  { name: 'About', path: '/about', icon: Info },
]

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? 'w-[76px]' : 'w-64'
      }`}
    >
      <div className="flex-1 py-6 px-3 flex flex-col gap-1">
        {!collapsed && (
          <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation
          </p>
        )}
        {ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
            title={collapsed ? item.name : undefined}
          >
            <item.icon size={18} className="shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
        {!collapsed && (
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Github size={17} />
            <span>Source & Docs</span>
          </a>
        )}
        <button
          onClick={onToggle}
          className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
