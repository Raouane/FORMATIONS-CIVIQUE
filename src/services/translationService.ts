/**
 * Service pour gérer les traductions depuis la base de données
 * Remplace ou complète next-i18next pour les traductions dynamiques
 */

import { supabase, createServiceRoleClient, TABLES } from '@/lib/supabase';
import { SupportedLocale } from '@/lib/localization';

export interface TranslationRecord {
  namespace: string;
  key: string;
  translations: {
    fr: string;
    en?: string;
    ar?: string;
  };
}

// Cache en mémoire pour améliorer les performances
const translationCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Récupère une traduction depuis la base de données
 */
export async function getTranslation(
  namespace: string,
  key: string,
  locale: SupportedLocale = 'fr'
): Promise<string> {
  const cacheKey = `${namespace}.${key}.${locale}`;
  const cached = translationCache.get(cacheKey);
  
  // Vérifier le cache
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.TRANSLATIONS)
      .select('translations')
      .eq('namespace', namespace)
      .eq('key', key)
      .single();

    if (error || !data) {
      console.warn(`[Translation] Clé non trouvée: ${namespace}.${key}`);
      return key; // Retourne la clé si non trouvée
    }

    const translations = data.translations as Record<string, string>;
    
    // Retourne la traduction demandée ou fallback sur 'fr'
    const result = translations[locale] || translations.fr || key;
    
    // Mettre en cache
    translationCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error(`[Translation] Erreur pour ${namespace}.${key}:`, error);
    return key;
  }
}

/**
 * Récupère toutes les traductions d'un namespace
 * Utile pour charger un namespace complet (comme next-i18next)
 */
export async function getTranslationsByNamespace(
  namespace: string,
  locale: SupportedLocale = 'fr'
): Promise<Record<string, string>> {
  const cacheKey = `namespace.${namespace}.${locale}`;
  const cached = translationCache.get(cacheKey);
  
  // Vérifier le cache
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.TRANSLATIONS)
      .select('key, translations')
      .eq('namespace', namespace);

    if (error || !data) {
      console.warn(`[Translation] Namespace non trouvé: ${namespace}`);
      return {};
    }

    const result: Record<string, string> = {};
    
    for (const record of data) {
      const translations = record.translations as Record<string, string>;
      result[record.key] = translations[locale] || translations.fr || record.key;
    }

    // Mettre en cache
    translationCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error(`[Translation] Erreur pour namespace ${namespace}:`, error);
    return {};
  }
}

/**
 * Insère ou met à jour une traduction
 * Nécessite les permissions admin (service role key)
 */
export async function upsertTranslation(
  namespace: string,
  key: string,
  translations: { fr: string; en?: string; ar?: string }
): Promise<void> {
  try {
    const adminClient = createServiceRoleClient();
    
    const { error } = await adminClient
      .from(TABLES.TRANSLATIONS)
      .upsert({
        namespace,
        key,
        translations: translations as any,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'namespace,key',
      });

    if (error) {
      throw error;
    }

    // Invalider le cache
    translationCache.clear();
  } catch (error) {
    console.error(`[Translation] Erreur upsert pour ${namespace}.${key}:`, error);
    throw error;
  }
}

/**
 * Migre les traductions depuis les fichiers JSON vers la BD
 * Utilise le service role key pour bypasser RLS
 */
export async function migrateTranslationsFromJSON(
  namespace: string,
  translations: Record<string, any>,
  parentKey: string = ''
): Promise<void> {
  const adminClient = createServiceRoleClient();

  for (const [key, value] of Object.entries(translations)) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Si c'est un objet avec fr/en/ar, c'est une traduction
      if ('fr' in value || 'en' in value || 'ar' in value) {
        await adminClient
          .from(TABLES.TRANSLATIONS)
          .upsert({
            namespace,
            key: fullKey,
            translations: value,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'namespace,key',
          });
      } else {
        // Sinon, c'est un objet imbriqué, on récursive
        await migrateTranslationsFromJSON(namespace, value, fullKey);
      }
    } else if (typeof value === 'string') {
      // Si c'est une chaîne simple, on la met seulement en FR
      await adminClient
        .from(TABLES.TRANSLATIONS)
        .upsert({
          namespace,
          key: fullKey,
          translations: { fr: value },
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'namespace,key',
        });
    }
  }
}

/**
 * Vide le cache des traductions
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

// Export par défaut pour faciliter l'import
export default {
  getTranslation,
  getTranslationsByNamespace,
  upsertTranslation,
  migrateTranslationsFromJSON,
  clearTranslationCache,
};
