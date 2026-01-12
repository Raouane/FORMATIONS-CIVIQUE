'use client';

import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSelector() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleLanguageChange = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
    // Sauvegarder la préférence dans un cookie
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
  };

  return (
    <Select value={router.locale || 'fr'} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fr">{t('language.french')}</SelectItem>
        <SelectItem value="en">{t('language.english')}</SelectItem>
        <SelectItem value="ar">{t('language.arabic')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
