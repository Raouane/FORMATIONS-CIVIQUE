'use client';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useAuth } from '@/providers/AuthProvider';
import { handlePremiumRedirect } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, Sparkles } from 'lucide-react';

export function Hero() {
  const { t } = useTranslation('home');
  const router = useRouter();
  const { isPremium, user } = useAuth();

  const advantages = [
    t('hero.advantages.question1'),
    t('hero.advantages.question2'),
    t('hero.advantages.question3'),
  ];

  return (
    <section className="relative bg-[#1A2B4C] text-white py-20 px-4 overflow-hidden">
      {/* Wave separator en vert */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-[#2ECC71]/20 to-white"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-6 bg-[#2ECC71] text-white border-0 hover:bg-[#27AE60]">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-left rtl:text-right text-white">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90 text-left rtl:text-right">
              {t('hero.description')}
            </p>
          </div>
          
          <div className="mb-8 space-y-4">
            {advantages.map((advantage, index) => (
              <div key={index} className="flex items-start gap-3 rtl:flex-row-reverse">
                <div className="w-6 h-6 rounded-full bg-[#2ECC71] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-base md:text-lg text-white">{advantage}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* Masquer le bouton "Commencer un test gratuit" pour les utilisateurs Premium */}
            {isPremium !== true ? (
              <Button
                size="lg"
                onClick={() => {
                  const locale = router.locale || 'fr';
                  router.push('/simulation', '/simulation', { locale });
                }}
                className="text-lg px-8 py-6 w-full sm:w-auto bg-[#2ECC71] hover:bg-[#27AE60] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('hero.cta')}
                <ChevronDown className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => {
                  const locale = router.locale || 'fr';
                  router.push('/simulation', '/simulation', { locale });
                }}
                className="text-lg px-8 py-6 w-full sm:w-auto bg-[#2ECC71] hover:bg-[#27AE60] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('hero.ctaPremium', { defaultValue: 'Lancer un entraînement' })}
                <ChevronDown className="ml-2 h-5 w-5" />
              </Button>
            )}
            
            {/* Masquer le bouton "Passer Premium" si l'utilisateur est déjà premium */}
            {isPremium !== true && (
              <Button
                size="lg"
                onClick={() => handlePremiumRedirect(router, user || null, isPremium)}
                variant="outline"
                className="text-lg px-8 py-6 w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Passer Premium
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
