/**
 * Script pour migrer les chapitres de révision depuis revision-content.ts vers la base de données
 * 
 * Usage:
 *   npx tsx src/scripts/migrate-revision-chapters-to-db.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { REVISION_CONTENT } from '@/lib/revision-content';
import { QuestionTheme, UserLevel } from '@/types/database';

// Charger les variables d'environnement
config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('🚀 Migration des chapitres de révision vers la base de données...\n');

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

  // Créer le client Supabase directement
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  console.log(`📚 ${REVISION_CONTENT.length} chapitres à migrer\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const chapter of REVISION_CONTENT) {
    try {
      // Pour l'instant, on met seulement le contenu FR
      // Les traductions EN/AR devront être ajoutées manuellement ou via un autre script
      const chapterData = {
        id: chapter.id,
        theme: chapter.theme,
        level: chapter.level,
        title: {
          fr: chapter.title,
          en: chapter.title, // TODO: Ajouter les traductions EN
          ar: chapter.title, // TODO: Ajouter les traductions AR
        },
        content: {
          fr: chapter.content,
          en: chapter.content, // TODO: Ajouter les traductions EN
          ar: chapter.content, // TODO: Ajouter les traductions AR
        },
        order_index: chapter.order,
      };

      const { error } = await supabase
        .from('fc_revision_chapters')
        .upsert(chapterData, {
          onConflict: 'id',
        });

      if (error) {
        throw error;
      }

      successCount++;
      console.log(`  ✅ ${chapter.id} - ${chapter.title}`);
    } catch (error) {
      errorCount++;
      console.error(`  ❌ Erreur pour ${chapter.id}:`, error);
    }
  }

  console.log(`\n✅ ${successCount} chapitres migrés avec succès`);
  if (errorCount > 0) {
    console.log(`  ⚠️  ${errorCount} erreurs`);
  }

  console.log('\n💡 Note: Les traductions EN/AR sont identiques au FR pour l\'instant.');
  console.log('💡 Vous pouvez les mettre à jour directement dans Supabase ou créer un script de traduction.');
}

if (require.main === module) {
  main().catch(console.error);
}
