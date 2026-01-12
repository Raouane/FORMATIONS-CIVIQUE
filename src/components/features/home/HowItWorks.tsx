'use client';

import { useTranslation } from 'next-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Shield, Timer } from 'lucide-react';

const steps = [
  {
    icon: BookOpen,
    titleKey: 'step1.title',
    descriptionKey: 'step1.description',
  },
  {
    icon: Shield,
    titleKey: 'step2.title',
    descriptionKey: 'step2.description',
  },
  {
    icon: Timer,
    titleKey: 'step3.title',
    descriptionKey: 'step3.description',
  },
];

export function HowItWorks() {
  const { t } = useTranslation('home');

  const stepColors = ['#0050a1', '#2ECC71', '#FFA500']; // Bleu, Vert, Orange

  return (
    <section className="py-16 px-4 bg-white relative">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900">
          {t('howItWorks.title')}
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          {t('howItWorks.subtitle')}
        </p>
        <div className="relative">
          {/* Ligne de connexion (visible sur desktop) */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gray-200 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const bgColor = stepColors[index % stepColors.length];
              
              return (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-6 relative z-10"
                    style={{ backgroundColor: bgColor }}
                  >
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <Card className="border-0 shadow-lg rounded-2xl w-full">
                    <CardHeader>
                      <CardTitle className="text-xl text-center text-gray-900">
                        {t(`howItWorks.${step.titleKey}`)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base text-center text-gray-600">
                        {t(`howItWorks.${step.descriptionKey}`)}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
