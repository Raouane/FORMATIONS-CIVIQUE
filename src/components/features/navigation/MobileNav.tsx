'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigation } from '@/hooks/useNavigation';
import { UserLevel } from '@/types';
import { isRTL } from '@/lib/rtl';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Book, Play, FileText, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const { startPath } = useNavigation();
  const [isOpen, setIsOpen] = useState(false);

  // Navigation optimisée avec fermeture immédiate du drawer
  // Utilisation de useCallback pour éviter les re-créations de fonction
  const handleNavigation = useCallback((path: string, options?: { locale?: string }) => {
    setIsOpen(false); // Fermer le drawer immédiatement (synchrone)
    
    // Utiliser requestAnimationFrame pour différer la navigation et permettre
    // au drawer de se fermer visuellement avant la navigation
    requestAnimationFrame(() => {
      if (options?.locale) {
        router.push(path, path, { locale: options.locale });
      } else {
        router.push(path); // Navigation non-bloquante
      }
    });
  }, [router]);

  // Mémoriser le chemin de navigation pour éviter les re-renders
  const memberAreaPath = useMemo(() => user ? '/profile' : '/auth/login', [user]);

  // Handler pour le bouton CTA optimisé
  const handleStartPath = useCallback(() => {
    setIsOpen(false); // Fermer immédiatement
    requestAnimationFrame(() => {
      startPath(UserLevel.A2);
    });
  }, [startPath]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side={isRTL(router.locale) ? "right" : "left"} 
        className="w-[300px] sm:w-[400px] p-0"
      >
        <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
        <SheetDescription className="sr-only">Menu principal de navigation</SheetDescription>
        <div className="flex flex-col h-full">
          {/* Header avec logo RF */}
          <div className="p-6 border-b">
            <SheetClose asChild>
              <button
                onClick={() => handleNavigation('/')}
                className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity cursor-pointer"
              >
                {/* Logo RF - carré bleu arrondi */}
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-white font-bold text-xl">RF</span>
                </div>
                <div className={cn("flex-1", isRTL(router.locale) ? "text-right" : "text-left")}>
                  <h2 className="font-bold text-lg leading-tight">{t('app.name', { ns: 'common' })}</h2>
                  <p className="text-xs text-muted-foreground">{t('app.year', { ns: 'common' })}</p>
                </div>
              </button>
            </SheetClose>
          </div>

          {/* Menu de navigation */}
          <div className="flex-1 overflow-y-auto p-6 space-y-1">
            {/* Cours */}
            <Button
              variant="ghost"
              className="w-full justify-start h-auto py-3 px-4"
              onClick={() => handleNavigation('/revision')}
            >
              <Book className="h-5 w-5 mr-3 rtl:mr-0 rtl:ml-3 text-muted-foreground" />
              <span className="text-base">{t('nav.courses')}</span>
            </Button>

            {/* Simulations */}
            <Button
              variant="ghost"
              className="w-full justify-start h-auto py-3 px-4"
              onClick={() => handleNavigation('/simulation', { locale: router.locale || 'fr' })}
            >
              <Play className="h-5 w-5 mr-3 rtl:mr-0 rtl:ml-3 text-muted-foreground" />
              <span className="text-base">{t('nav.simulations')}</span>
            </Button>

            {/* Ressources PDF */}
            <Button
              variant="ghost"
              className="w-full justify-start h-auto py-3 px-4"
              onClick={() => {
                setIsOpen(false); // Fermer le drawer immédiatement
                window.open('https://www.immigration.interieur.gouv.fr/Accueil-et-accompagnement/La-citoyennete-francaise/Le-livret-du-citoyen', '_blank');
              }}
            >
              <FileText className="h-5 w-5 mr-3 rtl:mr-0 rtl:ml-3 text-muted-foreground" />
              <span className="text-base">{t('nav.pdfResources')}</span>
            </Button>

            {/* Espace Membre */}
            <Button
              variant="ghost"
              className="w-full justify-start h-auto py-3 px-4"
              onClick={() => handleNavigation(memberAreaPath)}
            >
              <Users className="h-5 w-5 mr-3 rtl:mr-0 rtl:ml-3 text-muted-foreground" />
              <span className="text-base">{t('nav.memberArea')}</span>
            </Button>
          </div>

          {/* Bouton CTA en bas */}
          <div className="p-6 border-t bg-background">
            <Button
              className="w-full h-12 text-base font-medium rounded-lg"
              onClick={handleStartPath}
            >
              {t('buttons.startFree')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
