import { Router } from 'next/router';
import { User } from '@supabase/supabase-js';

/**
 * Fonction helper pour gérer la redirection intelligente vers la page Premium
 * Évite les boucles infinies en vérifiant l'état de l'utilisateur
 * 
 * @param router - Instance Next.js Router
 * @param user - Utilisateur actuel (peut être null)
 * @param isPremium - Statut premium de l'utilisateur
 */
export function handlePremiumRedirect(
  router: Router,
  user: User | null,
  isPremium: boolean
) {
  // Si l'utilisateur est déjà Premium, ne rien faire (le bouton ne devrait pas être visible)
  if (isPremium) {
    console.log('✅ [Navigation] Utilisateur déjà Premium, redirection vers /profile');
    router.push('/profile');
    return;
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers l'inscription avec redirect
  if (!user) {
    console.log('👤 [Navigation] Utilisateur non connecté, redirection vers /auth/register?redirect=/pricing');
    router.push(`/auth/register?redirect=${encodeURIComponent('/pricing')}`);
    return;
  }

  // Si l'utilisateur est connecté mais pas Premium, aller directement à la page de paiement
  console.log('💳 [Navigation] Utilisateur connecté mais pas Premium, redirection vers /pricing');
  router.push('/pricing');
}
