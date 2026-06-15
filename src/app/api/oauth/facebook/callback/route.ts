import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const stateParam = searchParams.get('state');
  const redirectBase = `${process.env.NEXT_PUBLIC_APP_URL ?? origin}/dashboard/cuentas`;

  if (!stateParam) {
    return NextResponse.redirect(`${redirectBase}?oauth_error=missing_state`);
  }

  // Simular latencia de red de Meta (Instagram/Facebook)
  await new Promise(resolve => setTimeout(resolve, 900));

  const payload = {
    platform: 'instagram',
    channelName: 'Altus Software Official',
    channelId: `ig-${Math.floor(Math.random() * 1000000)}`,
    avatarUrl: 'https://cdn-icons-png.flaticon.com/512/1384/1384031.png',
    subscriberCount: Math.floor(Math.random() * 250000) + 50000,
    accessToken: `mock-meta-token-${Date.now()}`,
    refreshToken: `mock-meta-refresh-${Date.now()}`,
    scopes: ['instagram_basic', 'instagram_manage_insights', 'pages_show_list'],
    userId: 'mock-user'
  };

  const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
  return NextResponse.redirect(`${redirectBase}?oauth_payload=${encoded}`);
}
