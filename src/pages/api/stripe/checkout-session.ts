import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

// Vérifier que STRIPE_SECRET_KEY est définie
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not defined');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  : null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vérifier que Stripe est configuré
  if (!stripe) {
    console.error('Stripe is not configured: STRIPE_SECRET_KEY is missing');
    return res.status(500).json({ 
      error: 'Stripe is not configured. Please contact support.' 
    });
  }

  // Vérifier que NEXT_PUBLIC_APP_URL est définie
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error('NEXT_PUBLIC_APP_URL is not defined');
    return res.status(500).json({ 
      error: 'Application URL is not configured. Please contact support.' 
    });
  }

  try {
    const { planType } = req.body;

    if (!planType || !['one-time', 'monthly'].includes(planType)) {
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    // Récupérer l'utilisateur depuis les cookies de session (méthode plus fiable)
    let userId: string | null = null;
    let customerEmail: string | undefined;

    try {
      // Récupérer depuis les cookies de session Supabase
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.warn('Error getting user from Supabase:', authError.message);
        // Continuer sans utilisateur (paiement anonyme possible)
      } else {
        userId = user?.id || null;
      }

      if (userId) {
        const { data: profile, error: profileError } = await supabase
          .from('fc_profiles')
          .select('email')
          .eq('id', userId)
          .single();
        
        if (profileError) {
          console.warn('Error getting profile:', profileError.message);
        } else {
          customerEmail = profile?.email;
        }
      }
    } catch (userError: any) {
      console.warn('Error retrieving user:', userError.message);
      // Continuer sans utilisateur (paiement anonyme possible)
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

    if (!session.url) {
      console.error('Stripe session created but no URL returned');
      return res.status(500).json({ error: 'Failed to create checkout session URL' });
    }

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Erreur Stripe checkout-session:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack,
    });
    
    // Retourner un message d'erreur plus détaillé en développement
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || 'Erreur lors de la création de la session'
      : 'Erreur lors de la création de la session. Veuillez réessayer ou contacter le support.';
    
    return res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
}
