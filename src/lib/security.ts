import { NextResponse } from 'next/server';
import { adminAuth } from './firebase-admin';

/**
 * GUARDIAN SUPERIOR (Capa 2): Verificación de Origen y Anti-CSRF
 * Evita que otras páginas web o aplicaciones de terceros (Postman, scripts)
 * hagan peticiones a tu servidor. Solo acepta tráfico originado desde tu propio dominio.
 */
export function verifyOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host');

  // En desarrollo (localhost), permitimos el tráfico local
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  // En producción, el origen exacto debe coincidir con tu dominio oficial
  const allowedDomain = process.env.NEXT_PUBLIC_APP_URL || 'https://altus-app.com';

  if (origin && !origin.startsWith(allowedDomain)) {
    console.warn(`[SECURITY] Ataque CSRF bloqueado. Origen inválido: ${origin}`);
    return false;
  }

  if (referer && !referer.startsWith(allowedDomain)) {
    console.warn(`[SECURITY] Ataque bloqueado. Referer inválido: ${referer}`);
    return false;
  }

  // Si no hay Origin ni Referer (común en Postman o cURL), lo bloqueamos por defecto en producción
  if (!origin && !referer) {
     console.warn(`[SECURITY] Petición sin origen (posible script/bot) bloqueada.`);
     return false;
  }

  return true;
}

/**
 * GUARDIÁN 1 (Capa 1): Verificación de Firma Digital (Auth Token)
 * Garantiza que el usuario tiene una sesión válida en la plataforma y es quien dice ser.
 */
export async function requireAuth(request: Request) {
  // 1. Ejecutamos el Guardián Superior primero
  if (!verifyOrigin(request)) {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: 'Acceso Denegado: Origen no autorizado (Capa 2)' },
        { status: 403 }
      )
    };
  }

  // 2. Extraemos la firma digital (Token) de las cabeceras
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: 'Acceso Denegado: Credenciales faltantes (Capa 1)' },
        { status: 401 }
      )
    };
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // 3. Verificamos la firma criptográfica con la Bóveda de Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Si la firma es válida, devolvemos el ID del usuario real
    return { user: decodedToken };
  } catch (error) {
    console.error('[SECURITY] Token inválido o expirado:', error);
    return {
      errorResponse: NextResponse.json(
        { success: false, error: 'Acceso Denegado: Token inválido o expirado (Capa 1)' },
        { status: 401 }
      )
    };
  }
}
