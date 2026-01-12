-- Script pour corriger TOUTES les questions invalides AVANT d'ajouter les contraintes
-- Exécuter ce script APRÈS la migration mais AVANT d'ajouter les contraintes CHECK

-- ============================================
-- ÉTAPE 1 : SUPPRIMER LES QUESTIONS INVALIDES
-- ============================================

-- Supprimer les questions avec options NULL
DELETE FROM fc_questions 
WHERE options IS NULL 
   OR jsonb_typeof(options) IS NULL;

-- Supprimer les arrays vides
DELETE FROM fc_questions 
WHERE jsonb_typeof(options) = 'array'
  AND (SELECT jsonb_array_length(options)) = 0;

-- Supprimer les objets JSONB sans clé 'fr'
DELETE FROM fc_questions 
WHERE jsonb_typeof(options) = 'object'
  AND NOT (options ? 'fr');

-- Supprimer les objets où 'fr' n'est pas un array
DELETE FROM fc_questions 
WHERE jsonb_typeof(options) = 'object'
  AND options ? 'fr'
  AND jsonb_typeof(options->'fr') != 'array';

-- Supprimer les objets où 'fr' est un array vide
DELETE FROM fc_questions 
WHERE jsonb_typeof(options) = 'object'
  AND options ? 'fr'
  AND jsonb_typeof(options->'fr') = 'array'
  AND (SELECT jsonb_array_length(options->'fr')) = 0;

-- ============================================
-- ÉTAPE 2 : VÉRIFIER QU'IL NE RESTE QUE DES QUESTIONS VALIDES
-- ============================================

SELECT 
  COUNT(*) as total_valid,
  COUNT(CASE WHEN jsonb_typeof(options) = 'object' AND options ? 'fr' AND jsonb_typeof(options->'fr') = 'array' AND (SELECT jsonb_array_length(options->'fr')) > 0 THEN 1 END) as valid_count
FROM fc_questions;

-- Si total_valid = valid_count, alors toutes les questions sont valides
-- Vous pouvez maintenant exécuter la partie "AJOUTER LES CONTRAINTES" de la migration
