import React, { useState } from 'react';
import { Users, Search, Plus, Filter, Phone, Mail, Building, Flame, MoreVertical } from 'lucide-react';

export default function Contacts() {
  const [contacts] = useState([
    {
      id: 1,
      nome: 'DJ Cliente',
      whatsapp: '5588921567214',
      email: 'cliente@teste.com',
      empresa: 'ACI Automações Comerciais',
      valor: 'R$ 15.000,00',
      status: 'qualificado',
      temperatura: 'quente',
      fonte: 'whatsapp',
      obs: 'Interesse na plataforma completa de agentes IA para atendimento omnichannel.'
    },
    {
      id: 2,
      nome: 'Francisco Queiroz',
      whatsapp: '5588999887766',
      email: 'francisco@iau2.com.br',
      empresa: 'IAU2 Tecnologia',
      valor: 'R$ 28.500,00',
      status: 'proposta',
      temperatura: 'quente',
      fonte: 'whatsapp',
      obs: 'Solicitou proposta com integração Chatwoot + Evolution API.'
    }
  ]);

  return (
    <div className="p-8 space-y-6 overflow-y-auto h-[calc(100vh-4rem)] bg-slate-950">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Gestão de Leads & Contatos</h2>
          <p className="text-xs text-slate-400 mt-1">Base consolidada de contatos capturados automaticamente via WhatsApp</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
          <Plus className="w-4 h-4" />
          Novo Lead
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, telefone, empresa..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/40"
            />
          </div>
          <button className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Nome / Contato</th>
                <th className="px-6 py-3.5">WhatsApp</th>
                <th className="px-6 py-3.5">Empresa</th>
                <th className="px-6 py-3.5">Valor Estimado</th>
                <th className="px-6 py-3.5">Temperatura</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center">
                        {c.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{c.nome}</p>
                        <p className="text-[11px] text-slate-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-300">
                    +{c.whatsapp}
                  </td>
                  <td className="px-6 py-4">
                    {c.empresa}
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-400">
                    {c.valor}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      <Flame className="w-3 h-3" />
                      {c.temperatura}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
