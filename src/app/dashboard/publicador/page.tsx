"use client";

import React, { useState, useEffect } from 'react';

import { useTenant } from '@/hooks/useTenant';
import { CalendarDays, PenSquare, Image as ImageIcon, Send, Clock, CheckCircle2, MoreHorizontal, LayoutTemplate } from 'lucide-react';
import { createPost, getPostsByTenant } from '@/lib/firestore';

type Post = {
  id: string;
  content: string;
  platforms: string[];
  status: string;
  scheduledFor: string;
};

export default function PublisherPage() {
  const { tenant } = useTenant();
  const [activeTab, setActiveTab] = useState<'composer' | 'calendar'>('composer');
  
  // Composer State
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['youtube']);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calendar State
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    if (activeTab === 'calendar' && tenant?.id) {
      loadPosts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, tenant?.id]);

  const loadPosts = async () => {
    if (!tenant?.id) return;
    setLoadingPosts(true);
    try {
      const dbPosts = await getPostsByTenant(tenant.id);
      setPosts(dbPosts as Post[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || selectedPlatforms.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const scheduledFor = scheduleDate && scheduleTime 
        ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString() 
        : new Date().toISOString();

      await createPost(tenant!.id, {
        content,
        platforms: selectedPlatforms,
        scheduledFor
      });
      
      setSuccess(true);
      setContent('');
      setTimeout(() => {
        setSuccess(false);
        setActiveTab('calendar');
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  return (
    <div className="animate-fade-up max-w-6xl mx-auto pb-10">
      {/* HEADER */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <span className="bg-blue-500/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-blue-400 border border-blue-500/20 shadow-sm flex items-center space-x-1.5 uppercase tracking-wider">
            <PenSquare size={14} className="text-blue-400" />
            <span>Composer Engine</span>
          </span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Estudio de <span className="text-gradient-accent">Publicación</span>
        </h1>
        <p className="text-zinc-400 mt-2 text-sm max-w-xl font-medium">
          Redacta, previsualiza y programa tu contenido para múltiples plataformas desde un solo lugar.
        </p>
      </div>

      {/* TABS */}
      <div className="flex space-x-2 mb-8 bg-zinc-900/50 p-1 rounded-2xl border border-white/5 w-fit">
        <button 
          onClick={() => setActiveTab('composer')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'composer' ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <PenSquare size={16} />
          <span>Redactor</span>
        </button>
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'calendar' ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          <CalendarDays size={16} />
          <span>Calendario</span>
        </button>
      </div>

      {/* CONTENIDO DE TABS */}
      {activeTab === 'composer' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="glass-card rounded-3xl p-6 border border-white/5">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Escribir Publicación</h3>
            
            {success && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center text-emerald-400 text-sm font-bold">
                <CheckCircle2 size={16} className="mr-2" /> ¡Publicación programada con éxito!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Selector de Redes */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Destinos</label>
                <div className="flex flex-wrap gap-2">
                  {['youtube', 'facebook', 'instagram', 'linkedin'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${selectedPlatforms.includes(p) ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Area */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Contenido</label>
                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="¿Qué tienes en mente para tu audiencia hoy?"
                    rows={6}
                    className="w-full bg-[#09090b] border border-white/10 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    required
                  ></textarea>
                  <div className="absolute bottom-3 left-3 flex space-x-2">
                    <button type="button" className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors">
                      <ImageIcon size={16} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 right-4 text-[10px] font-bold text-zinc-600">
                    {content.length} / 2200
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Fecha</label>
                  <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Hora</label>
                  <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full bg-[#09090b] border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim() || selectedPlatforms.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Programando...</span>
                  ) : scheduleDate ? (
                    <><Clock size={16} className="mr-2" /> Programar Post</>
                  ) : (
                    <><Send size={16} className="mr-2" /> Publicar Ahora</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Vista Previa */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
            
            {!content ? (
              <div className="text-center opacity-50">
                <LayoutTemplate size={48} className="mx-auto text-zinc-600 mb-4" strokeWidth={1} />
                <p className="text-sm font-medium text-zinc-400">Escribe algo para ver la<br/>vista previa en tiempo real</p>
              </div>
            ) : (
              <div className="w-full max-w-sm bg-[#18181b] border border-white/10 rounded-2xl p-4 shadow-2xl relative z-10 animate-fade-up">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-white font-bold">Tú</div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">Tu Marca</p>
                    <p className="text-[10px] text-zinc-500">Justo ahora • Vista Previa</p>
                  </div>
                  <MoreHorizontal size={16} className="text-zinc-600 ml-auto" />
                </div>
                <p className="text-sm text-zinc-200 whitespace-pre-wrap">{content}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-6 border border-white/5 min-h-[400px]">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Próximas Publicaciones</h3>
          
          {loadingPosts ? (
             <div className="animate-pulse space-y-3">
               {[1,2,3].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl"></div>)}
             </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays size={48} className="mx-auto text-zinc-700 mb-4" strokeWidth={1} />
              <p className="text-zinc-400 font-medium">No tienes publicaciones programadas.</p>
              <button onClick={() => setActiveTab('composer')} className="mt-4 text-blue-400 text-sm font-bold hover:text-blue-300">
                Crear mi primer post
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 flex items-start space-x-4 hover:bg-zinc-800/80 transition-colors">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl border border-blue-500/20 flex flex-col items-center justify-center text-blue-400 flex-shrink-0">
                    <span className="text-xs font-black">{new Date(post.scheduledFor).getDate()}</span>
                    <span className="text-[9px] uppercase font-bold">{new Date(post.scheduledFor).toLocaleString('es', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate">{post.content}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">Programado</span>
                      <span className="text-[10px] font-bold text-zinc-500">{formatDate(post.scheduledFor)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {post.platforms.map(p => (
                      <div key={p} className="w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center border border-white/5 text-[8px] font-bold capitalize text-zinc-400">
                        {p[0]}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
