"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/hooks/useTenant';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { tenant, loading: tenantLoading } = useTenant();
  const router = useRouter();

  const loading = authLoading || tenantLoading;

  useEffect(() => {
    if (loading) return;

    // Sin usuario → ir al login
    if (!user) {
      router.push('/login');
      return;
    }

    // Con usuario pero sin tenant → ir al onboarding
    if (user && !tenant) {
      router.push('/onboarding');
    }
  }, [user, tenant, loading, router]);

  // ── Loading State ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-[#0B1B3D]/10" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#1A56DB] animate-spin" />
          </div>
          <span className="text-sm text-gray-400 tracking-wide">Cargando Altus...</span>
        </div>
      </div>
    );
  }

  // Sin usuario o sin tenant → no renderizar (el useEffect redirige)
  if (!user || !tenant) return null;

  return <>{children}</>;
}
