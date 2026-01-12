'use client';

import { useTranslation } from 'next-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { THEMES_DATA } from '@/lib/constants';
import { Settings, FileText, ScrollText, Building2, Handshake } from 'lucide-react';

const iconMap: Record<string, any> = {
  VALEURS: Settings, // Engrenage bleu
  DROITS: FileText, // Document vert
  HISTOIRE: ScrollText, // Parchemin orange
  POLITIQUE: Building2, // Bâtiment violet
  SOCIETE: Handshake, // Poignée de main rouge
};

export function Themes() {
  const { t } = useTranslation('home');

  // Couleurs inspirées du design : turquoise, vert, orange, magenta
  const themeColors = [
    '#00A79E', // Turquoise
    '#5cb85c', // Vert
    '#FFA500', // Orange
    '#E91E63', // Magenta
    '#0050a1', // Bleu
  ];

  return (
    <section className="py-16 px-4 bg-[#1A2B4C]">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-white">
          {t('themes.title')}
        </h2>
        <p className="text-white/80 text-center mb-12 max-w-2xl mx-auto">
          Couvrez l'ensemble des sujets du nouveau programme officiel 2026.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {THEMES_DATA.slice(0, 4).map((theme, index) => {
            const Icon = iconMap[theme.id] || Settings;
            const themeKey = theme.id.toLowerCase();
            const bgColor = themeColors[index % themeColors.length];
            
            return (
              <div
                key={theme.id}
                className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                style={{ backgroundColor: bgColor }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {t(`themes.${themeKey}.name`)}
                  </h3>
                  <p className="text-sm text-white/90">
                    {t(`themes.${themeKey}.subtitle`, { defaultValue: t(`themes.${themeKey}.description`) })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
