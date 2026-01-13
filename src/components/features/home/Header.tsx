'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useAuth } from '@/providers/AuthProvider';
import { isRTL } from '@/lib/rtl';
import { Button } from '@/components/ui/button';
import { PremiumBadge } from '@/components/features/premium/PremiumBadge';
import { MobileNav } from '../navigation/MobileNav';
import { LanguageSelector } from '../navigation/LanguageSelector';

export function Header() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { user, isPremium } = useAuth();

  // Debug: Afficher le statut premium dans la console à chaque changement
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      console.log('🎯 [Header] Statut premium actuel:', isPremium, 'pour user:', user.id);
      console.log('🎯 [Header] Type de isPremium:', typeof isPremium);
      console.log('🎯 [Header] isPremium === true?', isPremium === true);
    }
  }, [isPremium, user]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Logo RF - cliquable - reste à gauche même en RTL (convention web) */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">RF</span>
            </div>
            <span className={isRTL(router.locale) ? "font-bold text-lg hidden sm:inline text-right" : "font-bold text-lg hidden sm:inline"}>
              {t('app.name', { ns: 'common' })} {t('app.year', { ns: 'common' })}
            </span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          {/* Sélecteur de langue - visible sur mobile et desktop */}
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  {isPremium && <PremiumBadge size="sm" />}
                  <Button variant="ghost" onClick={() => router.push('/auth/login')}>
                    {t('nav.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => router.push('/auth/login')}>
                    {t('nav.login')}
                  </Button>
                  <Button onClick={() => router.push('/auth/register')}>
                    {t('nav.register')}
                  </Button>
                </>
              )}
            </div>
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
