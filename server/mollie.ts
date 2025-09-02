import { createMollieClient } from '@mollie/api-client';

if (!process.env.MOLLIE_API_KEY) {
  throw new Error('MOLLIE_API_KEY is required');
}

export const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});

export const SUBSCRIPTION_PLANS = {
  essentieel: {
    name: 'Marco Donato Essentieel',
    price: '29.99',
    description: 'Basistrainingen en voedingsadvies',
  },
  premium: {
    name: 'Marco Donato Premium', 
    price: '49.99',
    description: 'Uitgebreide trainingen, voedingsplannen en progress tracking',
  },
  elite: {
    name: 'Marco Donato Elite',
    price: '79.99', 
    description: 'Complete toegang met persoonlijke coaching en premium content',
  },
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;

export async function createPayment(
  userId: string,
  plan: SubscriptionPlan,
  redirectUrl: string
) {
  const planDetails = SUBSCRIPTION_PLANS[plan];
  
  const payment = await mollieClient.payments.create({
    amount: {
      currency: 'EUR',
      value: planDetails.price,
    },
    description: `${planDetails.name} - Maandelijks abonnement`,
    redirectUrl,
    webhookUrl: `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/api/webhooks/mollie`,
    metadata: {
      userId,
      plan,
      type: 'subscription',
    },
  });

  return payment;
}

export async function handlePaymentWebhook(paymentId: string) {
  const payment = await mollieClient.payments.get(paymentId);
  
  if (payment.status === 'paid') {
    const { userId, plan } = payment.metadata as {
      userId: string;
      plan: SubscriptionPlan;
    };
    
    // Return the data to update the user subscription
    return {
      userId,
      plan,
      status: 'active',
      paidAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };
  }
  
  return null;
}