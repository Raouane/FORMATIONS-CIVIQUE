-- Migration sécurisée pour localisation avec JSONB
-- Version qui nettoie les données avant d'ajouter les contraintes
-- Exécuter ce script dans l'éditeur SQL de Supabase Dashboard

-- ============================================
-- ÉTAPE 1 : DIAGNOSTIC
-- ============================================
-- Vérifier l'état actuel des données
DO $$
DECLARE
  total_count INTEGER;
  array_count INTEGER;
  object_count INTEGER;
  null_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM fc_questions;
  SELECT COUNT(*) INTO array_count FROM fc_questions WHERE jsonb_typeof(options) = 'array';
  SELECT COUNT(*) INTO object_count FROM fc_questions WHERE jsonb_typeof(options) = 'object';
  SELECT COUNT(*) INTO null_count FROM fc_questions WHERE options IS NULL;
  
  RAISE NOTICE 'Total questions: %', total_count;
  RAISE NOTICE 'Format array: %', array_count;
  RAISE NOTICE 'Format object: %', object_count;
  RAISE NOTICE 'Options NULL: %', null_count;
END $$;

-- ============================================
-- ÉTAPE 2 : NETTOYER LES DONNÉES INVALIDES
-- ============================================

-- Supprimer les questions avec options NULL ou vides
-- Note: jsonb_object_keys() ne peut pas être utilisé directement dans WHERE
-- On supprime d'abord les cas simples, puis on traite les objets vides séparément
DELETE FROM fc_questions 
WHERE options IS NULL 
   OR jsonb_typeof(options) IS NULL
   OR (jsonb_typeof(options) = 'array' AND (SELECT jsonb_array_length(options)) = 0);

-- Supprimer les objets JSONB vides (sans clés)
DO $$
DECLARE
  q RECORD;
  has_keys BOOLEAN;
BEGIN
  FOR q IN 
    SELECT id, options
    FROM fc_questions
    WHERE jsonb_typeof(options) = 'object'
  LOOP
    -- Vérifier si l'objet a au moins une clé
    SELECT EXISTS(SELECT 1 FROM jsonb_object_keys(q.options) LIMIT 1) INTO has_keys;
    
    IF NOT has_keys THEN
      DELETE FROM fc_questions WHERE id = q.id;
    END IF;
  END LOOP;
END $$;

-- ============================================
-- ÉTAPE 3 : SUPPRIMER LES CONTRAINTES EXISTANTES (si elles existent)
-- ============================================

ALTER TABLE fc_questions 
DROP CONSTRAINT IF EXISTS content_has_fr,
DROP CONSTRAINT IF EXISTS options_has_fr,
DROP CONSTRAINT IF EXISTS explanation_has_fr;

-- ============================================
-- ÉTAPE 4 : AJOUTER LA COLONNE preferred_language À fc_profiles
-- ============================================

ALTER TABLE fc_profiles 
ADD COLUMN IF NOT EXISTS preferred_language TEXT NOT NULL DEFAULT 'fr' 
CHECK (preferred_language IN ('fr', 'en', 'ar'));

-- ============================================
-- ÉTAPE 5 : CRÉER DES COLONNES TEMPORAIRES
-- ============================================

ALTER TABLE fc_questions 
ADD COLUMN IF NOT EXISTS content_jsonb JSONB,
ADD COLUMN IF NOT EXISTS scenario_context_jsonb JSONB,
ADD COLUMN IF NOT EXISTS options_jsonb JSONB,
ADD COLUMN IF NOT EXISTS explanation_jsonb JSONB;

-- ============================================
-- ÉTAPE 6 : MIGRER LES DONNÉES EXISTANTES
-- ============================================

-- Migrer content (TEXT -> JSONB avec clé 'fr')
UPDATE fc_questions 
SET content_jsonb = jsonb_build_object('fr', content)
WHERE content_jsonb IS NULL 
  AND content IS NOT NULL 
  AND content != '';

