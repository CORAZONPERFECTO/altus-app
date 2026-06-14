import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Falta la firma o el secreto del webhook' }, { status: 400 });
  }

  let event;

  try {
    // 1. Verificamos matemáticamente que el evento venga realmente de los servidores de Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 });
  }

  // 2. Procesar el evento financiero
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id;
        const customerId = session.customer as string;

        if (userId) {
          console.log(`✅ Pago exitoso para el usuario: ${userId}`);
          // Activamos la cuenta en la Base de Datos
          await adminDb.collection('users').doc(userId).set({
            stripeCustomerId: customerId,
            subscriptionStatus: 'active',
            plan: 'founder',
            aiCredits: 2000,
            updatedAt: new Date()
          }, { merge: true });
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;
        
        console.log(`❌ Pago fallido para el cliente de Stripe: ${customerId}`);
        // Buscamos al usuario por su Stripe Customer ID
        const snapshot = await adminDb.collection('users').where('stripeCustomerId', '==', customerId).get();
        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          // Aquí disparamos la regla de las 72 horas.
          // Cambiamos el estado a 'past_due' para que el Frontend le muestre la alerta
          await userDoc.ref.update({
            subscriptionStatus: 'past_due',
            pastDueSince: new Date(),
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;
        
        console.log(`🚫 Suscripción cancelada para el cliente de Stripe: ${customerId}`);
        const snapshot = await adminDb.collection('users').where('stripeCustomerId', '==', customerId).get();
        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          // Cortamos el acceso inmediatamente
          await userDoc.ref.update({
            subscriptionStatus: 'canceled',
            aiCredits: 0
          });
        }
        break;
      }
      default:
        console.log(`ℹ️ Evento no manejado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return NextResponse.json({ error: 'Error procesando el webhook' }, { status: 500 });
  }
}
