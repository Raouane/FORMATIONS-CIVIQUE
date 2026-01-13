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
        <div className="border-t border-primary-foreground/20 pt-6">
          <div className="text-center text-sm text-primary-foreground/80 mb-4">
            <p>{t('footer.copyright')}</p>
            <p className="mt-2">{t('footer.description')}</p>
            <p className="mt-2 text-xs text-primary-foreground/60 italic">
              {t('footer.notOfficial', { defaultValue: 'Ce site n\'est pas un site officiel du gouvernement français' })}
            </p>
          </div>
          
          {/* Logos de paiement */}
          <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-primary-foreground/20">
            <span className="text-xs text-primary-foreground/60 mr-2">Paiement sécurisé :</span>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded px-2 py-1 text-xs font-semibold text-gray-700">VISA</div>
              <div className="bg-white rounded px-2 py-1 text-xs font-semibold text-gray-700">Mastercard</div>
              <div className="bg-white rounded px-2 py-1 text-xs font-semibold text-gray-700">CB</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
