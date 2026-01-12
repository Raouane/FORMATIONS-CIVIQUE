/**
 * Script pour ajouter les traductions AR aux chapitres de révision
 * 
 * Usage:
 *   npx tsx src/scripts/add-ar-translations-to-revision-chapters.ts
 *   npm run add:ar-translations
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Charger les variables d'environnement
config({ path: resolve(process.cwd(), '.env.local') });

interface ChapterTranslation {
  title: {
    ar: string;
  };
  content: {
    ar: string;
  };
}

interface TranslationsFile {
  [chapterId: string]: ChapterTranslation;
}

async function main() {
  console.log('🌐 Ajout des traductions AR aux chapitres de révision...\n');

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

  // Charger le fichier JSON des traductions AR
  const translationsPath = resolve(process.cwd(), 'database/revision_chapters_ar_translations.json');
  let translations: TranslationsFile;

  try {
    const fileContent = readFileSync(translationsPath, 'utf-8');
    translations = JSON.parse(fileContent);
    console.log(`📄 ${Object.keys(translations).length} traductions AR chargées depuis ${translationsPath}\n`);
  } catch (error) {
    console.error('❌ Erreur lors du chargement du fichier de traductions:', error);
    console.error(`   Chemin attendu: ${translationsPath}`);
    process.exit(1);
  }

  // Créer le client Supabase directement
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Vérifier que la table existe
  const { data: testData, error: testError } = await supabase
    .from('fc_revision_chapters')
    .select('id')
    .limit(1);

  if (testError) {
    console.error('❌ Erreur lors de la connexion à la table fc_revision_chapters:');
    console.error('   ', testError.message);
    console.error('\n💡 Assurez-vous que la table existe. Exécutez d\'abord:');
    console.error('   database/migration_add_revision_chapters_table.sql');
    process.exit(1);
  }

  if (!testData || testData.length === 0) {
    console.error('❌ La table fc_revision_chapters est vide.');
    console.error('\n💡 Exécutez d\'abord la migration des chapitres:');
    console.error('   npm run migrate:revision');
    process.exit(1);
  }

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  // Mettre à jour chaque chapitre avec les traductions AR
  for (const [chapterId, translation] of Object.entries(translations)) {
    try {
      // Récupérer le chapitre actuel
      const { data: currentChapter, error: fetchError } = await supabase
        .from('fc_revision_chapters')
        .select('title, content')
        .eq('id', chapterId)
        .single();

      if (fetchError || !currentChapter) {
        console.warn(`  ⚠️  Chapitre "${chapterId}" non trouvé dans la BD, ignoré`);
        skippedCount++;
        continue;
      }

      // Mettre à jour avec les traductions AR
      const currentTitle = currentChapter.title as Record<string, string>;
      const currentContent = currentChapter.content as Record<string, string>;

      const updatedTitle = {
        ...currentTitle,
        ar: translation.title.ar,
      };

      const updatedContent = {
        ...currentContent,
        ar: translation.content.ar,
      };

      const { error: updateError } = await supabase
        .from('fc_revision_chapters')
        .update({
          title: updatedTitle,
          content: updatedContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', chapterId);

      if (updateError) {
        throw updateError;
      }

      successCount++;
      console.log(`  ✅ ${chapterId} - Traduction AR ajoutée`);
    } catch (error) {
      errorCount++;
      console.error(`  ❌ Erreur pour ${chapterId}:`, error instanceof Error ? error.message : error);
    }
  }

  console.log(`\n✅ ${successCount} chapitres mis à jour avec succès`);
  if (skippedCount > 0) {
    console.log(`  ⚠️  ${skippedCount} chapitres ignorés (non trouvés dans la BD)`);
  }
  if (errorCount > 0) {
    console.log(`  ❌ ${errorCount} erreurs`);
  }

  console.log('\n🎉 Les traductions AR ont été ajoutées avec succès !');
  console.log('💡 La page /revision affichera maintenant le contenu en arabe quand la locale est "ar".');
}

if (require.main === module) {
  main().catch(console.error);
}
