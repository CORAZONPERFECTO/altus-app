"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/hooks/useTenant';
import { getTenantMembers, createInvitation, getPendingInvitations } from '@/lib/firestore';
import { Users, UserPlus, Copy, CheckCircle, Mail, Clock } from 'lucide-react';
import type { TenantMember } from '@/types';

export default function EquipoPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (tenant) {
      loadData();
    }
  }, [tenant]);

  const loadData = async () => {
    if (!tenant) return;
    try {
      const m = await getTenantMembers(tenant.id);
      setMembers(m);
      const invs = await getPendingInvitations(tenant.id);
      setInvitations(invs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant || !inviteEmail) return;
    
    setLoading(true);
    try {
      const token = await createInvitation(tenant.id, inviteEmail, inviteRole);
      const link = `${window.location.origin}/invite/${tenant.id}?token=${token}`;
      setGeneratedLink(link);
      setInviteEmail('');
      loadData();
    } catch (error) {
      console.error(error);
      alert('Error creando invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!tenant) return null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
          <Users className="text-blue-500" />
          <span>Mi Equipo</span>
        </h1>
        <p className="text-zinc-400 mt-2">Gestiona los miembros de tu espacio de trabajo y sus permisos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Miembros Actuales */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel border border-white/5 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Miembros Activos ({members.length})</h2>
            <div className="space-y-4">
              {members.map(member => (
                <div key={member.userId} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white">
                      {member.displayName ? member.displayName[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{member.displayName}</p>
                      <p className="text-xs text-zinc-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      member.role === 'owner' ? 'bg-amber-500/20 text-amber-400' : 
                      member.role === 'admin' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-zinc-500/20 text-zinc-400'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invitaciones Pendientes */}
          {invitations.length > 0 && (
            <div className="glass-panel border border-white/5 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Invitaciones Pendientes ({invitations.length})</h2>
              <div className="space-y-4">
                {invitations.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-300">{inv.email}</p>
                        <p className="text-xs text-zinc-500">Rol: {inv.role}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const link = `${window.location.origin}/invite/${tenant.id}?token=${inv.token}`;
                        navigator.clipboard.writeText(link);
                        alert('Enlace copiado al portapapeles');
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                    >
                      <Copy size={14} />
                      <span>Copiar Enlace</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Formulario de Invitación */}
        <div className="space-y-6">
          <div className="glass-panel border border-white/5 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                <UserPlus size={20} className="text-indigo-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Invitar Miembro</h2>
            </div>
            
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    type="email" 
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="ejemplo@agencia.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Rol</label>
                <select 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                >
                  <option value="admin">Administrador (Acceso total)</option>
                  <option value="editor">Editor (Puede publicar e interactuar)</option>
                  <option value="viewer">Lector (Solo reportes)</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {loading ? 'Generando...' : 'Generar Enlace'}
              </button>
            </form>

            {generatedLink && (
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl animate-fade-in">
                <p className="text-xs text-green-400 font-bold mb-2">¡Enlace Mágico Generado!</p>
                <div className="flex items-center space-x-2">
                  <input 
                    readOnly
                    value={generatedLink}
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-zinc-300 focus:outline-none"
                  />
                  <button 
                    onClick={handleCopy}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  >
                    {copied ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 mt-2">Copia este enlace y envíalo por WhatsApp o correo a tu invitado.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
