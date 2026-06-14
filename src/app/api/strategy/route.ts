import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/security';

export async function POST(request: Request) {
  try {
    // 1. Ejecutar el escudo de seguridad (Capa 1 y Capa 2)
    const { user, errorResponse } = await requireAuth(request);
    
    // Si el escudo detecta una anomalía (sin sesión o ataque externo), bloquea.
    if (errorResponse) {
      return errorResponse;
    }

    const body = await request.json();
    const { goal, audience } = body;

    // Simulate AI Processing Delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Simulated Response based on Goal and Audience
    const strategyResponse = {
      mindset: "🧠 **Mentalidad de Crecimiento:** La planificación es la brújula, pero la paciencia es el motor. Los resultados reales no ocurren de la noche a la mañana. El mercado cambia constantemente, y esta estrategia es tu punto de partida para aprender, iterar y dominar tu nicho.",
      target_audience_validation: `🎯 **Análisis de tu Público (${audience}):** Has definido a tu audiencia. Recuerda, tu público objetivo no es "todo el mundo", es el grupo específico de personas que tienen un dolor que tú resuelves o un deseo que tú cumples. Hablarles directamente a ellos aumentará tu conversión radicalmente.`,
      strategy: `**Enfoque Psicológico para ${goal.toUpperCase()}**: \nPara conquistar a esta audiencia y lograr tu meta, dejaremos de vender características y empezaremos a vender la transformación. Crearemos un embudo de contenido donde el 70% eduque o entretenga, el 20% genere conexión personal, y solo el 10% sea venta directa (Call to Action).`,
      tactics: [
        "Auditoría de Perfil: Asegúrate de que tu biografía responda claramente 'Qué hago' y 'Para quién lo hago'.",
        "Prueba Social Semanal: Publica al menos un caso de éxito, testimonio o 'detrás de escena' que valide tu autoridad.",
        "Regla de los 3 Segundos: Edita tus próximos videos cortando cualquier silencio inicial. El gancho debe ser visual y auditivo inmediatamente."
      ],
      hooks: [
        `"Si eres [Inserta tu Público Objetivo] y quieres lograr [Inserta Meta], estás cometiendo este error grave..."`,
        `"El secreto que nadie te cuenta sobre cómo [Resolver el principal problema de tu audiencia] en 2026."`,
        `"Cómo pasé de [Estado Actual Negativo] a [Estado Deseado] usando este simple método..."`
      ]
    };

    return NextResponse.json({ success: true, data: strategyResponse });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to generate strategy' }, { status: 500 });
  }
}
