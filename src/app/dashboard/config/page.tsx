"use client";

import React, { useState } from 'react';
import { useTenant } from '@/hooks/useTenant';
import { 
  Settings2, 
  User, 
  Bell, 
  ShieldCheck, 
  Camera, 
  Save, 
  CheckCircle2, 
  CreditCard
} from 'lucide-react';
import { updateTenantSettings } from '@/lib/firestore';

export default function SettingsPage() {
  const { tenant } = useTenant();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'billing'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [agencyName, setAgencyName] = useState(tenant?.name || 'Mi Agencia');
  const [email, setEmail] = useState('contacto@miagencia.com');
  const [timezone, setTimezone] = useState('America/Santo_Domingo');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant?.id) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateTenantSettings(tenant.id, {
        name: agencyName
        // Note: For email and timezone, you might want to add those fields to the Tenant type/schema later.
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-up max-w-6xl mx-auto pb-10">
      
      {/* HEADER */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center space-x-2 mb-3">
          <span className="bg-blue-500/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-blue-400 border border-blue-500/20 shadow-sm flex items-center space-x-1.5 uppercase tracking-wider">
            <Settings2 size={14} className="text-blue-400" />
            <span>Configuración de Workspace</span>
          </span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">
          Ajustes <span className="text-gradient-accent">Generales</span>
        </h1>
        <p className="text-zinc-400 mt-2 text-sm font-medium">
          Personaliza la experiencia y los datos de tu agencia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="md:col-span-3 space-y-1">
          <TabButton 
            id="profile" 
            label="Perfil de Agencia" 
            icon={<User size={18} />} 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')} 
          />
          <TabButton 
            id="preferences" 
            label="Preferencias" 
            icon={<Bell size={18} />} 
            active={activeTab === 'preferences'} 
            onClick={() => setActiveTab('preferences')} 
          />
          <TabButton 
            id="security" 
            label="Seguridad" 
            icon={<ShieldCheck size={18} />} 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')} 
          />
          <div className="pt-4 mt-4 border-t border-white/5">
            <TabButton 
              id="billing" 
              label="Facturación" 
              icon={<CreditCard size={18} />} 
              active={activeTab === 'billing'} 
              onClick={() => setActiveTab('billing')} 
            />
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="md:col-span-9">
          <div className="glass-card rounded-3xl p-8 border border-white/5">
            
            {saveSuccess && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center text-emerald-400 text-sm font-bold animate-fade-up">
                <CheckCircle2 size={18} className="mr-2" /> Los ajustes se han guardado exitosamente.
              </div>
            )}

            <form onSubmit={handleSave}>
              
              {/* === PROFILE TAB === */}
              {activeTab === 'profile' && (
                <div className="space-y-8 animate-fade-up">
                  <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4">Información del Workspace</h3>
                  
                  <div className="flex items-center space-x-6">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <div className="relative group" onClick={triggerFileInput}>
                      <div className="w-24 h-24 rounded-2xl bg-zinc-900 border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-zinc-500 group-hover:border-blue-500/50 group-hover:text-blue-400 transition-colors cursor-pointer overflow-hidden relative">
                        {logoPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Camera size={24} className="mb-1" />
                            <span className="text-[10px] font-bold">Subir Logo</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Logo de la Agencia</h4>
                      <p className="text-xs text-zinc-500 mt-1">Recomendado 512x512px. Formato PNG o SVG.</p>
                      <button type="button" onClick={triggerFileInput} className="mt-3 text-xs font-bold bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-colors border border-white/5">
                        Cambiar Imagen
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Nombre de Agencia</label>
                      <input 
                        type="text" 
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Correo de Contacto</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* === PREFERENCES TAB === */}
              {activeTab === 'preferences' && (
                <div className="space-y-8 animate-fade-up">
                  <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4">Preferencias Regionales</h3>
                  
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Zona Horaria (Vital para publicaciones)</label>
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                    >
                      <option value="America/Santo_Domingo">America/Santo_Domingo (AST)</option>
                      <option value="America/Bogota">America/Bogota (COT)</option>
                      <option value="America/Mexico_City">America/Mexico_City (CST)</option>
                      <option value="Europe/Madrid">Europe/Madrid (CET)</option>
                    </select>
                  </div>

                  <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4 mt-8 pt-4">Notificaciones</h3>
                  <div className="space-y-4">
                    <ToggleOption title="Resumen Semanal" description="Recibir un reporte analítico cada lunes en tu correo." defaultChecked />
                    <ToggleOption title="Alertas de Publicación" description="Notificarme cuando un post programado se publique con éxito." defaultChecked />
                    <ToggleOption title="Desconexión de API" description="Alertarme urgentemente si una red social caduca su token." defaultChecked />
                  </div>
                </div>
              )}

              {/* === SECURITY TAB === */}
              {activeTab === 'security' && (
                <div className="space-y-8 animate-fade-up">
                  <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4">Seguridad de la Cuenta</h3>
                  
                  <div>
                    <button type="button" onClick={() => alert("Se ha enviado un enlace a tu correo para restablecer la contraseña.")} className="text-sm font-bold bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl transition-colors border border-white/5">
                      Cambiar Contraseña
                    </button>
                    <p className="text-xs text-zinc-500 mt-2">Te enviaremos un correo con un enlace seguro para actualizarla.</p>
                  </div>

                  <div className="pt-4">
                    <div className="flex items-start justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
                      <div>
                        <h4 className="text-white font-bold text-sm">Autenticación de Dos Factores (2FA)</h4>
                        <p className="text-xs text-zinc-500 mt-1">Añade una capa extra de seguridad a tu cuenta.</p>
                      </div>
                      <button type="button" onClick={() => alert("Módulo 2FA en desarrollo.")} className="text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg hover:bg-blue-600/30 transition-colors">
                        Activar 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* === BILLING TAB === */}
              {activeTab === 'billing' && (
                <div className="space-y-8 animate-fade-up">
                  <h3 className="text-lg font-bold text-white border-b border-white/5 pb-4">Suscripción y Pagos</h3>
                  
                  <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <CreditCard size={100} />
                    </div>
                    <div className="relative z-10">
                      <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider rounded-md mb-4 inline-block">Plan Actual</span>
                      <h4 className="text-2xl font-black text-white mb-1">Agencia Starter</h4>
                      <p className="text-blue-200 text-sm mb-6">$99 USD / mes</p>
                      
                      <div className="space-y-2 mb-8">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-zinc-300">Cuentas Sociales</span>
                          <span className="text-white">4 / 10</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                          <div className="w-[40%] h-full bg-blue-400 rounded-full"></div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button type="button" onClick={() => alert("Pasarela de pagos en desarrollo.")} className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-xl transition-colors hover:bg-zinc-200">
                          Mejorar Plan
                        </button>
                        <button type="button" onClick={() => alert("Gestor de tarjetas de crédito en desarrollo.")} className="text-sm font-bold bg-black/40 text-white px-5 py-2.5 rounded-xl transition-colors border border-white/10 hover:bg-black/60">
                          Gestionar Tarjetas
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION FOOTER */}
              {activeTab !== 'billing' && activeTab !== 'security' && (
                <div className="mt-10 pt-6 border-t border-white/5 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center disabled:opacity-50"
                  >
                    {isSaving ? (
                      <span className="animate-pulse">Guardando...</span>
                    ) : (
                      <><Save size={16} className="mr-2" /> Guardar Cambios</>
                    )}
                  </button>
                </div>
              )}
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ id, label, icon, active, onClick }: { id: string, label: string, icon: any, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-zinc-800/80 text-white shadow-md border border-white/10' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}
    >
      <span className={`${active ? 'text-blue-400' : ''}`}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function ToggleOption({ title, description, defaultChecked }: { title: string, description: string, defaultChecked: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-900/30 border border-white/5 rounded-2xl cursor-pointer hover:bg-zinc-900/60 transition-colors" onClick={() => setChecked(!checked)}>
      <div>
        <h4 className="text-white font-bold text-sm">{title}</h4>
        <p className="text-xs text-zinc-500 mt-1">{description}</p>
      </div>
      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-blue-600' : 'bg-zinc-700'}`}>
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
      </div>
    </div>
  );
}
