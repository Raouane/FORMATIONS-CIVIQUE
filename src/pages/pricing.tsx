import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Header } from '@/components/features/home/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Sparkles, ArrowLeft, Users, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function PricingPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { user, session: authSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'one-time' | 'monthly'>('one-time');

  // Vérifier si l'utilisateur revient d'un paiement réussi
  useEffect(() => {
    // Attendre que le routeur soit prêt avant de lire les query params
    if (!router.isReady) {
      console.log('⏳ [Pricing] Routeur pas encore prêt, attente...');
      return;
    }

    const { success, session_id, canceled } = router.query;
    
    console.log('🔄 [Pricing] Query params:', { 
      success, 
      session_id, 
      canceled,
      isReady: router.isReady 
    });
    
    if (canceled === 'true') {
      console.log('❌ [Pricing] Paiement annulé');
      return;
    }
    
    if (success === 'true' && session_id) {
      console.log('✅ [Pricing] Paiement réussi, session_id:', session_id);
      console.log('⏳ [Pricing] Attente de 2 secondes pour le webhook...');
      // Rafraîchir la page après un court délai pour que le webhook ait le temps de s'exécuter
      setTimeout(() => {
        console.log('🚀 [Pricing] Redirection vers la page d\'accueil');
        router.push('/?premium_activated=true');
      }, 2000);
    } else {
      console.log('ℹ️ [Pricing] Accès normal à la page pricing (pas de retour Stripe)');
    }
  }, [router.isReady, router.query]);

  const handleCheckout = async (planType: 'one-time' | 'monthly') => {
    console.log('🛒 [Pricing] Début du checkout - Plan:', planType);
    
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      console.log('❌ [Pricing] Utilisateur non connecté - Redirection vers inscription');
      router.push(`/auth/register?redirect=${encodeURIComponent('/pricing')}`);
      return;
    }

    console.log('✅ [Pricing] Utilisateur connecté:', user.id);

    setLoading(true);
    try {
      // Utiliser la session depuis AuthProvider (déjà chargée, plus rapide et fiable)
      console.log('🔑 [Pricing] Utilisation de la session depuis AuthProvider...');
      
      if (!authSession) {
        console.error('❌ [Pricing] Aucune session dans AuthProvider');
        // Essayer de rafraîchir la session une fois
        console.log('🔄 [Pricing] Tentative de rafraîchissement de la session...');
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.getSession();
        
        if (refreshError || !refreshedSession) {
          console.error('❌ [Pricing] Impossible de récupérer la session:', refreshError);
          router.push(`/auth/login?redirect=${encodeURIComponent('/pricing')}`);
          setLoading(false);
          return;
        }
        
        const refreshedToken = refreshedSession?.access_token;
        if (!refreshedToken) {
          console.error('❌ [Pricing] Aucun token après rafraîchissement');
          router.push(`/auth/login?redirect=${encodeURIComponent('/pricing')}`);
          setLoading(false);
          return;
        }
        
        console.log('✅ [Pricing] Token récupéré après rafraîchissement, longueur:', refreshedToken.length);
        await proceedWithCheckout(refreshedToken, planType);
        return;
      }

      const accessToken = authSession.access_token;

      if (!accessToken) {
        console.error('❌ [Pricing] Aucun token d\'accès dans la session AuthProvider');
        router.push(`/auth/login?redirect=${encodeURIComponent('/pricing')}`);
        setLoading(false);
        return;
      }

      console.log('✅ [Pricing] Token récupéré depuis AuthProvider, longueur:', accessToken.length);
      
      await proceedWithCheckout(accessToken, planType);
    } catch (error) {
      console.error('❌ [Pricing] Erreur exception:', error);
      if (error instanceof Error) {
        console.error('❌ [Pricing] Message d\'erreur:', error.message);
        console.error('❌ [Pricing] Stack:', error.stack);
      }
      setLoading(false);
    }
  };

  const proceedWithCheckout = async (accessToken: string, planType: 'one-time' | 'monthly') => {
    try {

      console.log('📡 [Pricing] Appel API /api/stripe/checkout-session...');
      
      // Ajouter un timeout pour éviter les blocages
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes max
      
      try {
        const response = await fetch('/api/stripe/checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            planType,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        
        console.log('📥 [Pricing] Réponse reçue, status:', response.status);
        console.log('📥 [Pricing] Response OK:', response.ok);

        if (!response.ok) {
          console.error('❌ [Pricing] Erreur HTTP:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('❌ [Pricing] Contenu de l\'erreur:', errorText);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('📦 [Pricing] Données reçues:', { 
          hasUrl: !!data.url, 
          hasError: !!data.error,
          error: data.error,
          url: data.url ? data.url.substring(0, 50) + '...' : null
        });

        if (data.error) {
          console.error('❌ [Pricing] Erreur Stripe:', data.error);
          if (data.error.includes('connecté') || data.error.includes('authentification')) {
            router.push(`/auth/login?redirect=${encodeURIComponent('/pricing')}`);
          }
          setLoading(false);
          return;
        }

        if (data.url) {
          console.log('✅ [Pricing] URL de checkout reçue, redirection vers Stripe...');
          console.log('🔗 [Pricing] URL complète:', data.url);
          window.location.href = data.url;
        } else {
          console.error('❌ [Pricing] Aucune URL de checkout reçue dans la réponse');
          console.error('❌ [Pricing] Réponse complète:', data);
          setLoading(false);
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.error('❌ [Pricing] Timeout: L\'appel API a pris plus de 10 secondes');
        } else {
          console.error('❌ [Pricing] Erreur lors de l\'appel API:', fetchError);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ [Pricing] Erreur dans proceedWithCheckout:', error);
      setLoading(false);
    }
  };

  const features = [
    'Simulations illimitées de 40 questions',
    'Correction détaillée avec explications',
    'Statistiques par thème',
    'Quotas officiels 2026 respectés',
    '12 mises en situation incluses',
    'Accès à toute la banque de données',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'accueil
        </Button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Accès Premium
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Passez au niveau supérieur
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Accédez à toutes les fonctionnalités premium et préparez-vous efficacement à l'examen
          </p>
        </div>

        {/* Social Proof */}
        <div className="flex justify-center items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Rejoint par <strong className="text-foreground">+500 candidats</strong> ce mois-ci</span>
        </div>

        {/* Sélecteur de plan */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border p-1 bg-background">
            <button
              onClick={() => setSelectedPlan('one-time')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPlan === 'one-time'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Paiement unique
            </button>
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPlan === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Abonnement mensuel
            </button>
          </div>
        </div>

        {/* Carte d'offre */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-primary relative">
            {/* Badge "Recommandé" pour paiement unique */}
            {selectedPlan === 'one-time' && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                Recommandé
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl mb-2">Accès Illimité</CardTitle>
              <CardDescription className="text-lg">
                {selectedPlan === 'one-time' ? (
                  <>
                    <span className="text-4xl font-bold text-foreground">29€</span>
                    <span className="text-muted-foreground"> une fois</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-foreground">9€</span>
                    <span className="text-muted-foreground"> / mois</span>
                  </>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 pt-6">
              <Button
                onClick={() => handleCheckout(selectedPlan)}
                disabled={loading}
                className="w-full text-lg h-12"
                size="lg"
              >
                {loading ? 'Redirection...' : selectedPlan === 'one-time' ? 'Acheter maintenant' : 'S\'abonner'}
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
                <Shield className="h-3 w-3" />
                <span>Paiement sécurisé via Stripe. Annulation possible à tout moment.</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Des questions ? Contactez-nous à{' '}
            <a href="mailto:support@formations-civiques.fr" className="text-primary hover:underline">
              support@formations-civiques.fr
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'fr', ['common'])),
    },
  };
};
