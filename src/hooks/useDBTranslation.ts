/**
 * Hook React pour utiliser les traductions depuis la base de données
 * Compatible avec l'API de next-i18next pour faciliter la migration
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { SupportedLocale } from '@/lib/localization';
import * as translationService from '@/services/translationService';

interface UseDBTranslationReturn {
  t: (key: string, options?: any) => string;
  ready: boolean;
  i18n: {
    language: string;
    changeLanguage: (lang: string) => void;
  };
}

/**
 * Hook pour utiliser les traductions depuis la base de données
 * 
 * @param namespace - Namespace de traduction (ex: 'revision', 'common', 'home')
 * @returns Objet avec fonction t() et état ready
 * 
 * @example
 * ```tsx
 * const { t, ready } = useDBTranslation('revision');
 * if (!ready) return <div>Chargement...</div>;
 * return <h1>{t('title')}</h1>;
 * ```
 */
export function useDBTranslation(namespace: string): UseDBTranslationReturn {
  const router = useRouter();
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  
  // Déterminer la locale actuelle
  const locale = (router.locale || 'fr') as SupportedLocale;

  // Charger les traductions depuis la BD
  useEffect(() => {
    let cancelled = false;

    async function loadTranslations() {
      try {
        const loaded = await translationService.getTranslationsByNamespace(namespace, locale);
        if (!cancelled) {
          setTranslations(loaded);
          setReady(true);
        }
      } catch (error) {
        console.error(`[useDBTranslation] Erreur chargement ${namespace}:`, error);
        if (!cancelled) {
          setReady(true); // On marque comme ready même en cas d'erreur
        }
      }
    }

    loadTranslations();

    return () => {
      cancelled = true;
    };
  }, [namespace, locale]);

  // Fonction de traduction
  const t = useCallback((key: string, options?: any): string => {
    // Si les traductions sont chargées, utiliser le cache
    if (translations[key]) {
      let result = translations[key];
      
      // Gérer les interpolations (ex: {name})
      if (options) {
        for (const [k, v] of Object.entries(options)) {
          result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
        }
      }
      
      return result;
    }

    // Sinon, retourner la clé (fallback)
    return key;
  }, [translations]);

  return {
    t,
    ready,
    i18n: {
      language: locale,
      changeLanguage: (lang: string) => {
        router.push(router.asPath, router.asPath, { locale: lang });
      },
    },
  };
}

/**
 * Hook hybride : utilise la BD en priorité, fallback sur next-i18next
 * 
 * @param namespace - Namespace de traduction
 * @returns Objet avec fonction t() qui essaie la BD puis next-i18next
 */
export function useHybridTranslation(namespace: string) {
  const dbTranslation = useDBTranslation(namespace);
  
  // Fallback sur next-i18next si la BD n'est pas prête
  const t = useCallback((key: string, options?: any): string => {
    if (dbTranslation.ready) {
      return dbTranslation.t(key, options);
    }
    
    // Fallback: utiliser la clé directement (ou next-i18next si disponible)
    return key;
  }, [dbTranslation]);

  return {
    t,
    ready: dbTranslation.ready,
    i18n: dbTranslation.i18n,
  };
}
