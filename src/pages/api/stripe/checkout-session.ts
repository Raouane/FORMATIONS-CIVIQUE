import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planType } = req.body;

    if (!planType || !['one-time', 'monthly'].includes(planType)) {
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    // Récupérer l'utilisateur depuis le header Authorization ou les cookies
    let userId: string | null = null;
    let customerEmail: string | undefined;

    // Essayer de récupérer depuis le token dans les cookies/headers
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    } else {
      // Fallback : récupérer depuis les cookies de session
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    }

    if (userId) {
      const { data: profile } = await supabase
        .from('fc_profiles')
        .select('email')
        .eq('id', userId)
        .single();
      customerEmail = profile?.email;
    }

    // Créer la session Stripe
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: planType === 'one-time' ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Accès Premium - Formations Civiques',
              description: 'Accès illimité aux simulations officielles et à la banque de données complète',
            },
            unit_amount: planType === 'one-time' ? 2900 : 900,
            recurring: planType === 'monthly' ? { interval: 'month' } : undefined,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      customer_email: customerEmail,
      metadata: {
        userId: userId || 'anonymous',
        planType,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Erreur Stripe:', error);
    return res.status(500).json({ error: error.message || 'Erreur lors de la création de la session' });
  }
}
