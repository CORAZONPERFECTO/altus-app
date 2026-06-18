import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const encoder = new TextEncoder();
  const { videoId } = await request.json().catch(() => ({ videoId: 'unknown' }));
  
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: any) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // 1. Iniciar RAG
        sendEvent('status', { step: 'Conectando con OpenAI (GPT-4o)...', progress: 10 });
        
        // 2. Transcripción (Simulada por ahora hasta conectar YouTube Transcript API)
        await new Promise(r => setTimeout(r, 1000));
        sendEvent('status', { step: 'Analizando metadatos del video...', progress: 40 });

        // 3. Consulta a OpenAI
        sendEvent('status', { step: 'Extrayendo ganchos y perfil de voz...', progress: 70 });
        
        const prompt = `
          Actúa como un experto CMO y Copywriter de respuesta directa.
          Analiza el concepto de un video viral para Marketing Digital y genera un perfil de voz y un copy altamente persuasivo.
          
          Debes responder ÚNICAMENTE con un objeto JSON válido con esta estructura exacta:
          {
            "voiceProfile": {
              "tone": "Descripción del tono (ej. Autoritario, cercano)",
              "pace": "Descripción del ritmo (ej. Rápido al inicio)",
              "keywords": ["palabra1", "palabra2", "palabra3"]
            },
            "structureTemplate": "Explicación de la estructura en 4 pasos numerados",
            "generatedCopy": "El copy final persuasivo listo para publicar."
          }
        `;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant designed to output pure JSON.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        });

        const resultText = completion.choices[0].message.content;
        if (!resultText) throw new Error("No response from OpenAI");

        const result = JSON.parse(resultText);

        // 5. Finalizado
        sendEvent('status', { step: 'Generando Copy estructurado...', progress: 100 });
        await new Promise(r => setTimeout(r, 500));

        sendEvent('complete', result);
        controller.close();

      } catch (error: any) {
        console.error('OpenAI Error:', error);
        sendEvent('error', { message: 'Error procesando la solicitud con OpenAI' });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
