/**
 * Utilitaires pour la localisation des champs JSONB
 */

export type SupportedLocale = 'fr' | 'en' | 'ar';

/**
 * Extrait un texte localisé d'un objet JSONB avec fallback
 * @param localizedField Objet JSONB avec clés de langue
 * @param locale Locale demandée
 * @param fallbackLocale Locale de fallback (par défaut 'fr')
 * @returns Texte dans la locale demandée ou fallback
 */
export function getLocalizedText(
  localizedField: { [key: string]: string } | string | null | undefined,
  locale: SupportedLocale = 'fr',
  fallbackLocale: SupportedLocale = 'fr'
): string {
  // Si c'est déjà une string (ancien format), la retourner directement
  if (typeof localizedField === 'string') {
    return localizedField;
  }

  // Si null ou undefined, retourner chaîne vide
  if (!localizedField || typeof localizedField !== 'object') {
    return '';
  }

  // Essayer d'abord la locale demandée
  if (localizedField[locale]) {
    return localizedField[locale];
  }

  // Fallback sur la locale par défaut
  if (localizedField[fallbackLocale]) {
    return localizedField[fallbackLocale];
  }

  // Si aucune traduction disponible, retourner la première valeur trouvée
  const firstKey = Object.keys(localizedField)[0];
  return firstKey ? localizedField[firstKey] : '';
}

/**
 * Extrait un array localisé d'un objet JSONB avec fallback
 * @param localizedArray Objet JSONB avec clés de langue et arrays
 * @param locale Locale demandée
 * @param fallbackLocale Locale de fallback (par défaut 'fr')
 * @returns Array dans la locale demandée ou fallback
 */
export function getLocalizedArray(
  localizedArray: { [key: string]: string[] } | string[] | null | undefined,
  locale: SupportedLocale = 'fr',
  fallbackLocale: SupportedLocale = 'fr'
): string[] {
  // Si c'est déjà un array (ancien format avant migration JSONB), le retourner directement
  if (Array.isArray(localizedArray)) {
    console.log('[LOCALIZATION] getLocalizedArray: Array direct (ancien format), retourné tel quel', {
      length: localizedArray.length,
      preview: localizedArray.slice(0, 2)
    });
    return localizedArray;
  }

  // Si null ou undefined, retourner array vide
  if (!localizedArray || typeof localizedArray !== 'object') {
    console.warn('[LOCALIZATION] getLocalizedArray: null/undefined ou pas un objet', {
      type: typeof localizedArray,
      value: localizedArray
    });
    return [];
  }

  // Essayer d'abord la locale demandée
  if (localizedArray[locale] && Array.isArray(localizedArray[locale])) {
    return localizedArray[locale];
  }

  // Fallback sur la locale par défaut
  if (localizedArray[fallbackLocale] && Array.isArray(localizedArray[fallbackLocale])) {
    return localizedArray[fallbackLocale];
  }

  // Si aucune traduction disponible, retourner le premier array trouvé
  const firstKey = Object.keys(localizedArray)[0];
  if (firstKey && Array.isArray(localizedArray[firstKey])) {
    return localizedArray[firstKey];
  }

  console.error('[LOCALIZATION] getLocalizedArray: Aucun array valide trouvé', {
    localizedArray,
    type: typeof localizedArray,
    keys: Object.keys(localizedArray || {})
  });
  return [];
}

/**
 * Convertit une QuestionRaw (avec JSONB) en Question (avec textes extraits)
 * @param rawQuestion Question brute de la base de données
 * @param locale Locale pour extraire les traductions
 * @returns Question avec textes extraits selon la locale
 */
export function extractLocalizedQuestion(
  rawQuestion: any,
  locale: SupportedLocale = 'fr'
): any {
  const extracted = {
    ...rawQuestion,
    content: getLocalizedText(rawQuestion.content, locale),
    scenario_context: rawQuestion.scenario_context
      ? getLocalizedText(rawQuestion.scenario_context, locale)
      : null,
    options: getLocalizedArray(rawQuestion.options, locale),
    explanation: getLocalizedText(rawQuestion.explanation, locale),
  };

  return extracted;
}
