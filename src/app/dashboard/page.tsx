"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/hooks/useTenant';
import { getSocialAccounts } from '@/lib/firestore';
import { PLATFORM_CONFIGS, SocialAccount } from '@/types';
import { ArrowRight, Users, TrendingUp, Activity, Plus, Sparkles, BarChart2 } from 'lucide-react';

export default function DashboardPage() {
  const { tenant, profile } = useTenant();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!tenant?.id) return;
      try {
        const data = await getSocialAccounts(tenant.id, '');
        setAccounts(data);
      } catch (err) {
        console.error('Error cargando cuentas en dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tenant?.id]);

  const displayName = profile?.displayName ?? profile?.email ?? 'Usuario';
  const greeting = getGreeting();

  const connectedCount = accounts.length;
  const totalFollowers = accounts.reduce((acc, account) => acc + (account.followerCount || 0), 0);
  const activePlatforms = new Set(accounts.map(a => a.platform));

  return (
    <div className="animate-fade-up">
      
      {/* Encabezado Premium Dark */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center space-x-2 mb-3 animate-fade-up delay-100">
            <span className="bg-blue-500/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)] flex items-center space-x-1.5 uppercase tracking-wider">
              <Sparkles size={12} className="text-blue-400" />
              <span>Workspace: {tenant?.name}</span>
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight animate-fade-up delay-200">
            {greeting}, <br className="sm:hidden"/> <span className="text-gradient-accent">{displayName.split(' ')[0]}</span>
          </h1>
          <p className="text-zinc-400 mt-4 text-sm lg:text-base max-w-xl animate-fade-up delay-300 leading-relaxed font-medium">
            Control central de tu presencia digital. Conecta tus plataformas sociales para desbloquear métricas avanzadas impulsadas por IA.
          </p>
        </div>
        
        {connectedCount === 0 && !loading && (
          <Link
            href="/dashboard/cuentas"
            className="group relative inline-flex items-center justify-center px-6 py-3.5 font-bold text-white transition-all duration-300 bg-blue-600 rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-zinc-900 animate-fade-up delay-300 shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.8)]"
          >
            <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Vincular Red Social
          </Link>
        )}
      </div>

      {/* Bento Grid Layout - Dark Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-up delay-200">
        <MetricCard 
          title="Audiencia Total" 
          value={loading ? '...' : formatNumber(totalFollowers)} 
          sub={connectedCount === 0 ? "Sin datos" : "+12% este mes"} 
          icon={<Users size={22} className="text-blue-400" />}
          ringColor="ring-blue-500/30"
          bgIcon="bg-blue-500/10"
          trend="up"
        />
        <MetricCard 
          title="Cuentas Activas" 
          value={loading ? '...' : connectedCount.toString()} 
          sub={`${activePlatforms.size} plataformas`} 
          icon={<TrendingUp size={22} className="text-emerald-400" />}
          ringColor="ring-emerald-500/30"
          bgIcon="bg-emerald-500/10"
        />
        <MetricCard 
          title="Publicaciones" 
          value="0" 
          sub="Programadas" 
          icon={<Activity size={22} className="text-amber-400" />}
          ringColor="ring-amber-500/30"
          bgIcon="bg-amber-500/10"
        />
        <MetricCard 
          title="Alcance (7d)" 
          value="0" 
          sub="Impresiones orgánicas" 
          icon={<BarChart2 size={22} className="text-purple-400" />}
          ringColor="ring-purple-500/30"
          bgIcon="bg-purple-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up delay-300">
        
        {/* Columna Izquierda: Cuentas Conectadas */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-card rounded-3xl overflow-hidden group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-white/5 bg-white/5">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-lg font-bold text-white">Tu Ecosistema Digital</h2>
                <p className="text-xs text-zinc-400 mt-1">Cuentas vinculadas a este workspace</p>
              </div>
              <Link href="/dashboard/cuentas" className="text-sm text-blue-400 hover:text-blue-300 font-bold flex items-center space-x-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-all border border-blue-500/20 w-fit">
                <span>Gestionar</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1,2].map(i => (
                    <div key={i} className="h-20 bg-white/5 rounded-2xl"></div>
                  ))}
                </div>
              ) : accounts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accounts.map(account => (
                    <AccountPremiumCard key={account.id} account={account} />
                  ))}
                  <Link href="/dashboard/cuentas" className="flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-white/20 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all h-[104px] group/add">
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover/add:bg-blue-500/20 flex items-center justify-center mb-2 transition-colors">
                      <Plus size={18} className="text-zinc-400 group-hover/add:text-blue-400 transition-colors" />
                    </div>
                    <span className="text-xs font-bold text-zinc-500 group-hover/add:text-blue-400 transition-colors uppercase tracking-wide">Vincular Nueva</span>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-12 px-4 bg-zinc-900/40 rounded-2xl border border-white/5 relative overflow-hidden">
                  {/* Decorative glow inside empty state */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>
                  
                  <div className="w-16 h-16 bg-zinc-800/80 rounded-2xl flex items-center justify-center mx-auto mb-5 ring-1 ring-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative z-10 border border-white/5">
                    <Sparkles size={24} className="text-blue-400" />
                  </div>
                  <p className="text-lg font-bold text-white relative z-10">Ninguna cuenta detectada</p>
                  <p className="text-sm text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed relative z-10">
                    Sincroniza tus redes sociales para que nuestra IA comience a procesar tus estadísticas y automatizar contenido.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Columna Derecha: Plataformas Disponibles */}
        <div className="glass-card rounded-3xl p-6 h-fit relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h2 className="text-lg font-bold text-white mb-1 relative z-10">Conexiones Rápidas</h2>
          <p className="text-xs text-zinc-400 mb-6 relative z-10">Autorización segura OAuth 2.0</p>
          
          <div className="space-y-3 relative z-10">
            {Object.values(PLATFORM_CONFIGS).slice(0, 4).map((platform) => {
              const isConnected = activePlatforms.has(platform.id);
              return (
                <Link
                  key={platform.id}
                  href="/dashboard/cuentas"
                  className={`flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 group
                    ${isConnected 
                      ? 'bg-zinc-900/50 border border-white/5 opacity-50 pointer-events-none grayscale' 
                      : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                    }
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-inner ring-1 ring-white/20"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.name[0]}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-zinc-100 block">{platform.name}</span>
                      <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5 block">
                        {isConnected ? 'Verificado ✓' : 'Conectar'}
                      </span>
                    </div>
                  </div>
                  {!isConnected && (
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/5 group-hover:border-white/10">
                      <ArrowRight size={14} className="text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Componentes UI ────────────────────────────────────────────────────────────

function MetricCard({ title, value, sub, icon, bgIcon, ringColor, trend }: { title: string; value: string; sub: string; icon: React.ReactNode; bgIcon: string; ringColor: string; trend?: 'up' | 'down' }) {
  return (
    <div className="glass-card p-5 rounded-3xl hover:bg-white/[0.03] transition-all duration-300 group relative overflow-hidden">
      {/* Subtle hover glow inside the card */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-[50px] group-hover:bg-white/10 transition-colors pointer-events-none"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2.5 rounded-xl ${bgIcon} ring-1 ${ringColor} shadow-inner backdrop-blur-sm`}>
          {icon}
        </div>
        {trend === 'up' && (
          <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <TrendingUp size={10} />
            <span>+12%</span>
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1.5">{title}</p>
        <div className="mt-3">
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-900/80 border border-white/5 px-2.5 py-1 rounded-md">
            {sub}
          </span>
        </div>
      </div>
    </div>
  );
}

function AccountPremiumCard({ account }: { account: SocialAccount }) {
  const config = PLATFORM_CONFIGS[account.platform];
  
  return (
    <div className="flex items-center p-3.5 bg-zinc-900/50 border border-white/5 rounded-2xl shadow-inner hover:bg-zinc-800/50 hover:border-white/10 transition-all duration-300 group">
      <div className="relative">
        {account.avatarUrl ? (
          <img src={account.avatarUrl} alt={account.accountName} className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 shadow-lg" />
        ) : (
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-inner ring-1 ring-white/10" style={{ backgroundColor: config.color }}>
            {config.name[0]}
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-900 flex items-center justify-center text-[8px] text-white font-bold shadow-sm" style={{ backgroundColor: config.color }}>
          {config.name[0]}
        </div>
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <p className="text-sm font-bold text-zinc-100 truncate group-hover:text-white transition-colors">{account.accountName}</p>
        <div className="flex items-center space-x-1.5 mt-1">
          <span className="text-[11px] font-bold text-zinc-400">{formatNumber(account.followerCount || 0)}</span>
          <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">seguidores</span>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
