"use client";

import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Wifi, WifiOff, AlertCircle, ExternalLink, Trash2, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { useAuth } from '@/hooks/useAuth';
import { getSocialAccounts, saveSocialAccount } from '@/lib/firestore';
import { PLATFORM_CONFIGS, SocialPlatform, SocialAccount } from '@/types';

// Plataformas habilitadas en esta versión
const AVAILABLE_PLATFORMS: SocialPlatform[] = ['youtube', 'instagram', 'facebook', 'tiktok'];
const COMING_SOON_PLATFORMS: SocialPlatform[] = ['linkedin', 'threads'];

export default function CuentasPage() {
  const { tenant } = useTenant();
  const { user } = useAuth();
  
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<SocialPlatform | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadAccounts = async () => {
    if (!tenant?.id) return;
    try {
      setLoading(true);
      const data = await getSocialAccounts(tenant.id, '');
      setAccounts(data);
    } catch (error) {
      console.error("Error al cargar cuentas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant?.id]);

  // Detectar callback OAuth de Google/YouTube en la URL
  useEffect(() => {
    const processOAuthPayload = async () => {
      const params = new URLSearchParams(window.location.search);
      const oauthPayload = params.get('oauth_payload');
      const oauthError = params.get('oauth_error');

      if (oauthError) {
        console.error('Error de OAuth:', oauthError);
        window.history.replaceState({}, '', '/dashboard/cuentas');
        return;
      }

      if (oauthPayload && tenant?.id) {
        try {
          const payload = JSON.parse(decodeURIComponent(atob(oauthPayload)));
          const accountId = `yt-${payload.channelId || Date.now()}`;
          
          await saveSocialAccount(tenant.id, accountId, {
            id: accountId,
            tenantId: tenant.id,
            workspaceId: '',
            platform: payload.platform,
            accountName: payload.channelName,
            accountId: payload.channelId,
            avatarUrl: payload.avatarUrl,
            followerCount: payload.subscriberCount,
            status: 'connected',
            secretRef: `dev-token-${accountId}`,
            scopes: payload.scopes,
            connectedBy: payload.userId,
            _devAccessToken: payload.accessToken,
            _devRefreshToken: payload.refreshToken || null,
          });

          setSuccessMessage(`¡Cuenta conectada con éxito! La magia ha comenzado.`);
          window.history.replaceState({}, '', '/dashboard/cuentas');
          loadAccounts();
          setTimeout(() => setSuccessMessage(null), 5000);
        } catch (error) {
          console.error('Error procesando payload OAuth:', error);
        }
      }
    };

    processOAuthPayload();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant?.id]);

  const handleConnect = (platform: SocialPlatform) => {
    if (!tenant?.id || !user?.uid) return;
    
    setConnecting(platform);

    if (platform === 'youtube') {
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.append('client_id', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '');
      authUrl.searchParams.append('redirect_uri', `${window.location.origin}/api/oauth/google/callback`);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly');
      authUrl.searchParams.append('access_type', 'offline');
      authUrl.searchParams.append('prompt', 'consent');
      authUrl.searchParams.append('state', JSON.stringify({ 
        tenantId: tenant.id, 
        userId: user.uid,
        platform: 'youtube'
      }));

      window.location.href = authUrl.toString();
      return;
    }

    setTimeout(() => {
      setConnecting(null);
      alert(`La integración con ${PLATFORM_CONFIGS[platform].name} estará disponible pronto.`);
    }, 1500);
  };

  const activePlatforms = new Set(accounts.map(a => a.platform));

  return (
    <div className="animate-fade-up max-w-5xl mx-auto">
      {/* Header Vanguardista */}
      <div className="mb-12 relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <span className="bg-zinc-800/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-zinc-300 border border-white/10 shadow-sm flex items-center space-x-1.5 uppercase tracking-wider">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Conexiones Seguras OAuth 2.0</span>
          </span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Ecosistema <span className="text-gradient-accent">Digital</span>
        </h1>
        <p className="text-zinc-400 mt-3 text-sm max-w-xl font-medium leading-relaxed">
          Vincula tus redes sociales para sincronizar datos en tiempo real. Utilizamos protocolos cifrados para proteger el acceso a tus perfiles.
        </p>
      </div>

      {/* Banner de Éxito Flotante */}
      {successMessage && (
        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 animate-fade-up shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
          <p className="text-sm font-semibold text-emerald-100">{successMessage}</p>
        </div>
      )}

      {/* SECCIÓN: CUENTAS CONECTADAS */}
      <div className="mb-14">
        <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          Conectadas ({accounts.length})
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-zinc-900/50 border border-white/5 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-900/80 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <WifiOff size={24} className="text-zinc-500" />
            </div>
            <p className="text-zinc-300 font-semibold">Sin conexiones activas</p>
            <p className="text-zinc-500 text-sm mt-1 max-w-sm">
              Selecciona una plataforma del catálogo inferior para autorizar el acceso y comenzar a recolectar analíticas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {accounts.map(account => (
              <ConnectedAccountCard key={account.id} account={account} />
            ))}
          </div>
        )}
      </div>

      {/* SECCIÓN: CATÁLOGO DE PLATAFORMAS */}
      <div className="mb-14">
        <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          Catálogo de Integraciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_PLATFORMS.map(platformId => {
            const config = PLATFORM_CONFIGS[platformId];
            const isConnected = activePlatforms.has(platformId);
            return (
              <PlatformConnectCard 
                key={platformId} 
                config={config} 
                isConnected={isConnected} 
                isConnecting={connecting === platformId}
                onConnect={() => handleConnect(platformId)} 
              />
            );
          })}
        </div>
      </div>

      {/* SECCIÓN: PRÓXIMAMENTE */}
      <div>
        <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] mb-6 flex items-center">
          <span className="w-2 h-2 rounded-full bg-zinc-700 mr-2"></span>
          En Desarrollo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {COMING_SOON_PLATFORMS.map(platformId => (
            <div key={platformId} className="flex items-center p-4 bg-zinc-900/30 border border-white/5 rounded-2xl group">
              <BrandGlassIcon platformId={platformId} color={PLATFORM_CONFIGS[platformId].color} />
              <div className="ml-4 flex-1">
                <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors block">{PLATFORM_CONFIGS[platformId].name}</span>
                <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">Próximamente</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Helpers & Íconos ────────────────────────────────────────────────────────────

// Renderiza el logotipo SVG puro usando SVG directos para evitar dependencias de marcas en lucide-react
function PlatformIcon({ platform, className = "" }: { platform: string, className?: string }) {
  switch(platform) {
    case 'youtube': return (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
    case 'instagram': return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    );
    case 'facebook': return (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    );
    case 'linkedin': return (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    );
    case 'tiktok': return (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    );
    default: return <Sparkles className={className} strokeWidth={1.5} />;
  }
}

// Contenedor "Glass & Glow"
function BrandGlassIcon({ platformId, color, size = 'normal' }: { platformId: string, color: string, size?: 'normal' | 'large' }) {
  const isLarge = size === 'large';
  return (
    <div className="relative group/icon flex-shrink-0">
      {/* Neblina / Glow detrás del cristal */}
      <div 
        className="absolute inset-0 rounded-2xl blur-[12px] opacity-40 group-hover/icon:opacity-80 group-hover/icon:blur-[16px] transition-all duration-500"
        style={{ backgroundColor: color }}
      ></div>
      
      {/* Caja de Cristal */}
      <div className={`relative ${isLarge ? 'w-14 h-14' : 'w-12 h-12'} rounded-2xl flex items-center justify-center bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-transform duration-300 group-hover/icon:scale-105`}>
        <PlatformIcon platform={platformId} className={`${isLarge ? 'w-7 h-7' : 'w-6 h-6'} text-zinc-100 drop-shadow-md`} />
      </div>
    </div>
  );
}

function ConnectedAccountCard({ account }: { account: SocialAccount }) {
  const config = PLATFORM_CONFIGS[account.platform];
  
  return (
    <div className="relative overflow-hidden glass-card p-5 rounded-3xl border border-white/5 hover:border-white/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 group">
      {/* Resplandor de fondo dinámico basado en la marca */}
      <div 
        className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
        style={{ backgroundColor: config.color }}
      ></div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <BrandGlassIcon platformId={account.platform} color={config.color} size="large" />
          
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-blue-100 transition-colors">{account.accountName}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs font-semibold text-zinc-300">{formatNumber(account.followerCount || 0)}</span>
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">seguidores</span>
            </div>
            <div className="flex items-center space-x-1.5 mt-2">
              <Wifi size={12} className="text-emerald-400" />
              <span className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-wider">Sincronizado</span>
            </div>
          </div>
        </div>

        <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 flex items-center justify-center transition-colors border border-transparent hover:border-red-500/30">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function PlatformConnectCard({ config, isConnected, isConnecting, onConnect }: { config: any, isConnected: boolean, isConnecting: boolean, onConnect: () => void }) {
  return (
    <div className={`relative overflow-hidden p-5 rounded-3xl transition-all duration-300 group
      ${isConnected 
        ? 'bg-zinc-900/30 border border-white/5 opacity-60' 
        : 'glass-panel hover:bg-zinc-800/80 hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.5)] border border-white/5 hover:border-white/10'
      }
    `}>
      {/* Acento sutil en el borde izquierdo */}
      <div className="absolute left-0 top-0 bottom-0 w-1 opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: config.color }}></div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <BrandGlassIcon platformId={config.id} color={config.color} />
          <div>
            <span className="text-base font-bold text-white block">{config.name}</span>
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-0.5 block">
              {config.scopes?.length || 3} permisos req.
            </span>
          </div>
        </div>

        {isConnected ? (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Activa</span>
          </div>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-wait"
            style={{ backgroundColor: config.color }}
          >
            {isConnecting ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <ExternalLink size={14} />
            )}
            <span>{isConnecting ? 'Enlazando...' : 'Vincular'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
