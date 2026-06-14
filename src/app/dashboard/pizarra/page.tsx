"use client";

import React, { useState, useEffect } from 'react';
import { Target, Crosshair, Map, CalendarClock, TrendingUp, Save, BrainCircuit, Activity, ChevronRight } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AITextArea from '@/components/AITextArea';

interface ClarityData {
  identidad: { mision: string; publico: string };
  metas: { principal: string; semestral: string; trimestral: string; mensual: string };
  ejecucion: { tacticas: string };
}

export default function PizarraClaridadPage() {
  const { tenant } = useTenant();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [data, setData] = useState<ClarityData>({
    identidad: { mision: '', publico: '' },
    metas: { principal: '', semestral: '', trimestral: '', mensual: '' },
    ejecucion: { tacticas: '' }
  });

  // Cargar datos de Firebase al entrar o cambiar de Workspace
  useEffect(() => {
    async function loadData() {
      if (!tenant?.id) return;
      const docRef = doc(db, 'workspaces', tenant.id, 'modules', 'clarity_board');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setData(snap.data() as ClarityData);
      } else {
        // Reset if no data for this new tenant
        setData({
          identidad: { mision: '', publico: '' },
          metas: { principal: '', semestral: '', trimestral: '', mensual: '' },
          ejecucion: { tacticas: '' }
        });
      }
    }
    loadData();
  }, [tenant?.id]);

  const handleSave = async () => {
    if (!tenant?.id) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, 'workspaces', tenant.id, 'modules', 'clarity_board');
      await setDoc(docRef, data, { merge: true });
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving clarity board:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (category: keyof ClarityData, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  return (
    <div className="animate-fade-up max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <BrainCircuit size={14} />
            <span>Workspace: {tenant?.name || 'Cargando...'}</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center space-x-3">
            <Map size={36} className="text-zinc-400" />
            <span>Pizarra de Claridad</span>
          </h1>
          <p className="text-zinc-400 mt-2 text-sm font-medium">El mapa de ruta estratégico para esta cuenta. Manten el foco en lo que importa.</p>
        </div>

        <div className="flex items-center space-x-4">
          {lastSaved && (
            <span className="text-xs text-zinc-500 font-medium flex items-center space-x-1">
              <Activity size={12} className="text-emerald-500" />
              <span>Guardado a las {lastSaved.toLocaleTimeString()}</span>
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isSaving ? 'Guardando...' : 'Guardar Pizarra'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna 1: Identidad */}
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-t-3xl border-b-0 border border-white/5 flex items-center space-x-3 bg-zinc-900/50">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Crosshair size={16} className="text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Identidad Core</h2>
          </div>
          
          <div className="glass-panel p-6 rounded-b-3xl border border-white/5 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">¿Quiénes somos?</label>
              <AITextArea 
                value={data.identidad.mision}
                onChange={(val) => updateField('identidad', 'mision', val)}
                placeholder="Nuestra misión, ventaja injusta y promesa de valor..."
                className="h-32"
                contextContext="Misión y Ventaja Competitiva de la Empresa"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Público Objetivo (Target)</label>
              <AITextArea 
                value={data.identidad.publico}
                onChange={(val) => updateField('identidad', 'publico', val)}
                placeholder="¿A quién le hablamos? Dolor principal, deseos y nivel de consciencia..."
                className="h-32"
                contextContext="Público Objetivo y Buyer Persona"
              />
            </div>
          </div>
        </div>

        {/* Columna 2: Cascada de Metas */}
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-t-3xl border-b-0 border border-white/5 flex items-center space-x-3 bg-zinc-900/50">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Target size={16} className="text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Horizonte de Metas</h2>
          </div>
          
          <div className="glass-panel p-6 rounded-b-3xl border border-white/5 space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-10 bottom-4 w-px bg-white/10"></div>
              
              <div className="relative z-10 pl-8 mb-6">
                <div className="absolute left-0 top-3 w-3 h-3 rounded-full bg-emerald-500 border-4 border-zinc-900"></div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Estrella Polar (General)</label>
                <input 
                  type="text"
                  value={data.metas.principal}
                  onChange={(e) => updateField('metas', 'principal', e.target.value)}
                  placeholder="Ej: Llegar a 100k MRR o ser líder del sector"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              <div className="relative z-10 pl-8 mb-6">
                <div className="absolute left-0 top-3 w-3 h-3 rounded-full bg-zinc-700 border-4 border-zinc-900"></div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Meta Semestral</label>
                <input 
                  type="text"
                  value={data.metas.semestral}
                  onChange={(e) => updateField('metas', 'semestral', e.target.value)}
                  placeholder="Objetivo a 6 meses"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-zinc-300 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="relative z-10 pl-8 mb-6">
                <div className="absolute left-0 top-3 w-3 h-3 rounded-full bg-zinc-700 border-4 border-zinc-900"></div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Meta Trimestral</label>
                <input 
                  type="text"
                  value={data.metas.trimestral}
                  onChange={(e) => updateField('metas', 'trimestral', e.target.value)}
                  placeholder="Objetivo a 3 meses"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-zinc-300 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="relative z-10 pl-8">
                <div className="absolute left-0 top-3 w-3 h-3 rounded-full bg-white border-4 border-zinc-900 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white mb-2 flex items-center">
                  <span>Meta Mensual (Foco Actual)</span>
                  <ChevronRight size={14} className="text-zinc-500 ml-1" />
                </label>
                <input 
                  type="text"
                  value={data.metas.mensual}
                  onChange={(e) => updateField('metas', 'mensual', e.target.value)}
                  placeholder="Lo que debemos lograr este mes sí o sí"
                  className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-sm text-white font-bold focus:outline-none focus:border-white/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Columna 3: Ejecución */}
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-t-3xl border-b-0 border border-white/5 flex items-center space-x-3 bg-zinc-900/50">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <TrendingUp size={16} className="text-orange-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Ejecución Táctica</h2>
          </div>
          
          <div className="glass-panel p-6 rounded-b-3xl border border-white/5 space-y-4 h-full min-h-[400px]">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Tácticas Semanales</label>
            <AITextArea 
              value={data.ejecucion.tacticas}
              onChange={(val) => updateField('ejecucion', 'tacticas', val)}
              placeholder="- Lunes: Grabar 3 Reels educativos&#10;- Miércoles: Lanzar campaña de email&#10;- Viernes: Revisar analíticas..."
              className="h-[85%] leading-relaxed"
              contextContext="Tácticas de marketing semanales accionables"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
