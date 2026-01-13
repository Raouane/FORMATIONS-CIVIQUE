'use client';

import { useTranslation } from 'next-i18next';
import { useNavigation } from '@/hooks/useNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PATHS_DATA } from '@/lib/constants';
import { UserLevel } from '@/types/database';
import { Plane, Home, Flag, Check, ArrowRight } from 'lucide-react';

const iconMap = {
  Plane: Plane,
  Home: Home,
  Flag: Flag,
};

export function PathSelector() {
  const { t } = useTranslation('home');
  const { startPath } = useNavigation();

  const handleStartPath = (level: UserLevel) => {
    startPath(level);
  };

  const pathColors = [
    { bg: '#F5D76E', iconBg: '#F4D03F' }, // Jaune/Doré clair pour A2
    { bg: '#2ECC71', iconBg: '#27AE60' }, // Vert pour B1
    { bg: '#E91E63', iconBg: '#C2185B' }, // Magenta pour B2
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900">
          {t('paths.title')}
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          {t('paths.description')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PATHS_DATA.map((path, index) => {
            const Icon = iconMap[path.icon as keyof typeof iconMap] || Plane;
            const pathKey = path.id.split('-')[0]; // 'sejour', 'resident', 'naturalisation'
            const colors = pathColors[index % pathColors.length];
            
            // Appliquer la couleur dorée claire spécifiquement pour la carte A2
            const isA2 = path.level === UserLevel.A2;
            const cardBgColor = isA2 ? '#F5D76E' : 'transparent';
            const cardIconBg = isA2 ? '#F4D03F' : colors.iconBg;
            // Bouton avec couleur différente du fond pour A2 (bleu pour contraste)
            const cardButtonBg = isA2 ? '#0050a1' : colors.bg;
            
            return (
              <Card 
                key={path.id} 
                className="flex flex-col rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden"
                style={{ backgroundColor: cardBgColor }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: cardIconBg }}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <Badge className={`w-fit border-0 ${isA2 ? 'bg-white/30 text-gray-800' : 'bg-gray-100 text-gray-700'}`}>
                      {t('paths.level', { level: path.level })}
                    </Badge>
                  </div>
                  <CardTitle className={`text-2xl mb-2 ${isA2 ? 'text-gray-900' : 'text-gray-900'}`}>
                    {t(`paths.${pathKey}.cardTitle`)}
                  </CardTitle>
                  <CardDescription className={`text-base ${isA2 ? 'text-gray-700' : 'text-gray-600'}`}>
                    {t(`paths.${pathKey}.cardDescription`)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-0">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isA2 ? 'bg-[#F4D03F]' : 'bg-[#2ECC71]'}`}>
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-700">
                        {t(`paths.${pathKey}.feature1`)}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isA2 ? 'bg-[#F4D03F]' : 'bg-[#2ECC71]'}`}>
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-700">
                        {t(`paths.${pathKey}.feature2`)}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isA2 ? 'bg-[#F4D03F]' : 'bg-[#2ECC71]'}`}>
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-700">
                        {t(`paths.${pathKey}.feature3`)}
                      </span>
                    </div>
                  </div>
                  <Button
                    className={`w-full rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 ${isA2 ? 'text-white hover:bg-[#003d7a]' : 'text-white'}`}
                    style={{ backgroundColor: cardButtonBg }}
                    onClick={() => handleStartPath(path.level)}
                  >
                    {t('buttons.startPath', { ns: 'common' })}
                    <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 h-4 w-4 rtl-flip" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
