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
  Sparkles
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
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen select-none">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-6 h-6 text-slate-950 font-bold" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-tight">WhatsMiau<span className="text-emerald-400">2</span></h1>
          <p className="text-xs text-slate-400 font-medium">ACI Omnichannel CRM</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-9 h-9 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-sm">
            AC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">Admin ACI</p>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Evolution Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
