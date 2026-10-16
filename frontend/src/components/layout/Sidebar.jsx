import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  KanbanSquare, 
  Wifi, 
  Bot, 
  Megaphone, 
  Settings,
  Sparkles,
  Zap
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Atendimento (Tickets)', path: '/tickets', icon: MessageSquare },
  { name: 'Leads & Contatos', path: '/contacts', icon: Users },
  { name: 'Kanban CRM', path: '/kanban', icon: KanbanSquare },
  { name: 'Conexões WhatsApp', path: '/connections', icon: Wifi },
  { name: 'Agentes de IA', path: '/ai-agents', icon: Bot },
  { name: 'Campanhas', path: '/campaigns', icon: Megaphone },
  { name: 'Configurações', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-xl border-r border-white/10 flex flex-col h-screen select-none relative z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0052CC] via-[#2684FF] to-[#00B8D9] flex items-center justify-center shadow-[0_0_20px_rgba(0,184,217,0.4)] p-0.5">
          <div className="w-full h-full bg-slate-950/40 rounded-[14px] flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-300 font-bold" />
          </div>
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1">
            WhatsMiau<span className="text-cyan-400 text-xl">2</span>
          </h1>
          <p className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase">Omnichannel CRM</p>
        </div>
      </div>

      {/* Nav List with Halo States */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-cyan-500/15 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_rgba(0,184,217,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 hover:translate-x-1'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile with Orbital Ring */}
      <div className="p-4 border-t border-white/10 bg-slate-950/60">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-900/60 border border-white/5">
          <div className="orbital-ring w-10 h-10 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md">
              AC
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">Admin ACI</p>
            <p className="text-[11px] text-cyan-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00B8D9] animate-pulse"></span>
              Evolution Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
