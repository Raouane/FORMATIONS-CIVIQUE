-- Fix RLS policy pour permettre l'accès anonyme aux questions non-premium
-- Cette politique permet aux utilisateurs non authentifiés de voir les questions non-premium
-- pour permettre les tests sans authentification

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

-- Note: Cette politique permet :
-- 1. Tous les utilisateurs (authentifiés ou non) peuvent voir les questions non-premium
-- 2. Seuls les utilisateurs premium peuvent voir les questions premium
