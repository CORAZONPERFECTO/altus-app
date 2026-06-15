import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const stateParam = searchParams.get('state');
  const redirectBase = `${process.env.NEXT_PUBLIC_APP_URL ?? origin}/dashboard/cuentas`;

  if (!stateParam) {
    return NextResponse.redirect(`${redirectBase}?oauth_error=missing_state`);
  }

  // Simular latencia de red de LinkedIn
  await new Promise(resolve => setTimeout(resolve, 1000));

  const payload = {
    platform: 'linkedin',
    channelName: 'Luis C. Alberti (CEO)',
    channelId: `li-${Math.floor(Math.random() * 1000000)}`,
    avatarUrl: 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
    subscriberCount: Math.floor(Math.random() * 15000) + 2000,
    accessToken: `mock-linkedin-token-${Date.now()}`,
    refreshToken: `mock-linkedin-refresh-${Date.now()}`,
    scopes: ['r_liteprofile', 'r_organization_social'],
    userId: 'mock-user'
  };

  const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
  return NextResponse.redirect(`${redirectBase}?oauth_payload=${encoded}`);
}
