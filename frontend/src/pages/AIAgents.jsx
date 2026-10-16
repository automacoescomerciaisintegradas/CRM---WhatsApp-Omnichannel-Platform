import React, { useState } from 'react';
import { Bot, Sparkles, Check, Sliders, Shield } from 'lucide-react';

export default function AIAgents() {
  const [prompt, setPrompt] = useState(
    'Você é o assistente virtual inteligente da ACI Omnichannel. Atenda cordialmente no WhatsApp, responda dúvidas sobre nossos produtos, qualifique o lead obtendo nome e interesse, e faça o handoff para a equipe humana se solicitado.'
  );

  return (
    <div className="p-8 space-y-6 overflow-y-auto h-[calc(100vh-4rem)] bg-slate-950">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Agentes de Inteligência Artificial</h2>
          <p className="text-xs text-slate-400 mt-1">Configure o comportamento, prompts e modelos de IA para atendimento no WhatsApp</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
          <Check className="w-4 h-4" />
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Prompt do Sistema (Personalidade & Regras do Agente)
            </h3>
            <textarea
              rows={8}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 leading-relaxed placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <p className="text-[11px] text-slate-500">
              Instruções que ditam tom de voz, regras de qualificação de leads e gatilhos para transferência humana.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Parâmetros do Modelo
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Modelo de IA</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none">
                  <option value="gpt-4o-mini">OpenAI GPT-4o-mini (Recomendado)</option>
                  <option value="gpt-4o">OpenAI GPT-4o (Alta Precisão)</option>
                  <option value="claude-3-haiku">Anthropic Claude 3 Haiku</option>
                  <option value="groq-llama3">Groq LLaMA 3 70B (Ultrarrápido)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Temperatura (Criatividade): 0.7</label>
                <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full accent-emerald-500" />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Limite de Tokens de Resposta</label>
                <input type="number" defaultValue="500" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
