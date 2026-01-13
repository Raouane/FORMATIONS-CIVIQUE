import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client Supabase pour le frontend
// Configuration pour la persistance de session avec localStorage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'supabase.auth.token',
  },
});

// Client Supabase avec service role pour les routes API (backend uniquement)
export function createServiceRoleClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Helper pour les requêtes avec préfixe fc_
// Note : Le préfixe fc_ garantit l'isolation dans une base de données partagée
export const TABLES = {
  PROFILES: 'fc_profiles',
  QUESTIONS: 'fc_questions',
  USER_PROGRESS: 'fc_user_progress',
  EXAM_RESULTS: 'fc_exam_results',
  TRANSLATIONS: 'fc_translations',
  REVISION_CHAPTERS: 'fc_revision_chapters',
} as const;

/**
 * Configuration de connexion Supabase
 * 
 * Pour une base de données partagée :
 * - Toutes les tables utilisent le préfixe fc_ pour éviter les conflits
 * - Les politiques RLS garantissent l'isolation par utilisateur
 * - Voir database/ISOLATION.md pour plus de détails
 */
