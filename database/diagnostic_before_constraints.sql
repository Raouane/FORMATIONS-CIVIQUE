-- Script de diagnostic AVANT d'ajouter les contraintes
-- Exécuter ce script pour identifier les questions problématiques

-- 1. Identifier les questions avec options invalides
SELECT 
  id,
  jsonb_typeof(options) as options_type,
  options,
  CASE 
    WHEN options IS NULL THEN 'NULL'
    WHEN jsonb_typeof(options) IS NULL THEN 'TYPE NULL'
    WHEN jsonb_typeof(options) = 'array' AND (SELECT jsonb_array_length(options)) = 0 THEN 'ARRAY VIDE'
    WHEN jsonb_typeof(options) = 'object' AND NOT (options ? 'fr') THEN 'OBJECT SANS CLÉ FR'
    WHEN jsonb_typeof(options) = 'object' AND (options ? 'fr') AND jsonb_typeof(options->'fr') != 'array' THEN 'FR N''EST PAS UN ARRAY'
    WHEN jsonb_typeof(options) = 'object' AND (options ? 'fr') AND jsonb_typeof(options->'fr') = 'array' AND (SELECT jsonb_array_length(options->'fr')) = 0 THEN 'ARRAY FR VIDE'
    ELSE 'OK'
  END as probleme
FROM fc_questions
WHERE options IS NULL 
   OR jsonb_typeof(options) IS NULL
   OR (jsonb_typeof(options) = 'array' AND (SELECT jsonb_array_length(options)) = 0)
   OR (jsonb_typeof(options) = 'object' AND NOT (options ? 'fr'))
   OR (jsonb_typeof(options) = 'object' AND (options ? 'fr') AND jsonb_typeof(options->'fr') != 'array')
   OR (jsonb_typeof(options) = 'object' AND (options ? 'fr') AND jsonb_typeof(options->'fr') = 'array' AND (SELECT jsonb_array_length(options->'fr')) = 0);

-- 2. Compter les problèmes par type
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN options IS NULL THEN 1 END) as null_count,
  COUNT(CASE WHEN jsonb_typeof(options) = 'array' AND (SELECT jsonb_array_length(options)) = 0 THEN 1 END) as empty_array_count,
  COUNT(CASE WHEN jsonb_typeof(options) = 'object' AND NOT (options ? 'fr') THEN 1 END) as no_fr_key_count,
  COUNT(CASE WHEN jsonb_typeof(options) = 'object' AND (options ? 'fr') AND jsonb_typeof(options->'fr') != 'array' THEN 1 END) as fr_not_array_count,
  COUNT(CASE WHEN jsonb_typeof(options) = 'object' AND (options ? 'fr') AND jsonb_typeof(options->'fr') = 'array' AND (SELECT jsonb_array_length(options->'fr')) = 0 THEN 1 END) as empty_fr_array_count,
  COUNT(CASE WHEN jsonb_typeof(options) = 'object' AND options ? 'fr' AND jsonb_typeof(options->'fr') = 'array' AND (SELECT jsonb_array_length(options->'fr')) > 0 THEN 1 END) as valid_count
FROM fc_questions;
