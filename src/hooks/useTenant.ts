"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getOrCreateUserProfile, getTenant } from '@/lib/firestore';
import type { Tenant, UserProfile } from '@/types';

interface UseTenantReturn {
  tenant: Tenant | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshTenant: () => Promise<void>;
}

/**
 * Hook para obtener y gestionar el tenant activo del usuario.
 * Combina el perfil del usuario con los datos del tenant para
 * tener todo el contexto de la organización disponible en la app.
 *
 * CORRECCIÓN RAÍZ: Esperamos `authLoading = false` antes de tocar Firestore.
 * Si se llama a Firestore mientras authLoading=true, el token aún no está
 * adjunto al SDK y las reglas devuelven "Missing or insufficient permissions".
 * Además forzamos un getIdToken() para asegurarnos de que Firebase ya
 * tiene el token activo antes del primer request a Firestore.
 */
export function useTenant(): UseTenantReturn {
  const { user, loading: authLoading } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenantData = useCallback(async () => {
    // Esperamos a que Firebase Auth termine de inicializar.
    // Durante authLoading=true, user puede ser null aunque haya sesión activa.
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      setTenant(null);
      setProfile(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Forzar que el SDK tenga el token listo antes de cualquier request
      // a Firestore. Sin esto hay una ventana de ~200ms donde user != null
      // pero el token aún no está adjunto, causando:
      // "Missing or insufficient permissions".
      await user.getIdToken(/* forceRefresh */ false);

      // 1. Obtener o crear el perfil del usuario
      const userProfile = await getOrCreateUserProfile(user.uid, {
        email: user.email ?? '',
        displayName: user.displayName ?? '',
        photoURL: user.photoURL ?? undefined,
      });
      setProfile(userProfile);

      // 2. Si el usuario tiene un tenant, cargarlo
      if (userProfile.tenantId) {
        const tenantData = await getTenant(userProfile.tenantId);
        setTenant(tenantData);
      } else {
        // Usuario sin tenant — necesita onboarding
        setTenant(null);
      }
    } catch (err) {
      console.error('Error cargando datos del tenant:', err);
      setError('No se pudo cargar la información de tu organización.');
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    fetchTenantData();
  }, [fetchTenantData]);

  return {
    tenant,
    profile,
    // Combinamos ambos loadings: si auth aún no terminó, seguimos en loading
    loading: authLoading || loading,
    error,
    refreshTenant: fetchTenantData,
  };
}
