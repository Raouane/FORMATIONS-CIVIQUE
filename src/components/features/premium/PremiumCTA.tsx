'use client';

import { useRouter } from 'next/router';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Target, Zap, CheckCircle2 } from 'lucide-react';
import { ExamResult } from '@/types/database';
import { useState } from 'react';

interface PremiumCTAProps {
  examResult: ExamResult;
}

export function PremiumCTA({ examResult }: PremiumCTAProps) {
  const router = useRouter();
  const { isPremium, user, authLoading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'one-time' | 'monthly'>('one-time');
  const [loading, setLoading] = useState(false);

  // Ne pas afficher si déjà premium
  if (isPremium) return null;

  const handleCheckout = async (planType: 'one-time' | 'monthly') => {
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      // Rediriger vers l'inscription avec un redirect vers pricing
      const currentPath = router.asPath;
      router.push(`/auth/register?redirect=${encodeURIComponent('/pricing')}`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Erreur lors de la création de la session Stripe');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const handleGoToPricing = () => {
    router.push('/pricing');
  };

  // Déterminer le message selon le résultat
  const getMessage = () => {
    if (!examResult.passed) {
      if (examResult.percentage >= 70) {
        return {
          title: 'Vous y êtes presque ! 🎯',
          description: 'À seulement quelques points de la réussite. Avec Premium, accédez à plus de questions pour vous améliorer.',
          icon: Target,
          color: 'bg-orange-500',
        };
      } else {
        return {
          title: 'Améliorez vos résultats avec Premium 📈',
          description: 'Accédez à toutes les questions et révisez efficacement pour réussir votre examen.',
          icon: TrendingUp,
          color: 'bg-blue-500',
        };
      }
    } else {
      return {
        title: 'Débloquez tout le potentiel ! ⚡',
        description: 'Vous avez réussi ! Passez Premium pour accéder à toutes les simulations et vous préparer encore mieux.',
        icon: Zap,
        color: 'bg-green-500',
      };
    }
  };

  const message = getMessage();
  const Icon = message.icon;

  const benefits = [
    'Simulations illimitées de 40 questions',
    'Correction détaillée avec explications',
    'Statistiques avancées par thème',
    'Les 12 mises en situation de la réforme 2026',
  ];

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Badge "Recommandé" */}
      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
        <Sparkles className="h-3 w-3 mr-1" />
        Recommandé
      </Badge>

      <CardContent className="p-6 pt-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Icône et message */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`rounded-full p-2 ${message.color} text-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{message.title}</h3>
            </div>
            <p className="text-muted-foreground mb-4">{message.description}</p>

            {/* Avantages */}
            <div className="space-y-2 mb-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA avec sélecteur de plan */}
          <div className="flex flex-col items-center gap-4 md:min-w-[250px]">
            {/* Sélecteur de plan */}
            <div className="inline-flex rounded-lg border p-1 bg-background w-full">
              <button
                onClick={() => setSelectedPlan('one-time')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === 'one-time'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Paiement unique
              </button>
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPlan === 'monthly'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Mensuel
              </button>
            </div>

            {/* Prix */}
            <div className="text-center w-full">
              {selectedPlan === 'one-time' ? (
                <>
                  <div className="text-3xl font-bold text-primary">29€</div>
                  <div className="text-sm text-muted-foreground">une fois</div>
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold text-primary">9€</div>
                  <div className="text-sm text-muted-foreground">/ mois</div>
                </>
              )}
            </div>

            {/* Bouton CTA */}
            <Button
              onClick={() => handleCheckout(selectedPlan)}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {loading ? 'Redirection...' : selectedPlan === 'one-time' ? 'Acheter maintenant' : 'S\'abonner'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Paiement sécurisé • Annulation possible
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
