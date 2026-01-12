'use client';

import { useTranslation } from 'next-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';

export function Resources() {
  const { t } = useTranslation('home');

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900">
          {t('resources.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-[#0050a1]/10 flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-[#0050a1]" />
              </div>
              <CardTitle className="text-gray-900">{t('resources.livret.title')}</CardTitle>
              <CardDescription className="text-gray-600">
                {t('resources.livret.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full rounded-xl bg-[#0050a1] hover:bg-[#003d7a] text-white shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => window.open('https://www.immigration.interieur.gouv.fr/Accueil-et-accompagnement/La-citoyennete-francaise/Le-livret-du-citoyen', '_blank')}
              >
                {t('resources.livret.button')}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-[#2ECC71]/10 flex items-center justify-center mb-4">
                <FileText className="h-7 w-7 text-[#2ECC71]" />
              </div>
              <CardTitle className="text-gray-900">{t('resources.site.title')}</CardTitle>
              <CardDescription className="text-gray-600">
                {t('resources.site.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full rounded-xl bg-[#2ECC71] hover:bg-[#27AE60] text-white shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => window.open('https://www.immigration.interieur.gouv.fr/Accueil-et-accompagnement/La-citoyennete-francaise', '_blank')}
              >
                {t('resources.site.button')}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
