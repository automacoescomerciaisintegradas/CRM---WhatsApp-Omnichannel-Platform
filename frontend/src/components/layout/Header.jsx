import React from 'react';
import { Bell, Search, ShieldCheck, Radio, Sparkles } from 'lucide-react';

export default function Header({ title }) {
  return (
    <header className="h-16 glass-blur-top px-8 flex items-center justify-between z-20">
      <div className="flex items-center gap-5">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h2>

        {/* Anel Orbital com Indicador Operacional */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/10">
          <div className="orbital-ring w-6 h-6">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00B8D9] animate-pulse"></span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-400/25 shadow-[0_0_12px_rgba(0,184,217,0.15)] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Stack Operacional Edge
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar com Halo Focus */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar leads, mensagens, PIX..."
            className="w-72 bg-slate-950/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-sm"
          />
        </div>

        {/* Notification Button com Halo */}
        <button className="w-10 h-10 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-cyan-400/40 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-sm relative group">
          <Bell className="w-4 h-4 group-hover:scale-110 transition-transform text-slate-300 group-hover:text-cyan-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute top-2 right-2 ring-2 ring-slate-900 shadow-[0_0_8px_#00B8D9]"></span>
        </button>

        {/* Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600/15 border border-blue-500/30 text-xs font-medium text-blue-300">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Cloudflare Edge</span>
        </div>
      </div>
    </header>
  );
}
