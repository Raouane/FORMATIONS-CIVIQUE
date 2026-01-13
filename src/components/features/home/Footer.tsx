'use client';

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const router = useRouter();
  const { t } = useTranslation('common');

  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary-foreground/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">{t('footer.republic')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => window.open('https://www.immigration.interieur.gouv.fr/Accueil-et-accompagnement/La-citoyennete-francaise/Le-livret-du-citoyen', '_blank')}
            >
              <FileText className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('footer.citizenBooklet')}
            </Button>
            <Button
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => router.push('/mentions-legales')}
            >
              {t('footer.legalNotice')}
            </Button>
            <Button
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => router.push('/cgv')}
            >
              CGV
            </Button>
            <Button
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => router.push('/politique-confidentialite')}
            >
              {t('footer.privacyPolicy')}
            </Button>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-6 text-center text-sm text-primary-foreground/80">
          <p>{t('footer.copyright')}</p>
          <p className="mt-2">{t('footer.description')}</p>
        </div>
      </div>
    </footer>
  );
}
