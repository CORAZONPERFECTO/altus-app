"use client";

import React, { useState } from 'react';
import { Target, Users, TrendingUp, MessageSquare, DollarSign, Sparkles, ArrowRight, CheckCircle2, BrainCircuit, GraduationCap, AlertCircle } from 'lucide-react';

export default function EstrategiaPage() {
  const [audience, setAudience] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [strategy, setStrategy] = useState<any>(null);

  const goals = [
    { id: 'ventas', title: 'Vender un Producto', icon: <DollarSign size={20} />, desc: 'Conversión directa y embudos de venta.' },
    { id: 'seguidores', title: 'Crecer Comunidad', icon: <TrendingUp size={20} />, desc: 'Alcance orgánico y viralidad sostenida.' },
    { id: 'engagement', title: 'Aumentar Interacción', icon: <MessageSquare size={20} />, desc: 'Más comentarios, DMs y fidelización.' },
    { id: 'autoridad', title: 'Construir Autoridad', icon: <GraduationCap size={20} />, desc: 'Posicionamiento B2B y liderazgo de opinión.' },
  ];

  const handleGenerate = async () => {
    if (!audience || !selectedGoal) return;
    setIsGenerating(true);
    
    try {
      const res = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: selectedGoal, audience }),
      });
      const json = await res.json();
      if (json.success) {
        setStrategy(json.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-up max-w-4xl mx-auto pb-20">
      <div className="mb-12">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          <BrainCircuit size={14} />
          <span>CMO Virtual</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Estrategia y <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Metas</span>
        </h1>
        <p className="text-zinc-400 mt-3 text-sm max-w-xl font-medium leading-relaxed">
          Define quién es tu cliente y qué quieres lograr. Nuestra IA estructurará un plan de acción para que dejes de adivinar y empieces a ejecutar con propósito.
        </p>
      </div>

      {!strategy ? (
        <div className="space-y-10">
          {/* Paso 1: Público Objetivo */}
          <section className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Users size={120} />
            </div>
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">1</span>
                <span>Define tu Público Objetivo</span>
              </h2>
              
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-6">
                <h4 className="text-sm font-bold text-zinc-300 flex items-center space-x-2 mb-2">
                  <GraduationCap size={16} className="text-indigo-400" />
                  <span>¿Qué es un Público Objetivo?</span>
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  No puedes venderle "a todo el mundo". Tu público objetivo es ese grupo específico de personas que tienen un dolor que tu producto alivia, o un deseo que tu servicio cumple. Ejemplo: En lugar de "mujeres", usa "madres primerizas que buscan recuperar su figura sin ir al gimnasio". Cuanto más específico seas, más barato y efectivo será tu marketing.
                </p>
              </div>

              <textarea
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Ej. Emprendedores de 25-40 años que tienen agencias de marketing pero sufren de burnout..."
                className="w-full h-24 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none transition-all placeholder:text-zinc-600"
              />
            </div>
          </section>

          {/* Paso 2: Meta Principal */}
          <section className="glass-panel p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">2</span>
              <span>¿Cuál es tu meta principal?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGoal(g.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedGoal === g.id 
                      ? 'bg-purple-500/10 border-purple-500/50' 
                      : 'bg-zinc-900/50 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${selectedGoal === g.id ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-zinc-400'}`}>
                    {g.icon}
                  </div>
                  <h3 className={`font-bold text-sm mb-1 ${selectedGoal === g.id ? 'text-white' : 'text-zinc-300'}`}>{g.title}</h3>
                  <p className="text-xs text-zinc-500">{g.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!audience || !selectedGoal || isGenerating}
              className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg shadow-white/10"
            >
              {isGenerating ? (
                <span>Analizando mercado...</span>
              ) : (
                <>
                  <span>Generar Plan Estratégico</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Resultados de la Estrategia */
        <div className="space-y-6 animate-fade-up">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Target size={24} className="text-indigo-400" />
              <span>Tu Plan de Acción</span>
            </h2>
            <button onClick={() => setStrategy(null)} className="text-xs text-zinc-500 hover:text-white transition-colors">
              Resetear Metas
            </button>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 text-sm text-blue-200 leading-relaxed shadow-inner">
            {strategy.mindset}
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-sm text-emerald-200 leading-relaxed shadow-inner">
            {strategy.target_audience_validation}
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap mb-8">
              {strategy.strategy}
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">🎯 Tácticas a implementar esta semana</h3>
              <ul className="space-y-3">
                {strategy.tactics.map((tac: string, i: number) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-zinc-400">
                    <CheckCircle2 size={16} className="text-purple-400 mt-0.5 shrink-0" />
                    <span>{tac}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">💡 Ganchos (Hooks) recomendados para hoy</h3>
              <div className="grid grid-cols-1 gap-3">
                {strategy.hooks.map((hook: string, i: number) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl text-sm text-zinc-300 font-medium italic">
                    {hook}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
