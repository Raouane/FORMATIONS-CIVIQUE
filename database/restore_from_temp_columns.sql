-- Script pour restaurer les données depuis les colonnes temporaires
-- À exécuter SEULEMENT si les colonnes temporaires existent et contiennent des données

-- 1. Vérifier si les colonnes temporaires existent et contiennent des données
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN content_jsonb IS NOT NULL THEN 1 END) as has_content_jsonb,
  COUNT(CASE WHEN options_jsonb IS NOT NULL THEN 1 END) as has_options_jsonb,
  COUNT(CASE WHEN explanation_jsonb IS NOT NULL THEN 1 END) as has_explanation_jsonb
FROM fc_questions;

-- 2. Si les colonnes temporaires contiennent des données, restaurer les colonnes principales
-- ATTENTION : Ne pas exécuter si les colonnes temporaires n'existent pas ou sont vides

-- Étape A : Vérifier que les colonnes temporaires existent
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'fc_questions' AND column_name = 'content_jsonb'
  ) THEN
    RAISE EXCEPTION 'Les colonnes temporaires n''existent pas. Impossible de restaurer.';
  END IF;
END $$;

-- Étape B : Restaurer les données depuis les colonnes temporaires
-- (À décommenter seulement si les colonnes temporaires contiennent des données)

-- UPDATE fc_questions 
-- SET content = content_jsonb
-- WHERE content IS NULL AND content_jsonb IS NOT NULL;

-- UPDATE fc_questions 
-- SET options = options_jsonb
-- WHERE options IS NULL AND options_jsonb IS NOT NULL;

-- UPDATE fc_questions 
-- SET explanation = explanation_jsonb
-- WHERE explanation IS NULL AND explanation_jsonb IS NOT NULL;

-- UPDATE fc_questions 
-- SET scenario_context = scenario_context_jsonb
-- WHERE scenario_context IS NULL AND scenario_context_jsonb IS NOT NULL;
