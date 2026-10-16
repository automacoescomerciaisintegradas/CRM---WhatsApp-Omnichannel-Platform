import React from 'react';
import { Plus, Flame, MoreHorizontal, DollarSign } from 'lucide-react';

const columns = [
  {
    id: 'novo',
    name: 'Novos Leads',
    color: 'border-blue-500/40 text-blue-400',
    leads: [
      { id: 1, nome: 'Contato Site', empresa: 'Imobiliária Prime', valor: 'R$ 8.000', temp: 'quente', time: 'Há 10 min' }
    ]
  },
  {
    id: 'qualificado',
    name: 'Qualificados (IA)',
    color: 'border-emerald-500/40 text-emerald-400',
    leads: [
      { id: 2, nome: 'DJ Cliente', empresa: 'ACI Omnichannel', valor: 'R$ 15.000', temp: 'quente', time: 'Há 1 hora' }
    ]
  },
  {
    id: 'proposta',
    name: 'Proposta Enviada',
    color: 'border-yellow-500/40 text-yellow-400',
    leads: [
      { id: 3, nome: 'Francisco Queiroz', empresa: 'IAU2 Tecnologia', valor: 'R$ 28.500', temp: 'morno', time: 'Há 2 horas' }
    ]
  },
  {
    id: 'ganho',
    name: 'Venda Fechada 🎉',
    color: 'border-purple-500/40 text-purple-400',
    leads: [
      { id: 4, nome: 'Grupo Nordeste', empresa: 'Logística Express', valor: 'R$ 42.000', temp: 'ganho', time: 'Ontem' }
    ]
  }
];

export default function Kanban() {
  return (
    <div className="p-8 h-[calc(100vh-4rem)] flex flex-col bg-slate-950 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Funil de Vendas (Kanban CRM)</h2>
          <p className="text-xs text-slate-400 mt-1">Acompanhe a qualificação e conversão dos leads capturados pelo WhatsApp</p>
        </div>
        <button className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4 text-emerald-400" />
          Adicionar Etapa
        </button>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.id} className="w-80 flex-shrink-0 flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
            <div className={`flex items-center justify-between pb-3 border-b border-slate-800 mb-3`}>
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-xs uppercase tracking-wider ${col.color}`}>{col.name}</span>
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                  {col.leads.length}
                </span>
              </div>
              <button className="text-slate-500 hover:text-slate-300">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {col.leads.map((lead) => (
                <div key={lead.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-sm transition-all space-y-3 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-white">{lead.nome}</h4>
                      <p className="text-xs text-slate-400">{lead.empresa}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {lead.temp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80 text-slate-400">
                    <span className="font-semibold text-emerald-400 flex items-center gap-0.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      {lead.valor}
                    </span>
                    <span className="text-[11px] text-slate-500">{lead.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
