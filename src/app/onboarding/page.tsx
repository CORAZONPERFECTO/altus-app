"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createTenant } from '@/lib/firestore';

/**
 * Pantalla de Onboarding.
 * Se muestra cuando un usuario se loguea por primera vez y no tiene tenant asignado.
 * Permite crear una nueva organización.
 *
 * IMPORTANTE: Esperamos a que Firebase Auth inicialice (`loading = false`)
 * antes de hacer cualquier llamada a Firestore. Si se llama a Firestore con
 * request.auth == null las reglas de seguridad devuelven "Missing or insufficient permissions".
 */
export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirigir al login si Firebase Auth terminó de cargar y no hay usuario
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  const [orgName, setOrgName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOrgNameChange = (value: string) => {
    setOrgName(value);
    // Auto-generar el slug desde el nombre de la organización
    setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setIsSubmitting(true);

    try {
      // Crear el tenant directamente (slug único garantizado por ID de Firestore)
      await createTenant(user.uid, {
        name: orgName,
        slug,
        email: user.email ?? '',
        displayName: user.displayName ?? user.email ?? 'Usuario',
      });

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error creando organización:', err);
      setError('Ocurrió un error al crear tu organización. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mientras Firebase Auth no ha terminado de inicializar, mostramos un spinner.
  // Esto evita que el formulario intente llamar a Firestore sin token de auth.
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1A56DB]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0B1B3D] rounded-2xl mb-4 shadow-lg">
            <Building2 className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-[#0B1B3D] tracking-tight">
            Crea tu organización
          </h1>
          <p className="text-gray-500 mt-2">
            Configura tu espacio de trabajo en Altus. Podrás invitar a tu equipo después.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] p-8 border border-gray-50">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre de la organización
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => handleOrgNameChange(e.target.value)}
                placeholder="Ej: Agencia Creativa Norte"
                autoComplete="off"
                required
                minLength={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A56DB]/30 focus:border-[#1A56DB] outline-none transition-all text-sm"
              />
            </div>

            {slug && (
              <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                <p className="text-xs text-gray-500">Tu URL de workspace será:</p>
                <p className="text-sm font-medium text-[#0B1B3D] mt-0.5">
                  altus.app/<span className="text-[#1A56DB]">{slug}</span>
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || orgName.length < 3}
              className="w-full flex items-center justify-center space-x-2 bg-[#0B1B3D] hover:bg-[#1A56DB] text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creando organización...</span>
                </>
              ) : (
                <>
                  <span>Continuar al Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Al continuar, aceptas los{' '}
          <span className="text-[#1A56DB] cursor-pointer hover:underline">Términos de Servicio</span>
          {' '}de Altus.
        </p>
      </div>
    </div>
  );
}
