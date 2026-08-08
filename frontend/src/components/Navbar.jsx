import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Moon, Sun, ShoppingCart, Activity } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { APP_NAME, NAV_LINKS } from '../utils/constants'

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
              onClick={() => {
                setMobileOpen((v) => !v)
                onMenuClick?.()
              }}
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-600/30">
                <ShoppingCart size={18} className="text-white" strokeWidth={2.5} />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulseSlow" />
              </div>
              <div className="leading-tight">
                <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">{APP_NAME}</p>
                <p className="hidden sm:block text-[11px] font-medium text-slate-500 dark:text-slate-400">Enterprise ML Console</p>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary-700 dark:text-primary-300'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute left-3 right-3 -bottom-[1px] h-[2px] bg-primary-600 rounded-full"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 border border-emerald-200 dark:border-emerald-500/20">
              <Activity size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Model Active</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex flex-col gap-1 bg-white/90 dark:bg-slate-900/90"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300'
                    : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </motion.nav>
      )}
    </header>
  )
}
