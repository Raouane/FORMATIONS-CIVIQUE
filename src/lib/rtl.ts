/**
 * Utilitaires pour la gestion RTL (Right-to-Left)
 * Supporte l'arabe et autres langues RTL
 */

export type SupportedLocale = 'fr' | 'en' | 'ar';

/**
 * Détermine si une locale est RTL
 */
export function isRTL(locale: string | undefined | null): boolean {
  return locale === 'ar';
}

/**
 * Retourne la direction (rtl ou ltr) pour une locale donnée
 */
export function getDirection(locale: string | undefined | null): 'rtl' | 'ltr' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}

/**
 * Retourne la langue HTML pour une locale donnée
 */
export function getHTMLlang(locale: string | undefined | null): string {
  const langMap: Record<string, string> = {
    fr: 'fr',
    en: 'en',
    ar: 'ar',
  };
  return langMap[locale || 'fr'] || 'fr';
}

/**
 * Retourne la police appropriée pour une locale
 * Pour l'arabe, on utilise Cairo (lisible et moderne)
 */
export function getFontFamily(locale: string | undefined | null): string {
  if (locale === 'ar') {
    return "'Cairo', 'Segoe UI', 'Tahoma', 'Arial', sans-serif";
  }
  return "'Inter', 'system-ui', sans-serif";
}
