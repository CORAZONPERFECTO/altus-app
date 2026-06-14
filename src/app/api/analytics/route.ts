import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const period = searchParams.get('period') || '30d';

    // Mock data based on period
    const dataPoints = period === '7d' ? 7 : period === '30d' ? 30 : 12;
    
    // Generamos un crecimiento progresivo realista
    let baseAudience = 12000;
    const growthData = Array.from({ length: dataPoints }).map((_, i) => {
      baseAudience += Math.floor(Math.random() * 500) + 100; // Incremento aleatorio diario
      
      const date = new Date();
      if (period === '1y') {
        date.setMonth(date.getMonth() - (dataPoints - 1 - i));
        return { name: date.toLocaleString('es-ES', { month: 'short' }), audience: baseAudience, engagement: Math.floor(baseAudience * 0.15) };
      } else {
        date.setDate(date.getDate() - (dataPoints - 1 - i));
        return { name: date.toLocaleString('es-ES', { day: '2-digit', month: 'short' }), audience: baseAudience, engagement: Math.floor(baseAudience * 0.15) };
      }
    });

    const platformPerformance = [
      { name: 'YouTube', views: 45000, interactions: 3200, fill: '#ef4444' }, // red
      { name: 'Instagram', views: 28000, interactions: 4100, fill: '#ec4899' }, // pink
      { name: 'Facebook', views: 35000, interactions: 1800, fill: '#3b82f6' }, // blue
      { name: 'LinkedIn', views: 12000, interactions: 950, fill: '#0284c7' }, // light blue
    ];

    const kpis = {
      totalAudience: baseAudience,
      audienceGrowth: '+12.4%',
      totalEngagement: 14500,
      engagementGrowth: '+8.2%',
      activePlatforms: 4,
      avgPostReach: 3200
    };

    return NextResponse.json({
      kpis,
      growthData,
      platformPerformance
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
