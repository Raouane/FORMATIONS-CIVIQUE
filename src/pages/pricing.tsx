import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Header } from '@/components/features/home/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Toast } from '@/components/ui/toast';
import { Confetti } from '@/components/features/premium/Confetti';
import { CheckCircle2, Sparkles, ArrowLeft, Users, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

export default function PricingPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { user, session: authSession, loading: authLoading, refreshPremiumStatus, isPremium, refreshAuth } = useAuth();
  const [loading, setLoading] = useState<{ oneTime: boolean; monthly: boolean }>({
    oneTime: false,
    monthly: false,
  });
  const [showToast, setShowToast] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // IMPORTANT: La page pricing est PUBLIQUE
  // On ne redirige PAS automatiquement si user est null
  // La vérification se fait uniquement au clic sur "Acheter"

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
      
      // Afficher la notification et les confettis immédiatement
      setShowConfetti(true);
      setShowToast(true);
      
      console.log('⏳ [Pricing] Attente de 2 secondes pour le webhook...');
      // Rafraîchir le statut premium après un court délai pour que le webhook ait le temps de s'exécuter
      setTimeout(async () => {
        console.log('🔄 [Pricing] Rafraîchissement du statut premium...');
        await refreshPremiumStatus();
        console.log('🚀 [Pricing] Redirection vers la page d\'accueil');
        router.push('/?premium_activated=true');
      }, 2000);
    } else {
      console.log('ℹ️ [Pricing] Accès normal à la page pricing (pas de retour Stripe)');
    }
  }, [router.isReady, router.query, refreshPremiumStatus]);

  const handleCheckout = async (planType: 'one-time' | 'monthly') => {
    // Mettre à jour le loading pour le plan spécifique
    setLoading(prev => ({
      ...prev,
      [planType === 'one-time' ? 'oneTime' : 'monthly']: true,
    }));
    console.log('🛒 [Pricing] Début du checkout - Plan:', planType);
    
    // SIMPLIFICATION RADICALE : Juste getSession() et si session existe, on lance Stripe
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      console.log('✅ [Pricing] Session trouvée, lancement du paiement');
      await proceedWithCheckout(session.access_token, planType);
    } else {
      console.warn('⚠️ [Pricing] Pas de session - Affichage message');
      alert('Veuillez vous connecter pour procéder au paiement.');
      setLoading(prev => ({
        ...prev,
        [planType === 'one-time' ? 'oneTime' : 'monthly']: false,
      }));
    }
  };

  const proceedWithCheckout = async (accessToken: string, planType: 'one-time' | 'monthly') => {
    try {
      console.log('📡 [Pricing] Appel API /api/stripe/checkout-session...');
      
      // Appel API sans AbortController pour éviter les erreurs
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          planType,
        }),
      });
        
      console.log('📥 [Pricing] Réponse reçue, status:', response.status);
      console.log('📥 [Pricing] Response OK:', response.ok);

      if (!response.ok) {
        console.error('❌ [Pricing] Erreur HTTP:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('❌ [Pricing] Contenu de l\'erreur:', errorText);
        setLoading(prev => ({
          ...prev,
          [planType === 'one-time' ? 'oneTime' : 'monthly']: false,
        }));
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
        alert('Erreur lors de la préparation du paiement. Veuillez réessayer.');
        setLoading(prev => ({
          ...prev,
          [planType === 'one-time' ? 'oneTime' : 'monthly']: false,
        }));
        return;
      }

      if (data.url) {
        console.log('✅ [Pricing] URL de checkout reçue, redirection vers Stripe...');
        console.log('🔗 [Pricing] URL complète:', data.url);
        window.location.href = data.url;
      } else {
        console.error('❌ [Pricing] Aucune URL de checkout reçue dans la réponse');
        console.error('❌ [Pricing] Réponse complète:', data);
        setLoading(prev => ({
          ...prev,
          [planType === 'one-time' ? 'oneTime' : 'monthly']: false,
        }));
      }
    } catch (error) {
      console.error('❌ [Pricing] Erreur dans proceedWithCheckout:', error);
      if (error instanceof Error) {
        console.error('❌ [Pricing] Message:', error.message);
      }
      setLoading(prev => ({
        ...prev,
        [planType === 'one-time' ? 'oneTime' : 'monthly']: false,
      }));
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
        <div className="flex justify-center items-center gap-2 mb-8 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Rejoint par <strong className="text-foreground">+500 candidats</strong> ce mois-ci</span>
        </div>

        {/* Message si déjà premium */}
        {isPremium && (
          <Card className="max-w-2xl mx-auto mb-8 border-2 border-primary bg-primary/5">
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-primary">Vous êtes déjà Premium ! 🎉</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Profitez de toutes les fonctionnalités premium : simulations illimitées, corrections détaillées et accès à toute la banque de données.
              </p>
              <Button onClick={() => router.push('/simulation')} className="bg-primary hover:bg-primary/90">
                Commencer une simulation
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Grille des deux offres côte à côte - Masquée si premium */}
        {!isPremium && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
          {/* Carte de gauche : Abonnement mensuel */}
          <Card className="border-2 border-border relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white">
              Flexible
            </Badge>
            
            <CardHeader className="text-center pb-4 pt-6">
              <CardTitle className="text-2xl mb-2">Accès Mensuel</CardTitle>
              <CardDescription className="text-lg">
                <span className="text-4xl font-bold text-foreground">9€</span>
                <span className="text-muted-foreground"> / mois</span>
              </CardDescription>
              <p className="text-xs text-muted-foreground mt-2">Annulable à tout moment</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 pt-6">
              <Button
                onClick={() => handleCheckout('monthly')}
                disabled={loading.monthly}
                className="w-full text-lg h-12"
                size="lg"
                variant="outline"
              >
                {loading.monthly ? 'Préparation du paiement...' : 'S\'abonner'}
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
                <Shield className="h-3 w-3" />
                <span>Paiement sécurisé via Stripe</span>
              </div>
            </CardFooter>
          </Card>

          {/* Carte de droite : Paiement unique (Recommandé) */}
          <Card className="border-4 border-primary relative shadow-lg">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm px-3 py-1">
              ⭐ Recommandé
            </Badge>
            
            <CardHeader className="text-center pb-4 pt-6">
              <CardTitle className="text-2xl mb-2">Accès Illimité</CardTitle>
              <CardDescription className="text-lg">
                <span className="text-4xl font-bold text-foreground">29€</span>
                <span className="text-muted-foreground"> une fois</span>
              </CardDescription>
              <p className="text-xs text-primary font-semibold mt-2">À vie • Sans limite</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
                <div className="flex items-start gap-3 pt-2 border-t">
                  <CheckCircle2 className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-semibold text-primary">Accès permanent, sans renouvellement</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 pt-6">
              <Button
                onClick={() => handleCheckout('one-time')}
                disabled={loading.oneTime}
                className="w-full text-lg h-12 bg-primary hover:bg-primary/90"
                size="lg"
              >
                {loading.oneTime ? 'Préparation du paiement...' : 'Acheter maintenant'}
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-2">
                <Shield className="h-3 w-3" />
                <span>Paiement sécurisé via Stripe</span>
              </div>
            </CardFooter>
          </Card>
        </div>
        )}

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Des questions ? Contactez-nous à{' '}
            <a href="mailto:support@formations-civiques.fr" className="text-primary hover:underline">
              support@formations-civiques.fr
            </a>
          </p>
        </div>
      </main>

      {/* Toast de succès */}
      <Toast
        open={showToast}
        onOpenChange={setShowToast}
        title="🎉 Félicitations !"
        description="Votre accès Premium est désormais activé. Profitez de toutes les fonctionnalités !"
        variant="success"
        duration={5000}
      />

      {/* Animation de confettis */}
      <Confetti trigger={showConfetti} duration={3000} />
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
