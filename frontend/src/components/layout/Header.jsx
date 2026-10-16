import React, { useState, useEffect } from 'react';
import { Bell, Search, ShieldCheck, Sun, Moon, Radio, Sparkles } from 'lucide-react';

export default function Header({ title }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="header select-none">
      <div className="header-title">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>

        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-[var(--border-color)]">
          <div className="orbital-ring w-5 h-5">
            <span className="w-2 h-2 rounded-full bg-[var(--status-success)] shadow-[0_0_8px_var(--status-success)] animate-pulse"></span>
          </div>
          <span className="badge badge-success">
            <span className="status-dot"></span>
            Manager SaaS Online
          </span>
        </div>
      </div>

      <div className="header-actions">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar leads, mensagens..."
            className="w-64 h-10 pl-9 pr-4 text-sm bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:outline-none focus:border-[var(--primary-main)] focus:ring-2 focus:ring-[var(--primary-main)]/20 transition-all"
          />
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title="Alternar Tema Claro / Escuro"
          className="w-10 h-10 rounded-lg bg-[var(--bg-paper)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Notification Bell */}
        <button className="w-10 h-10 rounded-lg bg-[var(--bg-paper)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[var(--status-error)] absolute top-2 right-2 ring-2 ring-[var(--bg-paper)]"></span>
        </button>
      </div>
    </header>
  );
}
