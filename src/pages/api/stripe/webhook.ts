import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
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
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Récupérer l'ID utilisateur depuis les metadata
        const userId = session.metadata?.userId;
        
        if (!userId || userId === 'anonymous') {
          console.warn('No userId in session metadata, skipping premium activation');
          return res.status(200).json({ received: true });
        }

        // Activer le premium pour l'utilisateur
        const { error: updateError } = await supabaseAdmin
          .from('fc_profiles')
          .update({ is_premium: true })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating user premium status:', updateError);
          return res.status(500).json({ error: 'Failed to update user premium status' });
        }

        console.log(`Premium activated for user: ${userId}`);
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
