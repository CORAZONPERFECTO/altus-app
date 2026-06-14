import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId');
  const externalUrl = searchParams.get('url');

  try {
    // Si envían una URL externa (Modelado Viral)
    if (externalUrl) {
      // Simulamos la extracción de metadata de ese video
      return NextResponse.json({
        source: 'external',
        videos: [
          {
            id: 'ext-' + Math.random().toString(36).substr(2, 9),
            title: 'Video Externo a Analizar',
            thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
            views: '2.4M',
            date: new Date().toISOString()
          }
        ]
      });
    }

    // Si envían un tenantId (Consistencia de Marca)
    if (tenantId) {
      // TODO: Aquí leeríamos de Firestore el _devAccessToken y llamaríamos a la API de YouTube real.
      // Por ahora, simulamos los últimos videos del canal conectado.
      return NextResponse.json({
        source: 'internal',
        videos: [
          {
            id: 'int-1',
            title: 'Cómo escalar tu agencia a $100k/mes',
            thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
            views: '45K',
            date: new Date(Date.now() - 86400000 * 2).toISOString()
          },
          {
            id: 'int-2',
            title: 'La estrategia secreta de retención de clientes',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
            views: '32K',
            date: new Date(Date.now() - 86400000 * 7).toISOString()
          },
          {
            id: 'int-3',
            title: 'No uses IA sin ver este video primero',
            thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
            views: '110K',
            date: new Date(Date.now() - 86400000 * 14).toISOString()
          }
        ]
      });
    }

    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
