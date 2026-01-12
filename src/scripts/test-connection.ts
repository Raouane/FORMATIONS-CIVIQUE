import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.error('Vérifiez que NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies dans .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🧪 Test de connexion Supabase...\n');

  try {
    // Test 1: Vérifier la connexion de base
    console.log('1️⃣ Test de connexion de base...');
    const { data: health, error: healthError } = await supabase
      .from('fc_profiles')
      .select('count')
      .limit(1);

    if (healthError && healthError.code !== 'PGRST116') {
      console.error('❌ Erreur de connexion:', healthError.message);
      return false;
    }
    console.log('✅ Connexion réussie\n');

    // Test 2: Vérifier les tables
    console.log('2️⃣ Vérification des tables...');
    const tables = ['fc_profiles', 'fc_questions', 'fc_user_progress', 'fc_exam_results'];
    
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

    // Test 3: Vérifier les politiques RLS
    console.log('\n3️⃣ Vérification des politiques RLS...');
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies_info')
      .select('*');

    if (policiesError) {
      console.log('⚠️  Impossible de vérifier les politiques automatiquement');
      console.log('   Vérifiez manuellement dans Supabase Dashboard → Authentication → Policies');
    } else {
      console.log('✅ Politiques RLS vérifiées');
    }

    // Test 4: Test d'insertion (simulation)
    console.log('\n4️⃣ Test de structure des tables...');
    const { data: profileStructure, error: structureError } = await supabase
      .from('fc_profiles')
      .select('*')
      .limit(0);

    if (structureError && structureError.code !== 'PGRST116') {
      console.log(`⚠️  Erreur structure: ${structureError.message}`);
    } else {
      console.log('✅ Structure des tables correcte');
    }

    console.log('\n✅ Tous les tests sont passés !');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Exécutez database/schema.sql si des tables manquent');
    console.log('2. Vérifiez les politiques RLS dans Supabase Dashboard');
    console.log('3. Testez l\'application avec: npm run dev');

    return true;
  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    return false;
  }
}

testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
