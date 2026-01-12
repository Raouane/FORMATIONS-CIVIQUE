/**
 * Script pour corriger la politique RLS de fc_questions
 * Permet l'accès anonyme aux questions non-premium
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function fixRLSPolicy() {
  console.log('🔧 Correction de la politique RLS pour fc_questions...\n');

  try {
    // Supprimer l'ancienne politique
    const dropPolicy = `
      DROP POLICY IF EXISTS "Authenticated users can view non-premium questions" ON fc_questions;
    `;

    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: dropPolicy,
    });

    if (dropError) {
      // Si exec_sql n'existe pas, utiliser une requête directe
      console.log('⚠️  Méthode alternative: exécutez le SQL manuellement dans Supabase Dashboard');
      console.log('\n📋 SQL à exécuter:\n');
      console.log(`
-- Supprimer l'ancienne politique
DROP POLICY IF EXISTS "Authenticated users can view non-premium questions" ON fc_questions;

-- Créer une nouvelle politique qui permet l'accès anonyme
CREATE POLICY "Anyone can view non-premium questions"
  ON fc_questions FOR SELECT
  USING (
    is_premium = false 
    OR 
    EXISTS (
      SELECT 1 FROM fc_profiles 
      WHERE id = auth.uid() AND is_premium = true
    )
  );
      `);
      return;
    }

    // Créer la nouvelle politique
    const createPolicy = `
      CREATE POLICY "Anyone can view non-premium questions"
        ON fc_questions FOR SELECT
        USING (
          is_premium = false 
          OR 
          EXISTS (
            SELECT 1 FROM fc_profiles 
            WHERE id = auth.uid() AND is_premium = true
          )
        );
    `;

    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: createPolicy,
    });

    if (createError) {
      throw createError;
    }

    console.log('✅ Politique RLS corrigée avec succès!');
    console.log('\n📝 La nouvelle politique permet:');
    console.log('   - Accès anonyme aux questions non-premium');
    console.log('   - Accès premium pour les utilisateurs authentifiés premium');
  } catch (error: any) {
    console.error('❌ Erreur lors de la correction:', error.message);
    console.log('\n📋 Veuillez exécuter manuellement le SQL dans Supabase Dashboard:');
    console.log('   1. Allez sur https://supabase.com/dashboard');
    console.log('   2. Sélectionnez votre projet');
    console.log('   3. Allez dans SQL Editor');
    console.log('   4. Copiez-collez le contenu de database/fix_questions_rls.sql');
    console.log('   5. Exécutez la requête');
  }
}

fixRLSPolicy();
