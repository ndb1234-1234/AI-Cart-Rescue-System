import React from 'react'
import { ShoppingCart, Github, Mail } from 'lucide-react'
import { APP_NAME } from '../utils/constants'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <ShoppingCart size={15} className="text-primary-500" />
          <span>© {new Date().getFullYear()} {APP_NAME}. Powered by XGBoost & React.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary-500 transition-colors" aria-label="GitHub">
            <Github size={17} />
          </a>
          <a href="mailto:contact@example.com" className="hover:text-primary-500 transition-colors" aria-label="Email">
            <Mail size={17} />
          </a>
        </div>
      </div>
    </footer>
  )
}
