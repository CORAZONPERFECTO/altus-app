import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/security';

export async function POST(request: Request) {
  try {
    // 1. Ejecutar el escudo de seguridad (Capa 1 y Capa 2)
    const { user, errorResponse } = await requireAuth(request);
    
    // Si el escudo devuelve un error, cortamos la ejecución y bloqueamos al atacante
    if (errorResponse) {
      return errorResponse;
    }

    // 2. Si llegamos aquí, la petición es 100% segura y sabemos qué usuario es
    const { amount } = await request.json();

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Monto inválido.' },
        { status: 400 }
      );
    }

    if (amount < 50) {
      return NextResponse.json(
        { success: false, error: 'El retiro mínimo es de $50 USD.' },
        { status: 400 }
      );
    }

    // Simulamos el retraso de procesar con Stripe/Payoneer
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // En un caso real, aquí usaríamos Stripe Connect API para crear un Payout:
    // const payout = await stripe.payouts.create({
    //   amount: amount * 100, // en centavos
    //   currency: 'usd',
    //   method: 'standard'
    // }, { stripeAccount: 'acct_123456' });

    return NextResponse.json({ 
      success: true, 
      message: 'Retiro en proceso.',
      transactionId: `TXN_${Date.now()}`
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error procesando el retiro.' },
      { status: 500 }
    );
  }
}
