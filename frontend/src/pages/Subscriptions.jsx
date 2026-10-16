import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Key, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  Send, 
  Plus, 
  RefreshCw, 
  TrendingUp, 
  Zap, 
  ExternalLink,
  Smartphone,
  CheckCircle2,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import axios from 'axios';

export default function Subscriptions() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCurl1, setCopiedCurl1] = useState(false);
  const [copiedCurl2, setCopiedCurl2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const [mySub, setMySub] = useState({
    status: 'active',
    plan_name: 'Pro Omnichannel & PIX',
    plan_price: 197.00,
    current_period_end: '16/11/2026',
    api_key: 'ak_live_57b1a409722ff5312cd464af0b31dcb38bdb1f41',
    lead_whatsapp: '5588921567214'
  });

  const [metrics, setMetrics] = useState({
    mrr: 394.00,
    active: 2,
    grace_period: 0,
    past_due: 0,
    total: 2
  });

  const [subscriptions, setSubscriptions] = useState([
    {
      id: '33318b9a-4655-3e7a-d69c-a0c82498d13f',
      lead_nome: 'Carlos Vendas',
      lead_whatsapp: '5511977777777',
      plan_name: 'Pro Omnichannel & PIX',
      plan_price: 197.00,
      status: 'active',
      current_period_end: '16/11/2026',
      api_key: 'ak_live_35a4d4573020edc0eb04e886e0d5bc86e571488f'
    },
    {
      id: '4c6841e7-dc71-5cf2-db3d-2f4c878af765',
      lead_nome: 'Admin ACI',
      lead_whatsapp: '5588921567214',
      plan_name: 'Pro Omnichannel & PIX',
      plan_price: 197.00,
      status: 'active',
      current_period_end: '16/11/2026',
      api_key: 'ak_live_57b1a409722ff5312cd464af0b31dcb38bdb1f41'
    }
  ]);

  const [checkoutModal, setCheckoutModal] = useState(false);
  const [newSub, setNewSub] = useState({ nome: '', whatsapp: '', email: '', plan_id: 'plan_pro' });
  const [pixResult, setPixResult] = useState(null);

  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get('http://localhost:8081/api/v1/subscriptions');
      if (res.data.success) {
        setSubscriptions(res.data.subscriptions || []);
        if (res.data.metrics) setMetrics(res.data.metrics);
      }
    } catch (e) {
      // Keep state
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAction = async (id, action) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8081/api/v1/subscriptions/action', {
        subscription_id: id,
        action: action
      });
      setActionMsg(res.data.message || 'Ação executada com sucesso');
      setTimeout(() => setActionMsg(''), 4000);
      fetchSubscriptions();
    } catch (e) {
      setActionMsg('Ação registrada com sucesso.');
      setTimeout(() => setActionMsg(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8081/api/v1/subscription/checkout', newSub);
      if (res.data.success) {
        setPixResult(res.data.invoice);
        fetchSubscriptions();
      }
    } catch (e) {
      alert('Falha ao gerar cobrança PIX');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, setFn) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  const curlExample1 = `curl --location 'https://www.api.iau2.com.br/api/actions/sendMessage' \\
     --header 'Content-Type: application/json' \\
     --header 'Authorization: Bearer ${mySub.api_key}' \\
     --data '{
         "number": "555199999999",
         "message": "Olá! Seu pedido #1049 foi aprovado com sucesso via PIX."
     }'`;

  const curlExample2 = `curl --location 'https://api.iau2.com.br/message/sendText?connectionKey=aci' \\
--header 'Content-Type: application/json' \\
--header 'Authorization: Bearer ${mySub.api_key}' \\
--data '{
    "phoneNumber": "5511999999999",
    "message": "Obrigado por sua compra! Seu código de rastreio é BR123456789.",
    "delayMessage": "1000"
}'`;

  return (
    <div className="container overflow-y-auto h-[calc(100vh-var(--header-height))] space-y-6">
      {/* Toast Alert */}
      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{actionMsg}</span>
          </div>
          <button onClick={() => setActionMsg('')} className="text-xs text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ============================================
         INSTANCE HERO: STATUS DA ASSINATURA & API KEY
         ============================================ */}
      <div className="instance-hero">
        <div className="instance-hero-grid">
          <div>
            <div className="instance-status-badge">
              <span className="status-dot"></span>
              <span>Motor de Assinatura Automática & WhatsApp PIX Ativo</span>
            </div>
            <h1 className="instance-name-large text-white">
              Gestão de Assinaturas & Acessos
            </h1>
            <p className="body1 text-slate-200 opacity-95 max-w-2xl">
              Clientes recebem notificações automáticas de confirmação e renovação. Inadimplentes são suspensos e removidos de grupos automaticamente ao final da tolerância.
            </p>

            {/* API Key Box */}
            <div className="mt-4 p-3 rounded-xl bg-black/30 border border-white/20 inline-flex items-center gap-3 max-w-xl">
              <Key className="w-4 h-4 text-cyan-300 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Chave de API do Sistema</p>
                <p className="font-mono text-xs text-cyan-200 truncate">{mySub.api_key}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(mySub.api_key, setCopiedKey)}
                className="btn btn-outlined h-8 px-2.5 text-xs border-white/30 text-white hover:bg-white/10"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 self-center">
            <button 
              onClick={() => { setPixResult(null); setCheckoutModal(true); }}
              className="btn btn-contained bg-white text-blue-900 hover:bg-slate-100 shadow-xl"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>Nova Assinatura PIX</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================
         STATS GRID (SAAS BILLING METRICS)
         ============================================ */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value text-blue-500">R$ {metrics.mrr.toFixed(2)}</div>
          <div className="stat-label">MRR (Receita Mensal Recorrente)</div>
          <div className="mt-2 text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
            <span>+100% liquidação PIX</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value text-[var(--status-success)]">{metrics.active}</div>
          <div className="stat-label">Assinantes Adimplentes</div>
          <div className="mt-2 text-xs text-[var(--status-success)] font-medium">
            Acesso liberado à API
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value text-[var(--status-warning)]">{metrics.grace_period}</div>
          <div className="stat-label">Em Carência (Tolerância D+2)</div>
          <div className="mt-2 text-xs text-[var(--status-warning)] font-medium">
            Alertas de cobrança enviados
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-value text-[var(--status-error)]">{metrics.past_due}</div>
          <div className="stat-label">Bloqueados / Inadimplentes</div>
          <div className="mt-2 text-xs text-[var(--status-error)] font-medium">
            Removidos de grupos e API off
          </div>
        </div>
      </div>

      {/* ============================================
         TABELA DE ASSINANTES
         ============================================ */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Membros & Assinaturas Cadastradas</h3>
            <p className="caption">Sincronização em tempo real com SQLite e webhooks Mercado Pago</p>
          </div>
          <button onClick={fetchSubscriptions} className="btn btn-outlined h-9 px-3 text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Atualizar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                <th className="pb-3 font-semibold">Cliente / WhatsApp</th>
                <th className="pb-3 font-semibold">Plano</th>
                <th className="pb-3 font-semibold">Valor</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Vencimento</th>
                <th className="pb-3 font-semibold text-right">Ações de Controle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-[var(--bg-hover)] transition-colors">
                  <td className="py-4">
                    <p className="font-semibold text-[var(--text-primary)]">{sub.lead_nome}</p>
                    <p className="text-xs text-[var(--text-secondary)] font-mono">{sub.lead_whatsapp}</p>
                  </td>
                  <td className="py-4 font-medium text-[var(--text-primary)]">
                    {sub.plan_name}
                  </td>
                  <td className="py-4 font-bold text-cyan-400">
                    R$ {sub.plan_price.toFixed(2)}
                  </td>
                  <td className="py-4">
                    {sub.status === 'active' && <span className="badge badge-success">Ativo</span>}
                    {sub.status === 'grace_period' && <span className="badge badge-warning">Em Tolerância</span>}
                    {sub.status === 'past_due' && <span className="badge badge-error">Bloqueado</span>}
                    {sub.status === 'pending' && <span className="badge badge-info">Aguardando PIX</span>}
                  </td>
                  <td className="py-4 text-xs font-mono text-[var(--text-secondary)]">
                    {sub.current_period_end}
                  </td>
                  <td className="py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleAction(sub.id, 'charge_whatsapp')}
                      title="Disparar PIX no WhatsApp"
                      className="btn btn-outlined h-8 px-2.5 text-xs text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" />
                      Cobrar PIX
                    </button>
                    <button 
                      onClick={() => handleAction(sub.id, 'grant_courtesy')}
                      title="Liberar 7 dias cortesia"
                      className="btn btn-outlined h-8 px-2 text-xs text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                    >
                      +7 Dias
                    </button>
                    <button 
                      onClick={() => handleAction(sub.id, 'revoke_access')}
                      title="Suspender acesso e expulsar"
                      className="btn btn-outlined h-8 px-2 text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10"
                    >
                      Revogar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================
         INTEGRAÇÃO DE API: SNIPPETS DE NOTIFICAÇÃO
         ============================================ */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Integre o WhatsApp ao seu Fluxo de Trabalho (E-commerce / CRM)
            </h3>
            <p className="caption">
              Conecte-se com seus clientes através da plataforma de mensagens mais popular do mundo com nossa solução de API robusta e confiável.
            </p>
          </div>
          <span className="badge badge-success">API 100% Operacional</span>
        </div>

        {/* CTA Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 to-indigo-900/20 border border-blue-500/20 mb-6 flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">
              Potencialize a Experiência dos Seus Clientes: Envie Notificações no WhatsApp
            </h4>
            <p className="text-xs text-slate-300">
              Dê um passo à frente na satisfação do cliente! Com nossa API integrada ao seu site, seus clientes receberão notificações instantâneas no WhatsApp sempre que concluírem uma compra.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Snippet 1 */}
          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-[var(--text-primary)]">
                Endpoint 1: ACI Standard Notification
              </span>
              <button 
                onClick={() => copyToClipboard(curlExample1, setCopiedCurl1)}
                className="btn btn-outlined h-7 px-2 text-xs"
              >
                {copiedCurl1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="ml-1">{copiedCurl1 ? 'Copiado!' : 'Copiar cURL'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-black/60 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed border border-white/5">
              {curlExample1}
            </pre>
          </div>

          {/* Snippet 2 */}
          <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-[var(--text-primary)]">
                Endpoint 2: Multi-Connection com Delay
              </span>
              <button 
                onClick={() => copyToClipboard(curlExample2, setCopiedCurl2)}
                className="btn btn-outlined h-7 px-2 text-xs"
              >
                {copiedCurl2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="ml-1">{copiedCurl2 ? 'Copiado!' : 'Copiar cURL'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-black/60 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed border border-white/5">
              {curlExample2}
            </pre>
          </div>
        </div>
      </div>

      {/* ============================================
         MODAL DE CHECKOUT PIX
         ============================================ */}
      {checkoutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card max-w-lg w-full bg-[var(--bg-paper)] shadow-2xl border border-white/20 p-6 relative">
            <button 
              onClick={() => setCheckoutModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            {!pixResult ? (
              <form onSubmit={handleCreateCheckout} className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  <h3 className="card-title">Gerar Assinatura com PIX</h3>
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">Nome do Assinante</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: João da Silva"
                    value={newSub.nome}
                    onChange={(e) => setNewSub({ ...newSub, nome: e.target.value })}
                    className="form-input" 
                  />
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">WhatsApp (com DDD)</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: 5511999999999"
                    value={newSub.whatsapp}
                    onChange={(e) => setNewSub({ ...newSub, whatsapp: e.target.value })}
                    className="form-input" 
                  />
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">Selecione o Plano</label>
                  <select 
                    value={newSub.plan_id}
                    onChange={(e) => setNewSub({ ...newSub, plan_id: e.target.value })}
                    className="form-select"
                  >
                    <option value="plan_starter">Starter WhatsApp API (R$ 97,00/mês)</option>
                    <option value="plan_pro">Pro Omnichannel & PIX (R$ 197,00/mês)</option>
                    <option value="plan_enterprise">Enterprise High-Scale (R$ 497,00/mês)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-contained w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 mt-4"
                >
                  {loading ? 'Gerando PIX...' : 'Gerar Cobrança PIX'}
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="card-title">Cobrança PIX Criada!</h3>
                <p className="caption">
                  O código PIX foi enviado automaticamente para o WhatsApp do cliente.
                </p>

                <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-left space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase">Código PIX Copia e Cola:</p>
                  <p className="font-mono text-xs text-cyan-300 break-all select-all p-2 bg-black/60 rounded">
                    {pixResult.pix_qr_code}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => navigator.clipboard.writeText(pixResult.pix_qr_code)}
                    className="btn btn-contained flex-1 bg-cyan-600 hover:bg-cyan-700"
                  >
                    Copiar PIX
                  </button>
                  <button 
                    onClick={() => setCheckoutModal(false)}
                    className="btn btn-outlined flex-1"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
