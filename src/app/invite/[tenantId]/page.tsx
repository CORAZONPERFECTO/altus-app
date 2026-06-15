"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getInvitationByToken, acceptInvitation, getTenant } from '@/lib/firestore';
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';

export default function InvitePage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const tenantId = params.tenantId as string;
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [tenantName, setTenantName] = useState<string>('');
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (!tenantId || !token) {
      setError('Enlace inválido o incompleto.');
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const inv = await getInvitationByToken(tenantId, token);
        if (!inv) {
          setError('La invitación no existe, expiró o ya fue aceptada.');
          setLoading(false);
          return;
        }
        setInvitation(inv);
        
        const ten = await getTenant(tenantId);
        if (ten) setTenantName(ten.name);
      } catch (err) {
        setError('Error al cargar la información de la invitación.');
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [tenantId, token]);

  const handleAccept = async () => {
    if (!user || !invitation) return;
    setAccepting(true);
    try {
      await acceptInvitation(
        tenantId, 
        invitation.id, 
        user.uid, 
        user.email || invitation.email, 
        user.displayName || 'Usuario', 
        invitation.role
      );
      router.push('/dashboard');
    } catch (err) {
      setError('Hubo un error interno al intentar aceptar la invitación.');
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500 font-medium">
        Validando enlace de invitación...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel border border-white/5 rounded-3xl p-8 text-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-blue-500/10 blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Sparkles size={32} className="text-blue-400" />
          </div>

          {error ? (
            <div className="animate-fade-in">
              <AlertTriangle size={48} className="text-red-500 mx-auto mb-4 opacity-80" />
              <h2 className="text-xl font-bold mb-2">Enlace no válido</h2>
              <p className="text-zinc-400 mb-8">{error}</p>
              <button 
                onClick={() => router.push('/')}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-bold border border-white/10"
              >
                Volver al inicio
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-2 tracking-tight">¡Has sido invitado!</h2>
              <p className="text-zinc-400 mb-8">
                Se te ha invitado a colaborar en el espacio de trabajo <strong className="text-white">"{tenantName || 'Workspace'}"</strong> con el rol de <strong className="text-blue-400 uppercase text-[10px] tracking-wider px-2 py-0.5 bg-blue-500/10 rounded-full">{invitation.role}</strong>.
              </p>

              {!user ? (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-500 mb-2">Para aceptar, primero debes iniciar sesión de forma segura.</p>
                  <button 
                    onClick={signInWithGoogle}
                    className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Continuar con Google</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center font-bold border border-white/10">
                        {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">{user.displayName}</p>
                        <p className="text-[11px] text-zinc-400">{user.email}</p>
                      </div>
                    </div>
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                  
                  <button 
                    onClick={handleAccept}
                    disabled={accepting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  >
                    {accepting ? 'Aceptando y redirigiendo...' : 'Aceptar Invitación y Entrar'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
