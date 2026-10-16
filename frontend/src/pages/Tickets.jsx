import React, { useState } from 'react';
import { 
  Send, 
  UserCheck, 
  Sparkles, 
  Phone, 
  Search, 
  CheckCheck,
  MoreVertical,
  Paperclip
} from 'lucide-react';

export default function Tickets() {
  const [selectedTicket, setSelectedTicket] = useState({
    id: 1,
    contact: { name: 'DJ Cliente', phone: '+55 88 9215-67214', avatar: '' },
    messages: [
      { id: 1, from_me: false, body: 'Olá! Gostaria de saber mais sobre a ACI Omnichannel.', time: '12:24' },
      { id: 2, from_me: true, body: 'Olá! Sou o assistente de IA da ACI Omnichannel. Nossos agentes autônomos atendem 24/7 no WhatsApp, integrados ao seu CRM e com transição suave para operadores humanos quando necessário. Como posso te ajudar hoje?', time: '12:24' }
    ]
  });

  const [inputMessage, setInputMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const newMsg = {
      id: Date.now(),
      from_me: true,
      body: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMsg]
    });
    setInputMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      {/* Ticket List Sidebar */}
      <div className="w-80 border-r border-slate-800 bg-slate-900/40 flex flex-col">
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Conversas Ativas</h3>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400">1 WhatsApp</span>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar conversa..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/40"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          <div 
            onClick={() => {}}
            className="p-4 bg-slate-800/40 hover:bg-slate-800/70 cursor-pointer transition-colors flex items-start gap-3 border-l-2 border-emerald-500"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-sm flex-shrink-0">
              DJ
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm text-slate-200 truncate">DJ Cliente</p>
                <span className="text-[10px] text-slate-500">12:24</span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">Olá! Sou o assistente de IA da ACI Omnichannel...</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Atendido por IA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-950">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
              DJ
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{selectedTicket.contact.name}</h4>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>{selectedTicket.contact.phone}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Online via WhatsApp
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              Sugerir com IA
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <UserCheck className="w-3.5 h-3.5" />
              Transferir para Humano
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {selectedTicket.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.from_me ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-xl rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  msg.from_me
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                <p>{msg.body}</p>
                <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${msg.from_me ? 'text-emerald-200' : 'text-slate-500'}`}>
                  <span>{msg.time}</span>
                  {msg.from_me && <CheckCheck className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Message Footer */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center gap-3">
          <button type="button" className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua mensagem para o cliente no WhatsApp..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold flex items-center justify-center transition-colors shadow-lg shadow-emerald-500/20 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
