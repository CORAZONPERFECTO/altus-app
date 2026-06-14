"use client";

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { Sparkles, Search, ArrowRight, Terminal, CheckCircle2, Zap, LayoutTemplate, MessageSquare } from 'lucide-react';

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  date: string;
};

type RAGResult = {
  voiceProfile: {
    tone: string;
    pace: string;
    keywords: string[];
  };
  structureTemplate: string;
  generatedCopy: string;
};

export default function AIStudioPage() {
  const { tenant } = useTenant();
  
  const [mode, setMode] = useState<'internal' | 'external'>('internal');
  const [urlInput, setUrlInput] = useState('');
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [terminalStep, setTerminalStep] = useState<string>('');
  const [progress, setProgress] = useState(0);
  
  const [result, setResult] = useState<RAGResult | null>(null);

  // Cargar videos de cuenta interna al iniciar
  useEffect(() => {
    if (mode === 'internal' && tenant?.id) {
      fetchInternalVideos();
    } else {
      setVideos([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, tenant?.id]);

  const fetchInternalVideos = async () => {
    setLoadingVideos(true);
    try {
      const res = await fetch(`/api/youtube/videos?tenantId=${tenant?.id}`);
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleExternalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    
    setLoadingVideos(true);
    setResult(null);
    try {
      const res = await fetch(`/api/youtube/videos?url=${encodeURIComponent(urlInput)}`);
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleAnalyze = async (videoId: string) => {
    setAnalyzingId(videoId);
    setResult(null);
    setTerminalStep('Iniciando...');
    setProgress(0);

    try {
      const res = await fetch('/api/ai/analizar-estilo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId })
      });

      if (!res.body) throw new Error('No stream supported');

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        let currentEvent = '';
        
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.replace('event: ', '').trim();
          } else if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (!dataStr) continue;
            
            const data = JSON.parse(dataStr);
            
            if (currentEvent === 'status') {
              setTerminalStep(data.step);
              setProgress(data.progress);
            } else if (currentEvent === 'complete') {
              setResult(data);
              setTerminalStep('Análisis completado exitosamente.');
              setProgress(100);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setTerminalStep('Error en el procesamiento RAG.');
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="animate-fade-up max-w-6xl mx-auto pb-10">
      
      {/* HEADER */}
      <div className="mb-10 relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <span className="bg-purple-500/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-purple-400 border border-purple-500/20 shadow-sm flex items-center space-x-1.5 uppercase tracking-wider">
            <Sparkles size={14} className="text-purple-400" />
            <span>Motor RAG Integrado</span>
          </span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          AI Studio <span className="text-gradient-accent">Analizador</span>
        </h1>
        <p className="text-zinc-400 mt-3 text-sm max-w-xl font-medium leading-relaxed">
          Extrae el ADN de cualquier contenido. Clona la voz de tu marca o modela estructuras virales de tus competidores para generar copys predictivos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: Origen de Datos */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-1 rounded-2xl flex bg-zinc-900/50 border border-white/5">
            <button 
              onClick={() => { setMode('internal'); setResult(null); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${mode === 'internal' ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Mi Canal (Voz de Marca)
            </button>
            <button 
              onClick={() => { setMode('external'); setResult(null); }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${mode === 'external' ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              URL Externa (Viral)
            </button>
          </div>

          <div className="glass-card rounded-3xl p-6">
            {mode === 'external' && (
              <form onSubmit={handleExternalSearch} className="mb-6">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Pegar URL de YouTube</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] text-zinc-500">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <input 
                    type="url" 
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="block w-full pl-10 pr-12 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                  <button type="submit" className="absolute inset-y-1 right-1 px-3 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors">
                    <Search size={16} className="text-white" />
                  </button>
                </div>
              </form>
            )}

            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
              {mode === 'internal' ? 'Últimos Videos' : 'Resultado'}
            </h3>

            {loadingVideos ? (
              <div className="animate-pulse space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl"></div>)}
              </div>
            ) : videos.length > 0 ? (
              <div className="space-y-3">
                {videos.map(video => (
                  <div key={video.id} className="group relative overflow-hidden bg-zinc-900/60 border border-white/5 rounded-2xl p-3 flex items-center hover:bg-zinc-800/80 transition-all">
                    <img src={video.thumbnail} alt={video.title} className="w-20 h-14 object-cover rounded-xl" />
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-bold text-zinc-200 truncate group-hover:text-white transition-colors">{video.title}</p>
                      <p className="text-[10px] text-zinc-500 font-medium mt-1">{video.views} vistas</p>
                    </div>
                    
                    <button 
                      onClick={() => handleAnalyze(video.id)}
                      disabled={analyzingId !== null}
                      className="ml-2 w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all border border-blue-500/20 hover:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Analizar y Extraer Estilo"
                    >
                      {analyzingId === video.id ? <Terminal size={18} className="animate-pulse" /> : <Zap size={18} />}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-zinc-500">
                  {mode === 'internal' ? 'No se encontraron videos.' : 'Pega una URL para analizar un video.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Terminal RAG y Resultados */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Terminal RAG */}
          {(analyzingId || terminalStep) && (
            <div className="glass-card rounded-3xl p-6 border border-white/5 bg-[#09090b]/80 relative overflow-hidden">
              <div className="flex items-center space-x-2 mb-4">
                <Terminal size={16} className="text-zinc-500" />
                <span className="text-xs font-mono text-zinc-400">RAG_PIPELINE_TERMINAL</span>
              </div>
              
              <div className="font-mono text-sm text-emerald-400 mb-4 h-6 flex items-center">
                <span className="mr-2">&gt;</span> 
                <span className="animate-pulse">{terminalStep}</span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Resultado del Análisis */}
          {result && (
            <div className="space-y-6 animate-fade-up">
              
              {/* Voice Profile & Structure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card p-5 rounded-3xl border-t border-white/10">
                  <div className="flex items-center space-x-2 mb-3">
                    <MessageSquare size={16} className="text-blue-400" />
                    <h3 className="text-sm font-bold text-white">Perfil de Voz</h3>
                  </div>
                  <p className="text-xs text-zinc-400 mb-2"><strong className="text-zinc-300">Tono:</strong> {result.voiceProfile.tone}</p>
                  <p className="text-xs text-zinc-400 mb-3"><strong className="text-zinc-300">Cadencia:</strong> {result.voiceProfile.pace}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.voiceProfile.keywords.map(kw => (
                      <span key={kw} className="text-[9px] font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">{kw}</span>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5 rounded-3xl border-t border-white/10">
                  <div className="flex items-center space-x-2 mb-3">
                    <LayoutTemplate size={16} className="text-purple-400" />
                    <h3 className="text-sm font-bold text-white">Estructura Viral</h3>
                  </div>
                  <pre className="text-xs text-zinc-400 whitespace-pre-wrap font-sans leading-relaxed">
                    {result.structureTemplate}
                  </pre>
                </div>
              </div>

              {/* Generated Copy */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="flex items-center justify-between mb-4 mt-2">
                  <h3 className="text-sm font-bold text-white flex items-center">
                    <CheckCircle2 size={16} className="text-emerald-400 mr-2" /> Copy Generado
                  </h3>
                  <button className="text-[10px] font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                    Copiar
                  </button>
                </div>
                
                <div className="bg-[#09090b] p-5 rounded-2xl border border-white/5">
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed font-medium">
                    {result.generatedCopy}
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
