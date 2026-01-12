import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Utiliser le service role pour bypasser RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

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
        
        // Récupérer l'ID utilisateur depuis les metadata
        const userId = session.metadata?.userId;
        const planType = session.metadata?.planType;
        
        console.log('👤 [Webhook] UserId depuis metadata:', userId);
        console.log('📦 [Webhook] PlanType:', planType);
        
        if (!userId || userId === 'anonymous') {
          console.warn('⚠️ [Webhook] Pas de userId dans metadata, activation premium ignorée');
          return res.status(200).json({ received: true });
        }

        // Activer le premium pour l'utilisateur
        console.log('🔄 [Webhook] Mise à jour du statut premium pour:', userId);
        const { error: updateError } = await supabaseAdmin
          .from('fc_profiles')
          .update({ is_premium: true })
          .eq('id', userId);

        if (updateError) {
          console.error('❌ [Webhook] Erreur mise à jour premium:', updateError);
          return res.status(500).json({ error: 'Failed to update user premium status' });
        }

        console.log(`✅ [Webhook] Premium activé pour l'utilisateur: ${userId}`);
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
