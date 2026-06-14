"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Sparkles, BrainCircuit, ArrowRight, Check } from 'lucide-react';

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Redirigimos a Stripe
      } else {
        alert(data.error || 'Error conectando con Stripe');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Navbar Simple */}
      <nav className="fixed top-0 w-full border-b border-white/5 bg-black/50 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center space-x-2">
            <Sparkles size={24} className="text-white" />
            <span>ALTUS</span>
          </Link>
          <div className="flex items-center space-x-6 text-sm font-bold">
            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">Iniciar Sesión</Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-up">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>Acceso Exclusivo</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
            El motor secreto de las <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">Agencias Top.</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-16 max-w-2xl mx-auto font-medium">
            Automatiza tu creación de contenido, diseña estrategias a nivel directivo y multiplica tus clientes con IA pura.
          </p>

          {/* Pricing Card */}
          <div className="max-w-lg mx-auto bg-black border border-white/10 rounded-3xl p-1 relative group overflow-hidden">
            {/* Borde brillante animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-20 group-hover:opacity-40 transition-opacity"></div>
            
            <div className="relative bg-zinc-950 rounded-[22px] p-8 md:p-12 z-10 h-full border border-white/5 flex flex-col">
              
              {/* Barra de Escasez (FOMO) */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-left">
                <p className="text-red-400 font-bold text-sm mb-2 flex justify-between items-center">
                  <span>🚀 Oferta: Miembro Fundador</span>
                  <span>41 / 50 Cupos</span>
                </p>
                <div className="w-full bg-red-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '82%' }}></div>
                </div>
                <p className="text-red-400/80 text-[10px] uppercase tracking-widest font-bold mt-2">
                  El precio subirá a $99 al llegar a 50 usuarios.
                </p>
              </div>

              <h2 className="text-2xl font-black mb-2 text-left">Plan Agencia Pro</h2>
              <p className="text-zinc-500 text-sm font-medium text-left mb-6">Todo el poder de Altus desbloqueado.</p>
              
              <div className="flex items-baseline space-x-3 mb-8">
                <span className="text-zinc-600 text-3xl font-bold line-through decoration-zinc-500 decoration-2">$99</span>
                <span className="text-6xl font-black tracking-tighter text-white">$49</span>
                <span className="text-zinc-500 font-bold">/ mes</span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-white text-black text-center font-black py-4 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center space-x-2 group hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Reclamar Cupo Fundador</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="mt-4 mb-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                <p className="text-emerald-400 text-xs font-bold text-center">
                  🌱 Modelo Auto-Sustentable: Usa las comisiones que generes con nuestro Radar de Monetización (Amazon) para pagar tus próximas mensualidades. El software se paga solo.
                </p>
              </div>

              <div className="space-y-4 text-left flex-1">
                <p className="text-xs uppercase tracking-widest font-bold text-zinc-600 mb-6">Lo que incluye:</p>
                
                {[
                  '2,000 Créditos de IA mensuales',
                  'Acceso ilimitado al CMO Virtual',
                  'Radar de Tendencias (Monetización)',
                  'Módulo de Publicación Automatizada',
                  'Participación en el Programa de Afiliados (25%)'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3 text-zinc-300">
                    <Check size={18} className="text-blue-400 shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
          
        </div>
      </main>

      {/* Footer minimalista */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 text-xl font-black tracking-tighter mb-4 md:mb-0">
            <Sparkles size={18} className="text-zinc-400" />
            <span className="text-zinc-400">ALTUS</span>
          </div>
          <div className="flex space-x-6 text-xs font-bold text-zinc-600">
            <Link href="/terminos" className="hover:text-white transition-colors">Términos de Servicio</Link>
            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
