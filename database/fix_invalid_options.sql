-- Script pour corriger les questions avec options invalides
-- À exécuter AVANT la migration JSONB si vous avez des erreurs de contrainte

-- 1. Identifier les questions problématiques
SELECT 
  id,
  jsonb_typeof(options) as options_type,
  options,
  CASE 
    WHEN options IS NULL THEN 'NULL'
    WHEN jsonb_typeof(options) = 'array' AND (SELECT jsonb_array_length(options)) = 0 THEN 'ARRAY VIDE'
    WHEN jsonb_typeof(options) = 'object' AND NOT (options ? 'fr') THEN 'OBJECT SANS CLÉ FR'
    WHEN jsonb_typeof(options) = 'object' AND jsonb_typeof(options->'fr') != 'array' THEN 'FR N''EST PAS UN ARRAY'
    WHEN jsonb_typeof(options) = 'object' AND jsonb_typeof(options->'fr') = 'array' AND (SELECT jsonb_array_length(options->'fr')) = 0 THEN 'ARRAY FR VIDE'
    ELSE 'OK'
  END as probleme
FROM fc_questions
WHERE options IS NULL 
   OR jsonb_typeof(options) IS NULL
   OR (jsonb_typeof(options) = 'array' AND jsonb_array_length(options) = 0)
   OR (jsonb_typeof(options) = 'object' AND NOT (options ? 'fr'))
   OR (jsonb_typeof(options) = 'object' AND jsonb_typeof(options->'fr') != 'array')
   OR (jsonb_typeof(options) = 'object' AND jsonb_array_length(options->'fr') = 0);

-- 2. Corriger les questions avec array vide (les supprimer ou les corriger)
-- Option A : Supprimer les questions invalides
-- DELETE FROM fc_questions 
-- WHERE options IS NULL 
--    OR (jsonb_typeof(options) = 'array' AND (SELECT jsonb_array_length(options)) = 0)
--    OR (jsonb_typeof(options) = 'object' AND jsonb_typeof(options->'fr') = 'array' AND (SELECT jsonb_array_length(options->'fr')) = 0);

-- Option B : Corriger les questions avec array vide en leur donnant des options par défaut
-- (À utiliser seulement si vous voulez garder ces questions)
UPDATE fc_questions
SET options = jsonb_build_object('fr', ARRAY['Option 1', 'Option 2', 'Option 3', 'Option 4']::text[])
WHERE (jsonb_typeof(options) = 'array' AND (SELECT jsonb_array_length(options)) = 0)
   OR (jsonb_typeof(options) = 'object' AND jsonb_typeof(options->'fr') = 'array' AND (SELECT jsonb_array_length(options->'fr')) = 0);

-- 3. Corriger les questions avec object JSONB mais sans clé 'fr'
-- Utiliser une fonction pour extraire la première clé
DO $$
DECLARE
  q RECORD;
  first_key TEXT;
  first_value JSONB;
BEGIN
  FOR q IN 
    SELECT id, options
    FROM fc_questions
    WHERE jsonb_typeof(options) = 'object' 
      AND NOT (options ? 'fr')
  LOOP
    -- Extraire la première clé de l'objet JSONB
    SELECT key INTO first_key
    FROM jsonb_object_keys(q.options) AS key
    LIMIT 1;
    
    IF first_key IS NOT NULL THEN
      first_value := q.options->first_key;
      -- Vérifier que c'est un array
      IF jsonb_typeof(first_value) = 'array' THEN
        UPDATE fc_questions
        SET options = jsonb_build_object('fr', first_value)
        WHERE id = q.id;
      END IF;
    END IF;
  END LOOP;
END $$;

-- 4. Vérifier après correction
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN options IS NULL THEN 1 END) as null_count,
  COUNT(CASE WHEN jsonb_typeof(options) = 'array' AND (SELECT jsonb_array_length(options)) = 0 THEN 1 END) as empty_array_count,
  COUNT(CASE WHEN jsonb_typeof(options) = 'object' AND options ? 'fr' AND jsonb_typeof(options->'fr') = 'array' AND (SELECT jsonb_array_length(options->'fr')) > 0 THEN 1 END) as valid_count
FROM fc_questions;
