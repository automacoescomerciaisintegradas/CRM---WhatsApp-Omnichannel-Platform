import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles,
  Smartphone,
  Zap,
  Activity,
  CreditCard,
  ShieldCheck
} from 'lucide-react';

export default function Dashboard() {
  const [stats] = useState({
    totalTickets: 12,
    openTickets: 3,
    pendingTickets: 9,
    totalContacts: 680,
    totalConnections: 1,
    conversionRate: 94.8,
    pixProcessed: 14850.00
  });

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-[calc(100vh-4rem)]">
      {/* Top Welcome Banner com Glow Vibrante e Anel Orbital */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0052CC]/30 via-slate-900/90 to-[#00B8D9]/20 border border-cyan-400/30 p-8 shadow-[0_10px_35px_-5px_rgba(0,184,217,0.15)] backdrop-blur-xl">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden md:block">
          <div className="w-64 h-64 rounded-full border-2 border-dashed border-cyan-400 animate-[spin_30s_linear_infinite]"></div>
          <div className="w-48 h-48 rounded-full border border-blue-400 absolute inset-8 animate-[spin_18s_linear_infinite_reverse]"></div>
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600/20 to-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,184,217,0.2)]">
            <span className="orbital-ring w-3 h-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00B8D9]"></span>
            </span>
            <span>ACI Omnichannel & Mercado Pago PIX Ativo</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Central de Atendimento & Inteligência de Vendas
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Seus agentes autônomos e instâncias WhatsApp estão sincronizados com Chatwoot, Evolution API e banco SQLite CRM em alta fidelidade.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid com Halo e Microanimações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Contatos */}
        <div className="card-halo p-6 group cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Total de Leads / Contatos</span>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(0,184,217,0.2)]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats.totalContacts}</span>
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-0.5">
              +680 <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            Sincronizados via WhatsApp Baileys
          </p>
        </div>

        {/* Card 2: Tickets Abertos */}
        <div className="card-halo card-halo-blue p-6 group cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Atendimentos Abertos</span>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(38,132,255,0.2)]">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats.openTickets}</span>
            <span className="text-xs font-semibold text-blue-400">Filas ativas</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Respostas imediatas conduzidas por IA
          </p>
        </div>

        {/* Card 3: WhatsApp Instâncias */}
        <div className="card-halo p-6 group cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Instâncias WhatsApp</span>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(54,179,126,0.2)]">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">1 Conectada</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              OPEN
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            +55 (88) 9215-67214
          </p>
        </div>

        {/* Card 4: Faturamento PIX */}
        <div className="card-halo p-6 group cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Volume PIX Mercado Pago</span>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(101,84,192,0.2)]">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">R$ 14.850</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              +18.4% <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            Webhook instantâneo configurado
          </p>
        </div>
      </div>

      {/* Main Panel: Real-Time Traffic & AI Agent Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-halo p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white text-base">Fluxo de Conversas em Tempo Real</h3>
              <p className="text-xs text-slate-400 mt-0.5">Mensagens recebidas e roteadas nas últimas horas via Baileys</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 shadow-[0_0_10px_rgba(0,184,217,0.15)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              Live Pipeline
            </span>
          </div>

          <div className="h-64 flex items-center justify-center border border-dashed border-cyan-500/20 rounded-xl bg-slate-950/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
            <div className="text-center space-y-3 relative z-10">
              <div className="orbital-ring w-16 h-16 mx-auto mb-2">
                <TrendingUp className="w-8 h-8 text-cyan-400" />
              </div>
              <p className="text-base text-slate-200 font-bold">680 leads sincronizados no banco de dados CRM</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Monitorando eventos de webhook via Evolution API, Chatwoot e rotas Go CRM em `:8081`
              </p>
            </div>
          </div>
        </div>

        {/* AI Agents Card */}
        <div className="card-halo p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Status dos Agentes de IA</h3>
            <span className="text-xs text-slate-400 font-medium">Auto-pilot</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-2 hover:border-cyan-400/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  ACI Assistente IA
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00B8D9] animate-pulse"></span>
              </div>
              <p className="text-xs text-slate-400">Atendimento 24/7 integrado via MCP ao Chatwoot</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 font-mono">
                <span>Modelo: GPT-4o-mini</span>
                <span className="text-cyan-400">Latência: 420ms</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-2 hover:border-blue-400/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Qualificador de Leads
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_#2684FF]"></span>
              </div>
              <p className="text-xs text-slate-400">Extração contínua de telefone, nome e intenção de compra</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 font-mono">
                <span>Score Médio: 9.2/10</span>
                <span className="text-emerald-400">Status: Ativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
