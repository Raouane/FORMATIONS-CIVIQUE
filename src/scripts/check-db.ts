import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Charger les variables d'environnement depuis .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.error('Vérifiez que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies dans .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  console.log('🔍 Vérification de la connexion à Supabase...\n');

  try {
    // Vérifier la connexion
    const { data: health, error: healthError } = await supabase
      .from('fc_profiles')
      .select('count')
      .limit(1);

    if (healthError && healthError.code !== 'PGRST116') {
      console.error('❌ Erreur de connexion:', healthError.message);
      return false;
    }

    console.log('✅ Connexion à Supabase réussie\n');

    // Vérifier les tables
    const tables = ['fc_profiles', 'fc_questions', 'fc_user_progress', 'fc_exam_results'];
    
    console.log('📊 Vérification des tables...\n');

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.code === '42P01') {
          console.log(`❌ Table ${table} n'existe pas`);
        } else {
          console.log(`⚠️  Table ${table}: ${error.message}`);
        }
      } else {
        const count = data ? (data as any[]).length : 0;
        console.log(`✅ Table ${table} existe (${count} enregistrements)`);
      }
    }

    console.log('\n📝 Instructions:');
    console.log('1. Si des tables n\'existent pas, exécutez database/schema.sql dans Supabase Dashboard');
    console.log('2. Pour injecter des questions, exécutez: npm run seed');
    console.log('3. Vérifiez que les politiques RLS sont activées dans Supabase Dashboard');

    return true;
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    return false;
  }
}

checkDatabase()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
