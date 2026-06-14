import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/security';
import OpenAI from 'openai';
import { adminDb } from '@/lib/firebase-admin';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

export async function POST(request: Request) {
  try {
    const { user, errorResponse } = await requireAuth(request);
    if (errorResponse && process.env.NODE_ENV !== 'development') {
      return errorResponse;
    }

    const { text, contextContext } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Falta el texto a mejorar' }, { status: 400 });
    }

    // 1. Opcional: Descontar un crédito al usuario (Si lo deseas en el futuro)
    if (user?.uid) {
      const userRef = adminDb.collection('users').doc(user.uid);
      const userDoc = await userRef.get();
      const credits = userDoc.data()?.aiCredits || 0;
      if (credits <= 0 && process.env.NODE_ENV !== 'development') {
        return NextResponse.json({ error: 'No tienes créditos de IA suficientes.' }, { status: 403 });
      }
      // Descontar crédito (comentado por ahora para pruebas ilimitadas)
      // await userRef.update({ aiCredits: credits - 1 });
    }

    // Si no hay llave real en entorno local, devolvemos un texto simulado
    if (!process.env.OPENAI_API_KEY) {
      // Retraso simulado
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return NextResponse.json({
        enhancedText: `✨ [Versión Mejorada por IA]: ${text}\n\nEstrategia refinada con lenguaje de marketing de alto nivel. (Configura OPENAI_API_KEY para respuestas reales).`
      });
    }

    // 2. Llamada real a OpenAI GPT-4o-mini (rápido y barato)
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres el Director de Marketing Estratégico (CMO) de una agencia premium. Tu tarea es tomar las ideas crudas, mal redactadas o dictadas por voz del usuario y transformarlas en texto corporativo, persuasivo, directo y profesional para una Pizarra de Claridad de una marca. No agregues saludos ni texto extra, solo devuelve la versión pulida y mejorada del texto.'
        },
        {
          role: 'user',
          content: `Mejora este texto que trata sobre [${contextContext || 'estrategia general'}]:\n\n"${text}"`
        }
      ],
      temperature: 0.7,
    });

    const enhancedText = response.choices[0].message.content;

    return NextResponse.json({ enhancedText });

  } catch (error: any) {
    console.error('[AI ENHANCE ERROR]', error);
    return NextResponse.json({ error: 'Error interno en el servidor de IA.' }, { status: 500 });
  }
}
