import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { supabase, createServiceRoleClient } from '@/lib/supabase';

// Vérifier que STRIPE_SECRET_KEY est définie
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error('❌ [Stripe API] STRIPE_SECRET_KEY is not defined');
  console.error('❌ [Stripe API] Available env vars:', Object.keys(process.env).filter(k => k.includes('STRIPE')));
} else {
  console.log('✅ [Stripe API] STRIPE_SECRET_KEY is defined, length:', stripeKey.length);
  console.log('✅ [Stripe API] Key starts with:', stripeKey.substring(0, 7) + '...');
}

// Vérifier que SUPABASE_SERVICE_ROLE_KEY est définie
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey) {
  console.error('❌ [Stripe API] SUPABASE_SERVICE_ROLE_KEY is not defined');
  console.error('❌ [Stripe API] Redémarrez le serveur Next.js après avoir ajouté la clé dans .env.local');
} else {
  console.log('✅ [Stripe API] SUPABASE_SERVICE_ROLE_KEY is defined, length:', serviceRoleKey.length);
  console.log('✅ [Stripe API] Key starts with:', serviceRoleKey.substring(0, 20) + '...');
}

const stripe = stripeKey 
  ? new Stripe(stripeKey.trim(), {
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
    const errorMessage = process.env.NODE_ENV === 'development'
      ? 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env.local file.'
      : 'Stripe is not configured. Please contact support.';
    return res.status(500).json({ 
      error: errorMessage 
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
    console.log('📥 [Checkout API] Requête reçue');
    const { planType } = req.body;
    console.log('📋 [Checkout API] Plan type:', planType);

    if (!planType || !['one-time', 'monthly'].includes(planType)) {
      console.error('❌ [Checkout API] Plan type invalide:', planType);
      return res.status(400).json({ error: 'Invalid plan type' });
    }

    // Récupérer l'utilisateur depuis le token d'authentification dans les headers
    let userId: string | null = null;
    let customerEmail: string | undefined;
    let existingCustomerId: string | undefined;

    try {
      // Récupérer le token depuis les headers Authorization
      console.log('🔑 [Checkout API] Vérification de l\'authentification...');
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('❌ [Checkout API] Pas de header Authorization');
        return res.status(401).json({ 
          error: 'Vous devez être connecté pour effectuer un paiement. Veuillez vous inscrire ou vous connecter.' 
        });
      }

      const token = authHeader.replace('Bearer ', '');
      console.log('✅ [Checkout API] Token trouvé, longueur:', token.length);
      
      // Vérifier le token et récupérer l'utilisateur
      console.log('👤 [Checkout API] Récupération de l\'utilisateur depuis Supabase...');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        console.error('❌ [Checkout API] Erreur d\'authentification:', authError?.message);
        return res.status(401).json({ 
          error: 'Vous devez être connecté pour effectuer un paiement. Veuillez vous inscrire ou vous connecter.' 
        });
      }

      userId = user.id;
      console.log('✅ [Checkout API] Utilisateur authentifié:', userId);

      // Récupérer l'email et le stripe_customer_id depuis le profil
      console.log('📧 [Checkout API] Récupération du profil...');
      const { data: profileData, error: profileError } = await supabase
        .from('fc_profiles')
        .select('email, stripe_customer_id')
        .eq('id', userId)
        .maybeSingle(); // Utiliser maybeSingle() au lieu de single() pour éviter l'erreur si le profil n'existe pas
      
      if (profileError) {
        console.warn('⚠️ [Checkout API] Erreur récupération profil:', profileError.message);
        // Utiliser l'email de l'utilisateur Supabase en fallback
        customerEmail = user.email;
        console.log('📧 [Checkout API] Email depuis Supabase:', customerEmail);
      } else if (profileData) {
        customerEmail = profileData.email || user.email;
        console.log('✅ [Checkout API] Email récupéré:', customerEmail);
        if (profileData.stripe_customer_id) {
          existingCustomerId = profileData.stripe_customer_id;
          console.log('💳 [Checkout API] Customer Stripe existant trouvé:', existingCustomerId);
        }
      } else {
        // Profil n'existe pas encore
        console.log('ℹ️ [Checkout API] Profil n\'existe pas encore, utilisation de l\'email Supabase');
        customerEmail = user.email;
      }
    } catch (userError: any) {
      console.error('Error retrieving user:', userError.message);
      return res.status(401).json({ 
        error: 'Erreur d\'authentification. Veuillez vous reconnecter.' 
      });
    }

    // Vérifier que nous avons un userId
    if (!userId) {
      return res.status(401).json({ 
        error: 'Vous devez être connecté pour effectuer un paiement.' 
      });
    }

    // Créer ou récupérer le customer Stripe
    console.log('💳 [Checkout API] Création/récupération du customer Stripe...');
    let stripeCustomerId = existingCustomerId;
    
    // Si aucun customer n'existe, en créer un explicitement
    if (!stripeCustomerId && customerEmail) {
      try {
        console.log('💳 [Checkout API] Création d\'un nouveau customer Stripe...');
        const customer = await stripe.customers.create({
          email: customerEmail,
          metadata: {
            userId: userId || 'anonymous',
          },
        });
        stripeCustomerId = customer.id;
        console.log('✅ [Checkout API] Customer Stripe créé:', stripeCustomerId);
        
        // Enregistrer le customer ID dans le profil (optionnel, le webhook le fera aussi)
        try {
          // Diagnostic : vérifier si la clé est chargée
          const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
          console.log('🔑 [Checkout API] SUPABASE_SERVICE_ROLE_KEY disponible:', hasServiceRoleKey);
          if (!hasServiceRoleKey) {
            console.error('❌ [Checkout API] SUPABASE_SERVICE_ROLE_KEY n\'est pas chargée. Redémarrez le serveur Next.js !');
            throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY - Redémarrez le serveur Next.js');
          }
          
          const supabaseAdmin = createServiceRoleClient();
          const { error: updateError } = await supabaseAdmin
            .from('fc_profiles')
            .update({ stripe_customer_id: stripeCustomerId })
            .eq('id', userId);
          
          if (updateError) {
            console.warn('⚠️ [Checkout API] Erreur lors de l\'enregistrement du customer ID (sera fait par webhook):', updateError.message);
          } else {
            console.log('✅ [Checkout API] Customer ID enregistré dans le profil');
          }
        } catch (updateError: any) {
          console.warn('⚠️ [Checkout API] Exception lors de l\'enregistrement du customer ID (sera fait par webhook):', updateError.message);
        }
      } catch (customerError: any) {
        console.error('❌ [Checkout API] Erreur lors de la création du customer:', customerError.message);
        // Continuer avec customer_email en fallback
        console.log('⚠️ [Checkout API] Utilisation de customer_email en fallback');
      }
    }
    
    // Créer la session Stripe
    console.log('💳 [Checkout API] Création de la session Stripe...');
    
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
      // Utiliser le customer créé/récupéré, sinon fallback sur customer_email
      ...(stripeCustomerId ? { customer: stripeCustomerId } : { customer_email: customerEmail }),
      metadata: {
        userId: userId || 'anonymous',
        planType,
      },
    };

    console.log('📝 [Checkout API] Paramètres session:', {
      mode: sessionParams.mode,
      amount: planType === 'one-time' ? 2900 : 900,
      userId,
      planType,
    });

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log('✅ [Checkout API] Session Stripe créée:', session.id);

    if (!session.url) {
      console.error('❌ [Checkout API] Session créée mais pas d\'URL retournée');
      return res.status(500).json({ error: 'Failed to create checkout session URL' });
    }

    console.log('✅ [Checkout API] URL de checkout générée:', session.url.substring(0, 50) + '...');
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
