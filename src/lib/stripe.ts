import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ Falta la variable de entorno STRIPE_SECRET_KEY. Stripe no funcionará correctamente en producción.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16', // Usamos una versión estable y reciente
  typescript: true,
  appInfo: {
    name: 'Altus SaaS',
    version: '1.0.0',
    url: 'https://altus-app.com'
  }
});