-- Migrer scenario_context (TEXT -> JSONB avec clé 'fr')
UPDATE fc_questions 
SET scenario_context_jsonb = jsonb_build_object('fr', scenario_context)
WHERE scenario_context_jsonb IS NULL 
  AND scenario_context IS NOT NULL 
  AND scenario_context != '';

-- Migrer options
-- Cas 1 : Si c'est déjà un array JSONB, l'encapsuler dans un objet avec clé 'fr'
UPDATE fc_questions 
SET options_jsonb = jsonb_build_object('fr', options)
WHERE options_jsonb IS NULL 
  AND options IS NOT NULL
  AND jsonb_typeof(options) = 'array'
  AND (SELECT jsonb_array_length(options)) > 0;

-- Cas 2 : Si c'est déjà un object JSONB, le copier tel quel
UPDATE fc_questions 
SET options_jsonb = options
WHERE options_jsonb IS NULL 
  AND options IS NOT NULL
  AND jsonb_typeof(options) = 'object'
  AND options ? 'fr'
  AND jsonb_typeof(options->'fr') = 'array'
  AND (SELECT jsonb_array_length(options->'fr')) > 0;

-- Cas 3 : Si l'objet JSONB n'a pas de clé 'fr', créer une clé 'fr' avec le premier array trouvé
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
    WHERE options_jsonb IS NULL 
      AND options IS NOT NULL
      AND jsonb_typeof(options) = 'object'
      AND NOT (options ? 'fr')
  LOOP
    -- Extraire la première clé de l'objet JSONB
    SELECT key INTO first_key
    FROM jsonb_object_keys(q.options) AS key
    LIMIT 1;
    
    IF first_key IS NOT NULL THEN
      first_value := q.options->first_key;
      -- Vérifier que c'est un array non vide
      IF jsonb_typeof(first_value) = 'array' THEN
        IF (SELECT jsonb_array_length(first_value)) > 0 THEN
          UPDATE fc_questions
          SET options_jsonb = jsonb_build_object('fr', first_value)
          WHERE id = q.id;
        END IF;
      END IF;
    END IF;
  END LOOP;
END $$;

-- Migrer explanation (TEXT -> JSONB avec clé 'fr')
UPDATE fc_questions 
SET explanation_jsonb = jsonb_build_object('fr', explanation)
WHERE explanation_jsonb IS NULL 
  AND explanation IS NOT NULL 
  AND explanation != '';

-- ============================================
-- ÉTAPE 7 : VÉRIFIER QUE TOUTES LES DONNÉES SONT MIGRÉES
-- ============================================

DO $$
DECLARE
  unmigrated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO unmigrated_count
  FROM fc_questions
  WHERE content_jsonb IS NULL 
     OR options_jsonb IS NULL 
     OR explanation_jsonb IS NULL;
  
  IF unmigrated_count > 0 THEN
    RAISE WARNING 'Il reste % questions non migrées. Vérifiez les données.', unmigrated_count;
  ELSE
    RAISE NOTICE 'Toutes les questions ont été migrées avec succès.';
  END IF;
END $$;

-- ============================================
-- ÉTAPE 8 : REMPLACER LES ANCIENNES COLONNES
-- ============================================

-- Supprimer les anciennes colonnes
ALTER TABLE fc_questions 
DROP COLUMN IF EXISTS content,
DROP COLUMN IF EXISTS scenario_context,
DROP COLUMN IF EXISTS options,
DROP COLUMN IF EXISTS explanation;

-- Renommer les colonnes JSONB
ALTER TABLE fc_questions 
RENAME COLUMN content_jsonb TO content;

ALTER TABLE fc_questions 
RENAME COLUMN scenario_context_jsonb TO scenario_context;

ALTER TABLE fc_questions 
RENAME COLUMN options_jsonb TO options;

ALTER TABLE fc_questions 
RENAME COLUMN explanation_jsonb TO explanation;

