-- Correction RLS pour fc_profiles : Ajouter la politique INSERT manquante
-- Ce script corrige l'erreur 401 lors de la création de profil

-- Vérifier si la politique existe déjà
DO $$
BEGIN
  -- Supprimer la politique si elle existe déjà (pour éviter les doublons)
  DROP POLICY IF EXISTS "Users can insert own profile" ON fc_profiles;
  
  -- Créer la politique INSERT pour permettre aux utilisateurs de créer leur propre profil
  CREATE POLICY "Users can insert own profile"
    ON fc_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);
    
  RAISE NOTICE 'Politique INSERT créée avec succès pour fc_profiles';
END $$;

-- Vérification : Lister toutes les politiques sur fc_profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'fc_profiles'
ORDER BY policyname;
