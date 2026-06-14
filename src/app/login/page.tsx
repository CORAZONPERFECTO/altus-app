"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

const googleProvider = new GoogleAuthProvider();

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // ── Google Sign-In ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Email / Contraseña ──────────────────────────────────────────────────────
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor llena todos los campos.');
      return;
    }

    if (mode === 'register' && !termsAccepted) {
      setError('Debes aceptar los Términos de Servicio y Políticas de Privacidad para crear una cuenta.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB]/20 border-t-[#1A56DB] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#0B1B3D] tracking-tight">Altus.</Link>
          <p className="text-gray-500 mt-2 text-sm">
            {mode === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta en Altus'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] p-8 border border-gray-50">

          {/* Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            <span>Continuar con Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-gray-100" />
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider">o con email</span>
            <div className="flex-grow border-t border-gray-100" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A56DB]/30 focus:border-[#1A56DB] outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1A56DB]/30 focus:border-[#1A56DB] outline-none transition-all text-sm"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Terms and Privacy Checkbox for Registration */}
            {mode === 'register' && (
              <div className="flex items-start mt-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#1A56DB] border-gray-300 rounded focus:ring-[#1A56DB] cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2 block text-xs text-gray-500">
                  He leído y acepto los{' '}
                  <Link href="/terminos" target="_blank" className="text-[#1A56DB] hover:underline font-medium">Términos de Servicio</Link>
                  {' '}y la{' '}
                  <Link href="/privacidad" target="_blank" className="text-[#1A56DB] hover:underline font-medium">Política de Privacidad</Link>.
                </label>
              </div>
            )}
            
            {/* Disclaimer for Login */}
            {mode === 'login' && (
              <div className="text-center text-xs text-gray-400 mt-2">
                Al iniciar sesión, aceptas nuestros <Link href="/terminos" target="_blank" className="hover:text-gray-600 underline">Términos</Link> y <Link href="/privacidad" target="_blank" className="hover:text-gray-600 underline">Privacidad</Link>.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0B1B3D] hover:bg-[#1A56DB] text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting
                ? 'Procesando...'
                : mode === 'login'
                  ? 'Iniciar Sesión'
                  : 'Crear Cuenta'}
            </button>
          </form>
        </div>

        {/* Toggle */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-[#1A56DB] font-medium hover:underline"
          >
            {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}

// ── Google Icon SVG ────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

// ── Error Messages ─────────────────────────────────────────────────────────────
function getFirebaseErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const code = (err as { code: string }).code;
    const messages: Record<string, string> = {
      'auth/user-not-found': 'No encontramos una cuenta con ese email.',
      'auth/wrong-password': 'Contraseña incorrecta. Inténtalo de nuevo.',
      'auth/email-already-in-use': 'Este email ya tiene una cuenta registrada.',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      'auth/invalid-email': 'El formato del email no es válido.',
      'auth/popup-closed-by-user': 'Cerraste la ventana de Google antes de completar.',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
      'auth/invalid-credential': 'Credenciales incorrectas. Verifica tu email y contraseña.',
    };
    return messages[code] ?? 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }
  return 'Ocurrió un error inesperado.';
}
