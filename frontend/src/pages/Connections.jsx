import React, { useState } from 'react';
import { Smartphone, Plus, QrCode, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Connections() {
  const [instances] = useState([
    {
      id: 'e8baadd9-a4eb-4129-a247-870e8f7949e2',
      name: 'aci',
      phone: '+55 (88) 9215-67214',
      status: 'open',
      integration: 'WHATSAPP-BAILEYS (Evolution API v2.3.7)',
      chatwoot: 'Conectado (Inbox: aci)',
      contacts: 680
    }
  ]);

  return (
    <div className="p-8 space-y-6 overflow-y-auto h-[calc(100vh-4rem)] bg-slate-950">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Conexões WhatsApp</h2>
          <p className="text-xs text-slate-400 mt-1">Gerencie suas instâncias da Evolution API e canais ativos</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
          <Plus className="w-4 h-4" />
          Nova Conexão
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instances.map((inst) => (
          <div key={inst.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{inst.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">{inst.phone}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                CONECTADO
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex justify-between">
                <span className="text-slate-500">Motor:</span>
                <span className="font-medium text-slate-200">{inst.integration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chatwoot:</span>
                <span className="font-semibold text-emerald-400">{inst.chatwoot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contatos Sincronizados:</span>
                <span className="font-mono text-slate-200">{inst.contacts} contatos</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 border-t border-slate-800">
              <a 
                href="https://8082-8c5afdf0-d7f1-42c1-92ea-cf35e3cbe28d.daytonaproxy01.net/manager/instance/e8baadd9-a4eb-4129-a247-870e8f7949e2/dashboard"
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Abrir no Gerente
              </a>
              <button className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
