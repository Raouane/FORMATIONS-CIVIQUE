'use client';

import { useTranslation } from 'next-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { STATS_DATA } from '@/lib/constants';
import { FileText, Clock, TrendingUp } from 'lucide-react';

const iconMap = [
  FileText,
  Clock,
  TrendingUp,
];

export function Stats() {
  const { t } = useTranslation('home');

  const iconColors = ['#0050a1', '#2ECC71', '#FFA500']; // Bleu, Vert, Orange

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS_DATA.map((stat, index) => {
            const Icon = iconMap[index] || FileText;
            const iconColor = iconColors[index % iconColors.length];
            
            return (
              <Card key={index} className="rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                <CardHeader>
                  <div className="mb-4 w-14 h-14 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: `${iconColor}15` }}>
                    <Icon className="h-7 w-7" style={{ color: iconColor }} />
                  </div>
                  <CardTitle className="text-3xl font-bold mb-2 text-gray-900">{stat.value}</CardTitle>
                  <CardDescription className="text-lg text-gray-700 font-semibold">
                    {(() => {
                      if (stat.label === 'Questions') return t('stats.questions');
                      if (stat.label === 'Durée') return t('stats.duration');
                      if (stat.label === 'Réussite') return t('stats.success');
                      return stat.label;
                    })()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {(() => {
                      if (stat.label === 'Questions') return t('stats.description.questions');
                      if (stat.label === 'Durée') return t('stats.description.duration');
                      if (stat.label === 'Réussite') return t('stats.description.success');
                      return stat.description;
                    })()}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
