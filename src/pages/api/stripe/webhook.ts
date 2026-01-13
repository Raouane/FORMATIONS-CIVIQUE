import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Fonction pour créer le client Supabase Admin
// On ne peut pas le créer au niveau du module car la clé peut ne pas être définie en dev
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY. Please add it to your .env.local file.');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Gérer les événements de paiement
  try {
    console.log('📨 [Webhook] Événement reçu:', event.type);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('✅ [Webhook] checkout.session.completed détecté');
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('📋 [Webhook] Session ID:', session.id);
        console.log('📋 [Webhook] Mode:', session.mode);
        console.log('📋 [Webhook] Metadata:', session.metadata);
        console.log('📋 [Webhook] Customer (raw):', session.customer);
        
        // Récupérer l'ID utilisateur depuis les metadata
        const userId = session.metadata?.userId;
        const planType = session.metadata?.planType;
        
        // Récupérer la session complète depuis Stripe pour avoir le customer
        // Parfois session.customer est null dans l'événement, il faut récupérer la session complète
        let customerId: string | null = null;
        try {
          const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ['customer']
          });
          
          console.log('📋 [Webhook] Session complète récupérée');
          console.log('📋 [Webhook] Customer depuis session complète:', fullSession.customer);
          
          if (fullSession.customer) {
            customerId = typeof fullSession.customer === 'string' 
              ? fullSession.customer 
              : fullSession.customer.id;
            console.log('💳 [Webhook] Stripe Customer ID récupéré:', customerId);
          } else {
            console.warn('⚠️ [Webhook] Pas de customer ID dans la session complète Stripe');
            // Essayer avec session.customer en fallback
            if (session.customer) {
              customerId = typeof session.customer === 'string' 
                ? session.customer 
                : session.customer.id;
              console.log('💳 [Webhook] Stripe Customer ID depuis session (fallback):', customerId);
            }
          }
        } catch (retrieveError: any) {
          console.error('❌ [Webhook] Erreur lors de la récupération de la session:', retrieveError.message);
          // Fallback : utiliser session.customer directement
          if (session.customer) {
            customerId = typeof session.customer === 'string' 
              ? session.customer 
              : session.customer.id;
            console.log('💳 [Webhook] Stripe Customer ID depuis session (fallback après erreur):', customerId);
          }
        }
        
        console.log('👤 [Webhook] UserId depuis metadata:', userId);
        console.log('📦 [Webhook] PlanType:', planType);
        
        if (!userId || userId === 'anonymous') {
          console.warn('⚠️ [Webhook] Pas de userId dans metadata, activation premium ignorée');
          return res.status(200).json({ received: true });
        }

        // Activer le premium pour l'utilisateur et enregistrer le customer ID
        console.log('🔄 [Webhook] Mise à jour du statut premium pour:', userId);
        console.log('🔑 [Webhook] Tentative d\'update Premium pour l\'ID:', userId);
        console.log('🔑 [Webhook] Service Role Key disponible:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
        console.log('🔑 [Webhook] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configuré' : 'MANQUANT');
        
        // Vérifier que l'ID est bien un UUID
        console.log('🔍 [Webhook] Type de userId:', typeof userId, 'Longueur:', userId?.length);
        
        // Préparer les données à mettre à jour
        const updateData: { is_premium: boolean; stripe_customer_id?: string } = {
          is_premium: true
        };
        
        // Ajouter le customer ID si disponible
        if (customerId) {
          updateData.stripe_customer_id = customerId;
          console.log('💳 [Webhook] Ajout du stripe_customer_id:', customerId);
        }
        
        // Mise à jour : is_premium ET stripe_customer_id
        // Le trigger SQL gérera automatiquement updated_at
        console.log('💾 [Webhook] Données à mettre à jour:', JSON.stringify(updateData, null, 2));
        console.log('💾 [Webhook] UserId pour la mise à jour:', userId);
        
        // Créer le client Supabase Admin (avec vérification de la clé)
        let supabaseAdmin;
        try {
          supabaseAdmin = getSupabaseAdmin();
        } catch (adminError: any) {
          console.error('❌ [Webhook] Erreur lors de la création du client Supabase Admin:', adminError.message);
          return res.status(500).json({ 
            error: 'Server configuration error',
            details: adminError.message,
            hint: 'Please ensure SUPABASE_SERVICE_ROLE_KEY is set in your environment variables.'
          });
        }
        
        const { data: updateResult, error: updateError } = await supabaseAdmin
          .from('fc_profiles')
          .update(updateData)
          .eq('id', userId)
          .select();

        if (updateError) {
          console.error('❌ [Webhook] Erreur Supabase détaillée:', updateError);
          console.error('❌ [Webhook] Code erreur:', updateError.code);
          console.error('❌ [Webhook] Message erreur:', updateError.message);
          console.error('❌ [Webhook] Détails erreur:', updateError.details);
          console.error('❌ [Webhook] Hint erreur:', updateError.hint);
          return res.status(500).json({ 
            error: 'Failed to update user premium status',
            details: updateError.message,
            code: updateError.code
          });
        }

        console.log('✅ [Webhook] Résultat de la mise à jour:', JSON.stringify(updateResult, null, 2));
        console.log(`✅ [Webhook] Premium activé pour l'utilisateur: ${userId}`);
        if (customerId) {
          console.log(`✅ [Webhook] Stripe Customer ID enregistré: ${customerId}`);
        } else {
          console.warn('⚠️ [Webhook] ATTENTION: Aucun customer ID n\'a été enregistré (customerId est null)');
        }
        
        // Vérifier que la mise à jour a bien fonctionné
        if (updateResult && updateResult.length > 0) {
          const updatedProfile = updateResult[0];
          console.log('✅ [Webhook] Profil mis à jour - is_premium:', updatedProfile.is_premium);
          console.log('✅ [Webhook] Profil mis à jour - stripe_customer_id:', updatedProfile.stripe_customer_id);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        console.log('✅ [Webhook] invoice.payment_succeeded détecté');
        // Gérer le renouvellement mensuel de l'abonnement à 9€
        const invoice = event.data.object as Stripe.Invoice;
        console.log('📋 [Webhook] Invoice ID:', invoice.id);
        console.log('📋 [Webhook] Subscription:', invoice.subscription);
        
        // Vérifier si c'est un renouvellement d'abonnement (pas un paiement unique)
        if (invoice.subscription) {
          const subscriptionId = typeof invoice.subscription === 'string' 
            ? invoice.subscription 
            : invoice.subscription.id;
          
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          // Vérifier que c'est bien l'abonnement mensuel (9€ = 900 centimes)
          const priceId = subscription.items.data[0]?.price.id;
          if (priceId) {
            const price = await stripe.prices.retrieve(priceId);
            // Si c'est un abonnement récurrent mensuel (900 centimes = 9€)
            if (price.recurring && price.recurring.interval === 'month' && price.unit_amount === 900) {
              const customerId = typeof subscription.customer === 'string' 
                ? subscription.customer 
                : subscription.customer.id;
              
              // Récupérer l'email du client
              const customer = await stripe.customers.retrieve(customerId);
              
              if (customer && !customer.deleted && 'email' in customer && customer.email) {
                // Maintenir le premium actif lors du renouvellement
                try {
                  const supabaseAdmin = getSupabaseAdmin();
                  const { data: profile } = await supabaseAdmin
                    .from('fc_profiles')
                    .select('id')
                    .eq('email', customer.email)
                    .single();
                  
                  if (profile) {
                    await supabaseAdmin
                      .from('fc_profiles')
                      .update({ is_premium: true })
                      .eq('id', profile.id);
                    
                    console.log(`Premium renewed (monthly subscription) for user: ${profile.id}`);
                  }
                } catch (adminError: any) {
                  console.error('❌ [Webhook] Erreur lors du renouvellement premium:', adminError.message);
                }
              }
            }
          }
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        // Désactiver le premium si l'abonnement est annulé ou le paiement échoue
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string' 
          ? subscription.customer 
          : subscription.customer.id;

        // Récupérer l'email du client depuis Stripe
        const customer = await stripe.customers.retrieve(customerId);
        
        if (customer && !customer.deleted && 'email' in customer && customer.email) {
          // Trouver l'utilisateur par email
          try {
            const supabaseAdmin = getSupabaseAdmin();
            const { data: profile } = await supabaseAdmin
              .from('fc_profiles')
              .select('id')
              .eq('email', customer.email)
              .single();

            if (profile) {
              await supabaseAdmin
                .from('fc_profiles')
                .update({ is_premium: false })
                .eq('id', profile.id);
              
              console.log(`Premium deactivated for user: ${profile.id}`);
            }
          } catch (adminError: any) {
            console.error('❌ [Webhook] Erreur lors de la désactivation premium:', adminError.message);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: error.message });
  }
}
