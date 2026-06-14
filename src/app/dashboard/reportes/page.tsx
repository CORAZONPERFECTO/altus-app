"use client";

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  Activity, 
  ArrowUpRight,
  ArrowDownRight,
  Download,
  ArrowRight,
  BarChart2
} from 'lucide-react';
import { getSocialAccounts } from '@/lib/firestore';

export default function AnalyticsPage() {
  const { tenant } = useTenant();
  const [period, setPeriod] = useState<'7d' | '30d' | '1y'>('30d');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccounts, setHasAccounts] = useState<boolean | null>(null);

  useEffect(() => {
    if (tenant?.id) {
      loadAnalytics();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant?.id, period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // First check if user has accounts connected
      const accounts = await getSocialAccounts(tenant!.id, '');
      if (accounts.length === 0) {
        setHasAccounts(false);
        setLoading(false);
        return;
      }
      setHasAccounts(true);

      const res = await fetch(`/api/analytics?tenantId=${tenant?.id}&period=${period}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="animate-fade-up max-w-6xl mx-auto pb-10">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="bg-emerald-500/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-emerald-400 border border-emerald-500/20 shadow-sm flex items-center space-x-1.5 uppercase tracking-wider">
              <Activity size={14} className="text-emerald-400" />
              <span>Reportes en Tiempo Real</span>
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Analíticas de <span className="text-gradient-accent">Rendimiento</span>
          </h1>
          <p className="text-zinc-400 mt-2 text-sm font-medium">
            Métricas unificadas de todas tus redes sociales para la toma de decisiones.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="glass-panel p-1 rounded-xl flex bg-zinc-900/50 border border-white/5 flex-1 md:flex-none">
            {[
              { id: '7d', label: '7 Días' },
              { id: '30d', label: '30 Días' },
              { id: '1y', label: '1 Año' }
            ].map(p => (
              <button 
                key={p.id}
                onClick={() => setPeriod(p.id as any)}
                className={`flex-1 md:flex-none py-2 px-4 rounded-lg text-xs font-bold transition-all ${period === p.id ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button className="h-10 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 flex items-center justify-center transition-colors">
            <Download size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-zinc-900/50 border border-white/5 rounded-3xl animate-pulse"></div>)}
          </div>
          <div className="h-[400px] bg-zinc-900/50 border border-white/5 rounded-3xl animate-pulse"></div>
        </div>
      ) : hasAccounts === false ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center mt-10">
          <div className="w-20 h-20 bg-zinc-900/80 rounded-3xl flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <BarChart2 size={32} className="text-zinc-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Métricas en pausa</h3>
          <p className="text-zinc-400 font-medium max-w-md mx-auto mb-6">
            Aún no has conectado ninguna marca. Altus necesita acceso a tus redes sociales para comenzar a recopilar métricas y generar reportes.
          </p>
          <a href="/dashboard/cuentas" className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors inline-flex items-center space-x-2">
            <span>Conectar Marca</span>
            <ArrowRight size={16} />
          </a>
        </div>
      ) : !data ? null : (
        <div className="space-y-6">
          
          {/* KPIs CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard 
              title="Audiencia Total" 
              value={formatNumber(data.kpis.totalAudience)} 
              trend={data.kpis.audienceGrowth} 
              icon={<Users size={20} />} 
              color="blue"
            />
            <KpiCard 
              title="Interacciones Totales" 
              value={formatNumber(data.kpis.totalEngagement)} 
              trend={data.kpis.engagementGrowth} 
              icon={<MousePointerClick size={20} />} 
              color="purple"
            />
            <KpiCard 
              title="Alcance Promedio" 
              value={formatNumber(data.kpis.avgPostReach)} 
              trend="+5.3%" 
              icon={<TrendingUp size={20} />} 
              color="emerald"
            />
            <KpiCard 
              title="Cuentas Activas" 
              value={data.kpis.activePlatforms.toString()} 
              trend="Estable" 
              icon={<BarChart3 size={20} />} 
              color="zinc"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* MAIN AREA CHART (CUSTOM CSS IMPLEMENTATION) */}
            <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-white/5 flex flex-col h-[420px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-white font-bold text-lg">Crecimiento de Audiencia</h3>
                  <p className="text-zinc-500 text-xs mt-1">Evolución de seguidores en este periodo</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5 text-xs text-zinc-400 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                    <span>Audiencia</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 relative w-full flex items-end justify-between px-2 pb-6 pt-4 border-b border-white/5 mt-auto">
                {/* Y Axis Guides */}
                <div className="absolute inset-x-0 bottom-6 top-4 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3].map(i => (
                     <div key={i} className="w-full h-[1px] bg-white/5 flex items-center justify-end">
                       {i === 0 && <span className="absolute -left-2 -translate-x-full text-[10px] text-zinc-600">Max</span>}
                     </div>
                  ))}
                </div>

                {data.growthData.map((d: any, index: number) => {
                   const maxVal = Math.max(...data.growthData.map((x: any) => x.audience));
                   const minVal = Math.min(...data.growthData.map((x: any) => x.audience)) * 0.9; // Base buffer
                   const normalizedHeight = Math.max(10, ((d.audience - minVal) / (maxVal - minVal)) * 100);
                   
                   return (
                     <div key={index} className="relative flex flex-col items-center group w-full px-1">
                       {/* Tooltip */}
                       <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-xs font-bold py-1 px-2 rounded-lg z-20 whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
                         {formatNumber(d.audience)}
                       </div>
                       
                       {/* Bar */}
                       <div 
                         className="w-full max-w-[40px] bg-gradient-to-t from-blue-600/20 to-blue-500 rounded-t-sm relative transition-all duration-500 group-hover:brightness-125 group-hover:from-blue-600/40"
                         style={{ height: `${normalizedHeight}%` }}
                       >
                          <div className="absolute top-0 inset-x-0 h-1 bg-blue-300 opacity-50 rounded-t-sm"></div>
                       </div>
                       
                       {/* X Axis Label */}
                       <span className="absolute -bottom-6 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{d.name}</span>
                     </div>
                   );
                })}
              </div>
            </div>

            {/* PLATFORM PERFORMANCE BAR CHART (CUSTOM CSS) */}
            <div className="lg:col-span-1 glass-card rounded-3xl p-6 border border-white/5 flex flex-col h-[420px]">
              <h3 className="text-white font-bold text-lg mb-1">Rendimiento por Red</h3>
              <p className="text-zinc-500 text-xs mb-8">Vistas totales en este periodo</p>
              
              <div className="flex-1 space-y-6">
                {data.platformPerformance.map((platform: any, index: number) => {
                  const maxViews = Math.max(...data.platformPerformance.map((p: any) => p.views));
                  const percentage = (platform.views / maxViews) * 100;
                  
                  return (
                    <div key={index} className="relative group">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-zinc-300">{platform.name}</span>
                        <span className="text-xs font-black text-white">{formatNumber(platform.views)}</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-white/5 relative">
                        <div 
                          className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                          style={{ width: `${percentage}%`, backgroundColor: platform.fill }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <button className="w-full text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center">
                  Ver desglose completo <ArrowRight size={14} className="ml-1" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ title, value, trend, icon, color }: { title: string, value: string, trend: string, icon: any, color: 'blue' | 'purple' | 'emerald' | 'zinc' }) {
  const isPositive = trend.includes('+') || trend === 'Estable';
  const colorMap = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    zinc: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
  };

  return (
    <div className="glass-card rounded-3xl p-5 border border-white/5 relative overflow-hidden group hover:bg-white/[0.02] transition-colors">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 transition-opacity group-hover:opacity-40 ${color === 'blue' ? 'bg-blue-500' : color === 'purple' ? 'bg-purple-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-zinc-500'}`}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-md border text-[10px] font-bold ${isPositive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          <span>{trend}</span>
        </div>
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-black text-white">{value}</h3>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">{title}</p>
      </div>
    </div>
  );
}
