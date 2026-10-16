import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Contacts from './pages/Contacts';
import Kanban from './pages/Kanban';
import Connections from './pages/Connections';
import AIAgents from './pages/AIAgents';

const titles = {
  '/': 'Dashboard de Operações',
  '/tickets': 'Atendimento ao Cliente (WhatsApp Live)',
  '/contacts': 'Gestão de Leads & Contatos',
  '/kanban': 'Funil de Vendas (Kanban CRM)',
  '/connections': 'Instâncias do WhatsApp',
  '/ai-agents': 'Agentes Autônomos de IA',
  '/campaigns': 'Campanhas & Disparos em Massa',
  '/settings': 'Configurações da Plataforma'
};

export default function App() {
  const location = useLocation();
  const title = titles[location.pathname] || 'WhatsMiau2 CRM';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/ai-agents" element={<AIAgents />} />
            <Route path="/campaigns" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
