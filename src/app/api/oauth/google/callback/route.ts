/**
 * GET /api/oauth/google/callback
 *
 * Recibe el código de autorización de Google OAuth 2.0,
 * intercambia tokens, obtiene info del canal de YouTube
 * y guarda la cuenta usando la Firestore REST API
 * (sin firebase-admin, sin dependencias extra).
 */

import { NextRequest, NextResponse } from 'next/server';

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents`;

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const stateParam = searchParams.get('state');
  const error = searchParams.get('error');

  const redirectBase = `${process.env.NEXT_PUBLIC_APP_URL ?? origin}/dashboard/cuentas`;

  // ── Error o cancelación del usuario ────────────────────────────────────────
  if (error || !code || !stateParam) {
    return NextResponse.redirect(`${redirectBase}?oauth_error=${error ?? 'missing_code'}`);
  }

  // ── Decodificar state ───────────────────────────────────────────────────────
  let state: { tenantId: string; userId: string; platform: string };
  try {
    state = JSON.parse(atob(stateParam));
  } catch {
    return NextResponse.redirect(`${redirectBase}?oauth_error=invalid_state`);
  }

  // ── Intercambiar code por tokens ────────────────────────────────────────────
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL ?? origin}/api/oauth/google/callback`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    console.error('[OAuth] token exchange failed:', await tokenRes.text());
    return NextResponse.redirect(`${redirectBase}?oauth_error=token_exchange_failed`);
  }

  const tokenData: {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope: string;
  } = await tokenRes.json();

  // ── Info del canal de YouTube ───────────────────────────────────────────────
  let channelName = 'Canal de YouTube';
  let channelId = '';
  let avatarUrl = '';
  let subscriberCount = 0;

  try {
    const ytRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    );
    if (ytRes.ok) {
      const yt = await ytRes.json();
      const ch = yt.items?.[0];
      if (ch) {
        channelName = ch.snippet.title;
        channelId = ch.id;
        avatarUrl = ch.snippet.thumbnails?.default?.url ?? '';
        subscriberCount = parseInt(ch.statistics?.subscriberCount ?? '0', 10);
      }
    }
  } catch (e) {
    console.warn('[OAuth] YouTube channel fetch failed:', e);
  }

  // ── Pasar datos al cliente para que guarde en Firestore ─────────────────────
  // En lugar de guardar desde el servidor (que requiere firebase-admin y dio error de db),
  // enviamos los datos de vuelta al frontend de forma segura temporal.
  // El frontend tiene la sesión de Firebase activa y las reglas le permitirán escribir.
  
  const payload = {
    platform: 'youtube',
    channelName,
    channelId,
    avatarUrl,
    subscriberCount,
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    scopes: tokenData.scope.split(' '),
    expiresIn: tokenData.expires_in,
    tenantId: state.tenantId,
    userId: state.userId
  };

  const encodedPayload = btoa(encodeURIComponent(JSON.stringify(payload)));

  return NextResponse.redirect(
    `${redirectBase}?oauth_payload=${encodedPayload}`
  );
}