-- ============================================
-- ÉTAPE 9 : AJOUTER LES CONTRAINTES (SEULEMENT APRÈS MIGRATION)
-- ============================================

-- Vérifier que content contient au moins la clé 'fr'
ALTER TABLE fc_questions 
ADD CONSTRAINT content_has_fr 
CHECK (content IS NOT NULL 
   AND content ? 'fr' 
   AND jsonb_typeof(content->'fr') = 'string'
   AND (content->>'fr') != '');

-- Vérifier que options contient au moins la clé 'fr' et est un array non vide
ALTER TABLE fc_questions 
ADD CONSTRAINT options_has_fr 
CHECK (options IS NOT NULL 
   AND options ? 'fr' 
   AND jsonb_typeof(options->'fr') = 'array'
   AND check_array_length_gt_zero(options->'fr'));

-- Vérifier que explanation contient au moins la clé 'fr'
ALTER TABLE fc_questions 
ADD CONSTRAINT explanation_has_fr 
CHECK (explanation IS NOT NULL 
   AND explanation ? 'fr' 
   AND jsonb_typeof(explanation->'fr') = 'string'
   AND (explanation->>'fr') != '');

-- ============================================
-- ÉTAPE 10 : CRÉER DES INDEX GIN POUR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_questions_content_gin ON fc_questions USING GIN (content);
CREATE INDEX IF NOT EXISTS idx_questions_options_gin ON fc_questions USING GIN (options);
CREATE INDEX IF NOT EXISTS idx_questions_explanation_gin ON fc_questions USING GIN (explanation);
CREATE INDEX IF NOT EXISTS idx_questions_scenario_context_gin ON fc_questions USING GIN (scenario_context);

-- ============================================
-- ÉTAPE 12 : CRÉER LES FONCTIONS HELPER
-- ============================================

-- Fonction pour extraire le texte dans une langue donnée avec fallback
CREATE OR REPLACE FUNCTION get_localized_text(
  jsonb_field JSONB,
  locale TEXT DEFAULT 'fr'
)
RETURNS TEXT AS $$
BEGIN
  -- Essayer d'abord la locale demandée
  IF jsonb_field ? locale THEN
    RETURN jsonb_field->>locale;
  END IF;
  
  -- Fallback sur 'fr' si disponible
  IF jsonb_field ? 'fr' THEN
    RETURN jsonb_field->>'fr';
  END IF;
  
  -- Si aucune traduction disponible, retourner la première valeur trouvée
  RETURN jsonb_field->>jsonb_object_keys(jsonb_field);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction pour extraire un array dans une langue donnée avec fallback
CREATE OR REPLACE FUNCTION get_localized_array(
  jsonb_field JSONB,
  locale TEXT DEFAULT 'fr'
)
RETURNS JSONB AS $$
BEGIN
  -- Essayer d'abord la locale demandée
  IF jsonb_field ? locale AND jsonb_typeof(jsonb_field->locale) = 'array' THEN
    RETURN jsonb_field->locale;
  END IF;
  
  -- Fallback sur 'fr' si disponible
  IF jsonb_field ? 'fr' AND jsonb_typeof(jsonb_field->'fr') = 'array' THEN
    RETURN jsonb_field->'fr';
  END IF;
  
  -- Si aucune traduction disponible, retourner le premier array trouvé
  RETURN jsonb_field->jsonb_object_keys(jsonb_field);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- ÉTAPE 13 : VÉRIFICATION FINALE
-- ============================================

-- Vérifier que toutes les questions ont le bon format
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN jsonb_typeof(content) = 'object' AND content ? 'fr' THEN 1 END) as content_ok,
  COUNT(CASE WHEN jsonb_typeof(options) = 'object' AND options ? 'fr' THEN 1 END) as options_ok,
  COUNT(CASE WHEN jsonb_typeof(explanation) = 'object' AND explanation ? 'fr' THEN 1 END) as explanation_ok
FROM fc_questions;

RAISE NOTICE 'Migration terminée avec succès !';
