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
    <aside className="w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col h-screen select-none relative z-30 transition-colors">
      {/* Brand Header */}
      <div className="p-6 border-b border-[var(--border-color)] flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[var(--primary-main)] to-[var(--primary-light)] flex items-center justify-center shadow-lg p-0.5">
          <div className="w-full h-full bg-[var(--bg-sidebar)] rounded-[14px] flex items-center justify-center">
            <Zap className="w-5 h-5 text-[var(--primary-light)] font-bold" />
          </div>
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1">
            WhatsMiau<span className="text-[var(--primary-light)] text-xl">2</span>
          </h1>
          <p className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase">Manager CRM</p>
        </div>
      </div>

      {/* Nav List with Professional Active States */}
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
                    ? 'bg-[var(--primary-main)] text-white shadow-[var(--shadow-button)] font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'
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
      <div className="p-4 border-t border-[var(--border-color)] bg-black/20">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5 border border-white/5">
          <div className="orbital-ring w-9 h-9 flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-[var(--primary-main)] flex items-center justify-center font-bold text-white text-xs shadow-md">
              AC
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Admin ACI</p>
            <p className="text-[11px] text-[var(--status-success)] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--status-success)] shadow-[0_0_6px_var(--status-success)] animate-pulse"></span>
              Evolution Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
