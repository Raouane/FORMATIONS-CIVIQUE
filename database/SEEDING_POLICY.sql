-- Politique RLS temporaire pour permettre le seeding des questions
-- ⚠️ ATTENTION : Cette politique permet à tous les utilisateurs authentifiés d'insérer des questions
-- Utilisez-la uniquement pour le seeding initial, puis supprimez-la pour la sécurité

-- Option 1 : Permettre l'insertion pour les utilisateurs authentifiés (pour le seeding)
-- Décommentez cette ligne si vous voulez permettre l'insertion via ANON_KEY
-- CREATE POLICY "Allow authenticated users to insert questions for seeding"
--   ON fc_questions FOR INSERT
--   TO authenticated
--   WITH CHECK (true);

-- Option 2 (RECOMMANDÉ) : Utiliser SERVICE_ROLE_KEY pour le seeding
-- La SERVICE_ROLE_KEY bypass les RLS automatiquement
-- Pas besoin de politique supplémentaire

-- Pour supprimer la politique après seeding (si vous avez utilisé l'option 1) :
-- DROP POLICY IF EXISTS "Allow authenticated users to insert questions for seeding" ON fc_questions;
