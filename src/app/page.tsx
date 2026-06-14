import React from 'react';
import Link from 'next/link';
import { ArrowRight, Lock, Sparkles, Command, Activity, Zap, UserPlus, Layers } from 'lucide-react';

export default function EliteLandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden font-sans relative">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 via-blue-900/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <span className="text-white font-black text-lg">A</span>
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">Altus.</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/precios" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Precios y Planes
            </Link>
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Ya soy miembro
            </Link>
            <Link 
              href="/login" 
              className="group relative inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 overflow-hidden"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <Lock size={14} className="text-blue-400" />
                <span>Solicitar Acceso</span>
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center mt-10 md:mt-20">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 animate-fade-up">
            <Sparkles size={14} />
            <span>LA VENTAJA DE UNA AGENCIA TOP EN TUS MANOS</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] animate-fade-up" style={{ animationDelay: '100ms' }}>
            El motor secreto detrás de las <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">marcas top</span>. <br className="hidden md:block" />
            <span className="text-4xl md:text-5xl text-zinc-300">Ya sea la tuya, o la de tus clientes.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-10 font-medium leading-relaxed animate-fade-up" style={{ animationDelay: '200ms' }}>
            Altus es un sistema operativo cerrado impulsado por IA que te habilita instantáneamente como una agencia de élite. Potencia tu cuenta de negocio personal al 100% o escala la gestión operativa de múltiples marcas de clientes desde un solo motor. Tú pones los clientes, Altus elimina la fricción.
          </p>

          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 animate-fade-up text-left" style={{ animationDelay: '250ms' }}>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
                <UserPlus size={20} className="text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Potencia tu Marca</h4>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed">Manejo completo y avanzado para 1 cuenta de negocio personal. Ideal para solopreneurs que buscan dominar su nicho.</p>
            </div>
            
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
                <Layers size={20} className="text-indigo-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Opera como Agencia</h4>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed">Gestión multi-workspace avanzada para 10+ cuentas de clientes. Maneja un portafolio entero solo.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors flex items-center justify-center space-x-2 group"
            >
              <span>Aplicar al Círculo Privado</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '400ms' }}>
          
          {/* Card 1: Multi-Tenant */}
          <div className="md:col-span-2 glass-panel border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Command size={100} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end min-h-[200px]">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6">
                <Command size={24} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Multi-Workspace Nativo</h3>
              <p className="text-zinc-400 font-medium max-w-md">Gestiona múltiples marcas y clientes en entornos completamente aislados con un solo inicio de sesión.</p>
            </div>
          </div>

          {/* Card 2: Zero Latency */}
          <div className="glass-panel border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap size={100} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end min-h-[200px]">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6">
                <Zap size={24} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Zero-Latency</h3>
              <p className="text-zinc-400 font-medium">Motor de publicación impulsado por infraestructura Edge. Inmediato.</p>
            </div>
          </div>

          {/* Card 3: Analytics */}
          <div className="glass-panel border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={100} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end min-h-[200px]">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6">
                <Activity size={24} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Datos Precisos</h3>
              <p className="text-zinc-400 font-medium">Telemetría y análisis de crecimiento sin depender de librerías lentas.</p>
            </div>
          </div>

          {/* Card 4: Auto-Sustentable */}
          <div className="md:col-span-3 glass-panel border border-emerald-500/20 bg-emerald-500/5 rounded-3xl p-8 hover:border-emerald-500/40 transition-colors relative overflow-hidden group mt-6">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={100} className="text-emerald-400" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-4 w-fit">
                Economía Circular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Un Software Auto-Sustentable</h3>
              <p className="text-zinc-400 font-medium max-w-2xl leading-relaxed">
                No es un gasto, es una máquina de retorno. Altus integra un Radar de Monetización que conecta tus contenidos con productos de afiliado (Amazon). <strong>Usa las comisiones que generes para pagar la suscripción de la herramienta.</strong> Llega un punto donde Altus te sale completamente gratis.
              </p>
            </div>
          </div>

          {/* Card 5: AI Studio */}
          <div className="md:col-span-2 glass-panel border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={100} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end min-h-[200px]">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-6">
                <Sparkles size={24} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">AI Studio & RAG</h3>
              <p className="text-zinc-400 font-medium max-w-md">No uses ChatGPT genérico. Altus inyecta el contexto de tu marca en un LLM privado para generar copys que sí suenan a ti.</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">A</span>
            </div>
            <span className="text-sm font-bold tracking-tighter text-white">Altus.</span>
          </div>
          <div className="text-xs font-medium text-zinc-500 flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
            <span>© 2026 Altus Systems. Plataforma SaaS B2B. Acceso restringido.</span>
            <div className="flex space-x-4">
              <Link href="/terminos" className="hover:text-zinc-300 transition-colors">Términos</Link>
              <Link href="/privacidad" className="hover:text-zinc-300 transition-colors">Privacidad</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
