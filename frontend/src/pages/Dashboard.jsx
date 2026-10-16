import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Smartphone, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Activity,
  CreditCard,
  Send,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function Dashboard() {
  const [stats] = useState({
    totalTickets: 12,
    openTickets: 3,
    pendingTickets: 9,
    totalContacts: 680,
    totalConnections: 1,
    conversionRate: '94.8%',
    volumePix: 'R$ 14.850'
  });

  return (
    <div className="container overflow-y-auto h-[calc(100vh-var(--header-height))]">
      {/* ============================================
         INSTANCE HERO CARD
         ============================================ */}
      <div className="instance-hero">
        <div className="instance-hero-grid">
          <div>
            <div className="instance-status-badge">
              <span className="status-dot"></span>
              <span>Instância Conectada • Evolution Baileys v2.3.7</span>
            </div>
            <h1 className="instance-name-large text-white">
              ACI WhatsApp Omnichannel
            </h1>
            <div className="instance-details">
              <p>JID: <span className="font-mono text-cyan-200">5588921567214@s.whatsapp.net</span></p>
              <p>Chatwoot Inbox ID: <span className="font-semibold text-white">#2 (aci)</span> • 680 Leads Sincronizados</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 self-center">
            <a 
              href="https://chatwoot.iau2.com.br" 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-contained bg-white text-blue-900 hover:bg-slate-100 shadow-lg"
            >
              <span>Abrir Chatwoot</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
            <a 
              href="https://evolution.iau2.com.br" 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-outlined border-white/40 text-white hover:bg-white/10"
            >
              <span>Evolution API</span>
            </a>
          </div>
        </div>
      </div>

      {/* ============================================
         STATS GRID
         ============================================ */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalContacts}</div>
          <div className="stat-label">Total de Leads / Contatos</div>
          <div className="mt-2 text-xs text-[var(--status-success)] font-semibold flex items-center justify-center gap-1">
            <span>+680 sincronizados</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value text-blue-500">{stats.openTickets}</div>
          <div className="stat-label">Atendimentos Abertos</div>
          <div className="mt-2 text-xs text-[var(--text-secondary)] font-medium">
            3 em fila ativa com IA
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value text-[var(--status-success)]">{stats.conversionRate}</div>
          <div className="stat-label">Taxa de Conversão</div>
          <div className="mt-2 text-xs text-[var(--status-success)] font-medium">
            Triagem automatizada
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value text-[var(--status-info)]">{stats.volumePix}</div>
          <div className="stat-label">Faturamento PIX Mercado Pago</div>
          <div className="mt-2 text-xs text-[var(--status-info)] font-medium">
            Webhook instantâneo
          </div>
        </div>
      </div>

      {/* ============================================
         CARDS LAYOUT (GRID 3)
         ============================================ */}
      <div className="grid-3">
        {/* Main Feed Card */}
        <div className="card col-span-2">
          <div className="card-header">
            <div>
              <h3 className="card-title">Fluxo de Conversas & CRM em Tempo Real</h3>
              <p className="caption">Eventos de mensagens, leads e cobranças processadas via Edge</p>
            </div>
            <span className="badge badge-info">
              <Activity className="w-3.5 h-3.5" />
              Live Pipeline
            </span>
          </div>

          <div className="p-6 border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-input)] text-center space-y-3">
            <div className="orbital-ring w-12 h-12 mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-[var(--primary-light)]" />
            </div>
            <p className="body1 font-semibold text-[var(--text-primary)]">
              680 leads sincronizados no banco de dados CRM
            </p>
            <p className="caption max-w-md mx-auto">
              Monitorando webhooks de mensagens WhatsApp (Baileys), pagamentos PIX Mercado Pago e disparos via Go CRM (:8081).
            </p>
          </div>
        </div>

        {/* AI Assistants Status Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Agentes de IA</h3>
              <p className="caption">Sistemas autônomos</p>
            </div>
            <span className="badge badge-success">Ativos</span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Atendente IA ACI
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-success)] animate-pulse"></span>
              </div>
              <p className="caption">Atendimento 24/7 integrado ao Chatwoot e WhatsApp</p>
              <div className="pt-2 flex items-center justify-between text-xs text-[var(--text-secondary)] border-t border-[var(--border-color)] font-mono">
                <span>GPT-4o-mini</span>
                <span className="text-[var(--status-info)]">420ms</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  Qualificador de Leads
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--status-success)]"></span>
              </div>
              <p className="caption">Enriquecimento contínuo de dados e temperatura</p>
              <div className="pt-2 flex items-center justify-between text-xs text-[var(--text-secondary)] border-t border-[var(--border-color)] font-mono">
                <span>Score: 9.4/10</span>
                <span className="text-[var(--status-success)]">OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
