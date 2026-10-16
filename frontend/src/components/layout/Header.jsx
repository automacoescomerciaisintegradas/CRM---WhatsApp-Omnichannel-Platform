import React from 'react';
import { Bell, Search, ShieldCheck } from 'lucide-react';

export default function Header({ title }) {
  return (
    <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Stack Operacional
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar leads, mensagens..."
            className="w-64 bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <button className="w-9 h-9 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-300 hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 ring-2 ring-slate-900"></span>
        </button>
      </div>
    </header>
  );
}
