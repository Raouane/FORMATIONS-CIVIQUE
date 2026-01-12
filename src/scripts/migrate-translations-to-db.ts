/**
 * Script pour migrer les traductions depuis les fichiers JSON vers la base de données
 * 
 * Usage:
 *   npx tsx src/scripts/migrate-translations-to-db.ts
 */

// ⚠️ IMPORTANT : Charger dotenv AVANT d'importer les modules qui utilisent les variables d'environnement
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import * as fs from 'fs';
import * as path from 'path';

// Charger les variables d'environnement
config({ path: resolve(process.cwd(), '.env.local') });

const LOCALES_DIR = path.join(process.cwd(), 'public', 'locales');
const NAMESPACES = ['common', 'home', 'exam', 'revision', 'results', 'auth'];
const LOCALES = ['fr', 'en', 'ar'];

interface TranslationsByLocale {
  [locale: string]: Record<string, any>;
}

function loadTranslationsFromFiles(): Map<string, TranslationsByLocale> {
  const translations = new Map<string, TranslationsByLocale>();

  for (const namespace of NAMESPACES) {
    const namespaceTranslations: TranslationsByLocale = {};

    for (const locale of LOCALES) {
      const filePath = path.join(LOCALES_DIR, locale, `${namespace}.json`);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        namespaceTranslations[locale] = JSON.parse(content);
        console.log(`✅ Chargé: ${locale}/${namespace}.json`);
      } else {
        console.warn(`⚠️  Fichier manquant: ${locale}/${namespace}.json`);
      }
    }

    translations.set(namespace, namespaceTranslations);
  }

  return translations;
}

function mergeTranslationsByKey(
  translationsByLocale: TranslationsByLocale
): Record<string, { fr?: string; en?: string; ar?: string }> {
  const merged: Record<string, { fr?: string; en?: string; ar?: string }> = {};

  // Fonction récursive pour extraire toutes les clés
  function extractKeys(obj: any, prefix: string = '', locale: string): void {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Si c'est un objet avec name/description (structure imbriquée)
        if ('name' in value && typeof value.name === 'string') {
          if (!merged[`${fullKey}.name`]) merged[`${fullKey}.name`] = {};
          merged[`${fullKey}.name`][locale as 'fr' | 'en' | 'ar'] = value.name;
        }
        if ('description' in value && typeof value.description === 'string') {
          if (!merged[`${fullKey}.description`]) merged[`${fullKey}.description`] = {};
          merged[`${fullKey}.description`][locale as 'fr' | 'en' | 'ar'] = value.description;
        }
        
        // Si ce n'est ni name ni description, c'est un objet imbriqué
        if (!('name' in value) && !('description' in value)) {
          extractKeys(value, fullKey, locale);
        }
      } else if (typeof value === 'string') {
        // Chaîne simple
        if (!merged[fullKey]) merged[fullKey] = {};
        merged[fullKey][locale as 'fr' | 'en' | 'ar'] = value;
      }
    }
  }

  // Extraire les clés de chaque locale
  for (const locale of LOCALES) {
    if (translationsByLocale[locale]) {
      extractKeys(translationsByLocale[locale], '', locale);
    }
  }

  return merged;
}

async function main() {
  console.log('🚀 Migration des traductions vers la base de données...\n');

  // Vérifier les variables d'environnement
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Variables d\'environnement manquantes dans .env.local:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✅' : '❌');
    console.error('\n💡 Assurez-vous que le fichier .env.local existe et contient ces variables.');
    process.exit(1);
  }

  // Créer le client Supabase directement (comme dans seed-questions-jsonb.ts)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Charger les traductions depuis les fichiers
  const translations = loadTranslationsFromFiles();

  // Migrer chaque namespace
  for (const [namespace, translationsByLocale] of translations) {
    console.log(`\n📦 Migration du namespace: ${namespace}`);
    
    // Fusionner les traductions par clé
    const merged = mergeTranslationsByKey(translationsByLocale);

    // Insérer dans la BD
    let successCount = 0;
    let errorCount = 0;
    
    for (const [key, values] of Object.entries(merged)) {
      try {
        // Insérer directement dans la BD (sans passer par translationService)
        const { error } = await supabase
          .from('fc_translations')
          .upsert({
            namespace,
            key,
            translations: values as any,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'namespace,key',
          });

        if (error) {
          throw error;
        }

        successCount++;
        if (successCount % 10 === 0) {
          console.log(`  ✅ ${successCount} traductions migrées...`);
        }
      } catch (error) {
        errorCount++;
        console.error(`  ❌ Erreur pour ${key}:`, error);
      }
    }
    
    console.log(`  ✅ ${successCount} traductions migrées avec succès`);
    if (errorCount > 0) {
      console.log(`  ⚠️  ${errorCount} erreurs`);
    }
  }

  console.log('\n✅ Migration terminée !');
  console.log('\n💡 Vous pouvez maintenant utiliser translationService.getTranslation() au lieu de next-i18next');
  console.log('💡 Ou utiliser le hook useDBTranslation() dans vos composants React');
}

if (require.main === module) {
  main().catch(console.error);
}
