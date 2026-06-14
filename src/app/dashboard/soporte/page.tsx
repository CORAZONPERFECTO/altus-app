"use client";

import React, { useState } from 'react';
import { MessageSquare, Lightbulb, Bug, Send, CheckCircle2, HeadphonesIcon } from 'lucide-react';

export default function SupportPage() {
  const [ticketType, setTicketType] = useState<'idea' | 'bug' | 'question'>('idea');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    // Simulate API call to save ticket to Firestore
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="animate-fade-up max-w-4xl mx-auto pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center space-x-3">
          <HeadphonesIcon size={32} className="text-blue-500" />
          <span>Soporte y Sugerencias</span>
        </h1>
        <p className="text-zinc-400 mt-3 text-sm font-medium">
          Altus se construye junto a ti. Si encuentras un error, tienes una duda o se te ocurrió una idea millonaria, escríbenos directamente aquí.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/5">
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-up">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje Recibido!</h3>
            <p className="text-zinc-400">Nuestro equipo de ingeniería revisará tu reporte de inmediato. Gracias por ayudar a mejorar Altus.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium text-sm"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-3">1. ¿Qué deseas reportar?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setTicketType('idea')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${ticketType === 'idea' ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:border-white/10'}`}
                >
                  <Lightbulb size={24} />
                  <span className="font-bold text-sm">Idea de Mejora</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTicketType('bug')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${ticketType === 'bug' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:border-white/10'}`}
                >
                  <Bug size={24} />
                  <span className="font-bold text-sm">Reportar Error</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTicketType('question')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${ticketType === 'question' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:border-white/10'}`}
                >
                  <MessageSquare size={24} />
                  <span className="font-bold text-sm">Duda General</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-300 mb-3">2. Cuéntanos los detalles</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  ticketType === 'idea' ? "¿Qué nueva función te ayudaría a escalar tu agencia?" :
                  ticketType === 'bug' ? "¿Qué estaba pasando cuando ocurrió el error?" :
                  "¿En qué podemos ayudarte hoy?"
                }
                required
                className="w-full h-40 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none transition-all"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Enviando...</span>
                ) : (
                  <>
                    <span>Enviar Mensaje</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
