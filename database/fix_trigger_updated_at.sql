-- Script de correction du trigger updated_at pour fc_profiles
-- À exécuter dans Supabase Dashboard → SQL Editor
-- Ce script corrige l'erreur : record "new" has no field "updatedAt"

-- 1. Supprimer l'ancien trigger problématique s'il existe
DROP TRIGGER IF EXISTS on_auth_user_updated ON fc_profiles;
DROP TRIGGER IF EXISTS update_fc_profiles_updated_at ON fc_profiles;

-- 2. S'assurer que la colonne updated_at existe (avec underscore, pas camelCase)
ALTER TABLE fc_profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Créer une fonction propre pour gérer la date de mise à jour
-- Utilise updated_at (snake_case) et non updatedAt (camelCase)
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Créer le trigger correctement avec le bon nom de colonne
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON fc_profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- 5. Vérification : Afficher les triggers actifs sur fc_profiles
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'fc_profiles';

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Trigger corrigé avec succès ! La colonne utilisée est updated_at (snake_case)';
END $$;
