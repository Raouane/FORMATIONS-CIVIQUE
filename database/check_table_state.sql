-- Script pour vérifier l'état actuel de la table fc_questions
-- Exécuter ce script pour comprendre ce qui s'est passé

-- 1. Vérifier la structure de la table
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'fc_questions'
ORDER BY ordinal_position;

-- 2. Compter le nombre total de questions
SELECT COUNT(*) as total_questions FROM fc_questions;

-- 3. Vérifier le format des colonnes (si elles existent)
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN content IS NOT NULL THEN 1 END) as has_content,
  COUNT(CASE WHEN options IS NOT NULL THEN 1 END) as has_options,
  COUNT(CASE WHEN explanation IS NOT NULL THEN 1 END) as has_explanation,
  COUNT(CASE WHEN jsonb_typeof(content) = 'object' THEN 1 END) as content_is_object,
  COUNT(CASE WHEN jsonb_typeof(options) = 'object' THEN 1 END) as options_is_object,
  COUNT(CASE WHEN jsonb_typeof(explanation) = 'object' THEN 1 END) as explanation_is_object
FROM fc_questions;

-- 4. Afficher quelques exemples (si des données existent)
SELECT 
  id,
  jsonb_typeof(content) as content_type,
  jsonb_typeof(options) as options_type,
  jsonb_typeof(explanation) as explanation_type,
  content,
  options,
  explanation
FROM fc_questions
LIMIT 5;

-- 5. Vérifier si les colonnes temporaires existent encore
SELECT 
  column_name
FROM information_schema.columns
WHERE table_name = 'fc_questions'
  AND column_name LIKE '%_jsonb';
