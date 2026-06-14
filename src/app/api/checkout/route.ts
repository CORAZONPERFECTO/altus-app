import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { requireAuth } from '@/lib/security';

export async function POST(request: Request) {
  try {
    // 1. Verificar Autenticación. El usuario debe estar logueado para pagar.
    const { user, errorResponse } = await requireAuth(request);
    
    if (errorResponse) {
      // En modo desarrollo, permitiremos saltar esto para probar el checkout sin login
      if (process.env.NODE_ENV !== 'development') {
        return errorResponse;
      }
    }

    // 2. Definir la URL base de tu aplicación
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 3. Crear la sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      // Metadata es crucial: Aquí vinculamos el ID de Firebase del usuario con Stripe
      client_reference_id: user?.uid || 'dev_user_123',
      line_items: [
        {
          // Idealmente esto sería un price_id de Stripe (ej. price_1Hh1zZ2eZvKYlo2C...)
          // Como no tenemos el ID real aún, usamos price_data dinámico para el Founder Plan:
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Altus - Miembro Fundador',
              description: 'Suscripción de por vida a $49/mes. Incluye 2000 Créditos IA y Gestión Multi-Marca.',
              images: ['https://altus-app.com/logo.png'], // Logo simulado
            },
            unit_amount: 4900, // $49.00 USD en centavos
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/precios?payment=cancelled`,
      allow_promotion_codes: true,
    });

    // 4. Devolver el enlace seguro de Stripe al Frontend
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('[STRIPE CHECKOUT ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Hubo un error al generar la orden de pago.' },
      { status: 500 }
    );
  }
}
