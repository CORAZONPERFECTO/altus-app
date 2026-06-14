"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Settings, LogOut, Home, Users, BarChart3, Menu, Sparkles, PenSquare, ShoppingBag, Radar, BrainCircuit, HeadphonesIcon, ShieldAlert, Wallet } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/hooks/useTenant';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const { tenant } = useTenant();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const userInitialUpper = user?.email ? user.email[0].toUpperCase() : 'U';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans selection:bg-blue-500/30 selection:text-blue-200 relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]"></div>
        </div>

        {/* Sidebar - Desktop Only (hidden on mobile, flex on md and up) */}
        <aside className="hidden md:flex w-[280px] glass-panel border-r border-white/5 flex-col z-20 sticky top-0 h-screen">
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">Altus.</span>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Menu Principal</p>
            <NavItem href="/dashboard" icon={<Home size={18} strokeWidth={2.5} />} label="Inicio" currentPath={pathname} />
            <NavItem href="/dashboard/cuentas" icon={<Users size={18} strokeWidth={2.5} />} label="Redes Sociales" currentPath={pathname} />
            <NavItem href="/dashboard/analizador" icon={<Sparkles size={18} strokeWidth={2.5} />} label="AI Studio" currentPath={pathname} />
            <NavItem href="/dashboard/estrategia" icon={<BrainCircuit size={18} strokeWidth={2.5} />} label="Metas y Estrategia" currentPath={pathname} />
            <NavItem href="/dashboard/publicador" icon={<PenSquare size={18} strokeWidth={2.5} />} label="Publicar" currentPath={pathname} />
            <NavItem href="/dashboard/billetera" icon={<Wallet size={18} strokeWidth={2.5} />} label="Mi Billetera" currentPath={pathname} />
            <NavItem href="/dashboard/reportes" icon={<BarChart3 size={18} strokeWidth={2.5} />} label="Analíticas" currentPath={pathname} />
            <NavItem href="/dashboard/auditoria" icon={<ShieldAlert size={18} strokeWidth={2.5} />} label="Auditoría Legal" currentPath={pathname} />
            <NavItem href="/dashboard/soporte" icon={<HeadphonesIcon size={18} strokeWidth={2.5} />} label="Soporte y Feedback" currentPath={pathname} />
            
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-8 mb-2 pt-4 border-t border-white/5">Próximamente</p>
            <button 
              onClick={() => alert("Próximamente: Conecta tu tienda de Amazon, Shopify o Temu para adjuntar enlaces de afiliados automáticamente en tus publicaciones.")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <span className="group-hover:text-amber-400 transition-colors">
                  <ShoppingBag size={18} strokeWidth={2.5} />
                </span>
                <span>Monetización</span>
              </div>
              <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Beta</span>
            </button>
            <button 
              onClick={() => alert("Próximamente: Integración con Google Trends, TikTok Creative Center y VidIQ para descubrir temas virales en tiempo real antes de crear tu contenido.")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <span className="group-hover:text-amber-400 transition-colors">
                  <Radar size={18} strokeWidth={2.5} />
                </span>
                <span>Radar de Tendencias</span>
              </div>
              <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Beta</span>
            </button>
          </nav>

          {/* Footer Sidebar */}
          <div className="p-4 mt-auto border-t border-white/5">
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 flex items-center space-x-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white font-bold text-sm shadow-inner ring-1 ring-white/10">
                {userInitialUpper}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-200 truncate">
                  {user?.displayName ?? 'Usuario'}
                </p>
                <p className="text-[11px] text-zinc-500 truncate font-medium">
                  {tenant?.name || 'Workspace'}
                </p>
              </div>
            </div>

            <NavItem href="/dashboard/config" icon={<Settings size={18} strokeWidth={2.5} />} label="Configuración" currentPath={pathname} />
            
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 mt-1 text-sm font-medium text-zinc-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
            >
              <LogOut size={18} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* Topbar Mobile Only */}
        <header className="md:hidden fixed top-0 left-0 right-0 h-16 glass-panel border-b border-white/5 z-30 flex items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-lg font-bold tracking-tighter text-white">Altus.</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-xs border border-white/10">
            {userInitialUpper}
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10 pt-16 md:pt-0 pb-20 md:pb-0">
          <div className="p-4 sm:p-8 lg:p-12 flex-1 w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Bottom Nav - Mobile Only */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/5 pb-safe">
          <div className="flex items-center justify-around px-2 py-3">
            <MobileNavItem href="/dashboard" icon={<Home size={22} strokeWidth={2} />} label="Inicio" currentPath={pathname} />
            <MobileNavItem href="/dashboard/analizador" icon={<Sparkles size={22} strokeWidth={2} />} label="IA" currentPath={pathname} />
            <MobileNavItem href="/dashboard/publicador" icon={<PenSquare size={22} strokeWidth={2} />} label="Publicar" currentPath={pathname} />
            <MobileNavItem href="/dashboard/cuentas" icon={<Users size={22} strokeWidth={2} />} label="Cuentas" currentPath={pathname} />
            <MobileNavItem href="/dashboard/config" icon={<Settings size={22} strokeWidth={2} />} label="Ajustes" currentPath={pathname} />
          </div>
        </nav>
      </div>
    </ProtectedRoute>
  );
}

// ── NavItem Desktop ─────────────────────────────────────────────────────────
function NavItem({ href, icon, label, currentPath }: { href: string; icon: React.ReactNode; label: string; currentPath: string }) {
  const isActive = currentPath === href || (href !== '/dashboard' && currentPath.startsWith(href));
  
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
        ${isActive 
          ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' 
          : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <span className={`${isActive ? 'text-blue-400' : 'group-hover:text-zinc-300'} transition-colors`}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {isActive && (
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
      )}
    </Link>
  );
}

// ── NavItem Mobile ──────────────────────────────────────────────────────────
function MobileNavItem({ href, icon, label, currentPath }: { href: string; icon: React.ReactNode; label: string; currentPath: string }) {
  const isActive = currentPath === href || (href !== '/dashboard' && currentPath.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors
        ${isActive ? 'text-blue-400' : 'text-zinc-500 hover:text-zinc-300'}
      `}
    >
      <div className={`${isActive ? 'bg-blue-500/20 p-1.5 rounded-lg' : ''} transition-all`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
