import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles,
  Smartphone
} from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTickets: 12,
    openTickets: 3,
    pendingTickets: 9,
    totalContacts: 680,
    totalConnections: 1
  });

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/20 p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            ACI Omnichannel IA v1.0 Ativo
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Central de Atendimento & Inteligência de Vendas
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Seus agentes autônomos e instâncias WhatsApp estão sincronizados com Chatwoot e Evolution API em tempo real.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Total de Leads / Contatos</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{stats.totalContacts}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              +680 <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Sincronizados via WhatsApp Baileys</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Atendimentos Abertos</span>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{stats.openTickets}</span>
            <span className="text-xs font-medium text-blue-400">Filas ativas</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Respostas automáticas conduzidas por IA</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Instâncias WhatsApp</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">1 Conectada</span>
            <span className="text-xs font-medium text-emerald-400">OPEN</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Número: +55 (88) 9215-67214</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Taxa de Resolução</span>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">94.8%</span>
            <span className="text-xs font-medium text-emerald-400">+4.2%</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Triagem e handoff automatizados</p>
        </div>
      </div>

      {/* Main Panel: Recent Activity & Live Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-white">Fluxo de Conversas em Tempo Real</h3>
              <p className="text-xs text-slate-400 mt-0.5">Mensagens recebidas e roteadas nas últimas horas</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Stream
            </span>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-slate-800 rounded-lg bg-slate-950/40">
            <div className="text-center space-y-2">
              <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm text-slate-300 font-medium">680 leads sincronizados no banco de dados CRM</p>
              <p className="text-xs text-slate-500">Monitorando eventos de webhook via Evolution API e Chatwoot</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Status dos Agentes de IA</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-slate-200">ACI Assistente IA</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-xs text-slate-400">Atendimento 24/7 integrado via MCP ao Chatwoot</p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-900">
                <span>Modelo: GPT-4o-mini</span>
                <span>Latência: 420ms</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-slate-200">Auto-Qualificador de Leads</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-xs text-slate-400">Extração contínua de telefone, nome e intenção de compra</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
