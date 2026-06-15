import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const stateParam = searchParams.get('state');
  const redirectBase = `${process.env.NEXT_PUBLIC_APP_URL ?? origin}/dashboard/cuentas`;

  if (!stateParam) {
    return NextResponse.redirect(`${redirectBase}?oauth_error=missing_state`);
  }

  // Simular latencia de red de TikTok
  await new Promise(resolve => setTimeout(resolve, 800));

  const payload = {
    platform: 'tiktok',
    channelName: '@creador.viral',
    channelId: `tk-${Math.floor(Math.random() * 1000000)}`,
    avatarUrl: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
    subscriberCount: Math.floor(Math.random() * 500000) + 10000,
    accessToken: `mock-tiktok-token-${Date.now()}`,
    refreshToken: `mock-tiktok-refresh-${Date.now()}`,
    scopes: ['user.info.basic', 'video.list'],
    userId: 'mock-user'
  };

  const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
  return NextResponse.redirect(`${redirectBase}?oauth_payload=${encoded}`);
}
