-- Migration pour localisation avec JSONB
-- Transforme les colonnes textuelles en JSONB pour supporter plusieurs langues
-- Exécuter ce script dans l'éditeur SQL de Supabase Dashboard

-- 1. Ajouter la colonne preferred_language à fc_profiles
ALTER TABLE fc_profiles 
ADD COLUMN IF NOT EXISTS preferred_language TEXT NOT NULL DEFAULT 'fr' 
CHECK (preferred_language IN ('fr', 'en', 'ar'));

-- 2. Créer des colonnes temporaires pour la migration
ALTER TABLE fc_questions 
ADD COLUMN IF NOT EXISTS content_jsonb JSONB,
ADD COLUMN IF NOT EXISTS scenario_context_jsonb JSONB,
ADD COLUMN IF NOT EXISTS options_jsonb JSONB,
ADD COLUMN IF NOT EXISTS explanation_jsonb JSONB;

-- 3. Migrer les données existantes vers JSONB
-- Convertir content TEXT -> JSONB avec clé 'fr'
UPDATE fc_questions 
SET content_jsonb = jsonb_build_object('fr', content)
WHERE content_jsonb IS NULL AND content IS NOT NULL;

-- Convertir scenario_context TEXT -> JSONB avec clé 'fr' (si non null)
UPDATE fc_questions 
SET scenario_context_jsonb = jsonb_build_object('fr', scenario_context)
WHERE scenario_context_jsonb IS NULL AND scenario_context IS NOT NULL;

-- Convertir options JSONB array -> JSONB object avec clé 'fr'
-- Les options existantes sont déjà en JSONB array, on les encapsule
UPDATE fc_questions 
SET options_jsonb = jsonb_build_object('fr', options)
WHERE options_jsonb IS NULL AND options IS NOT NULL;

-- Convertir explanation TEXT -> JSONB avec clé 'fr'
UPDATE fc_questions 
SET explanation_jsonb = jsonb_build_object('fr', explanation)
WHERE explanation_jsonb IS NULL AND explanation IS NOT NULL;

-- 4. Remplacer les anciennes colonnes par les nouvelles
ALTER TABLE fc_questions 
DROP COLUMN IF EXISTS content,
DROP COLUMN IF EXISTS scenario_context,
DROP COLUMN IF EXISTS options,
DROP COLUMN IF EXISTS explanation;

-- 5. Renommer les colonnes JSONB
ALTER TABLE fc_questions 
RENAME COLUMN content_jsonb TO content;
ALTER TABLE fc_questions 
RENAME COLUMN scenario_context_jsonb TO scenario_context;
ALTER TABLE fc_questions 
RENAME COLUMN options_jsonb TO options;
ALTER TABLE fc_questions 
RENAME COLUMN explanation_jsonb TO explanation;

-- 6. Ajouter des contraintes pour garantir la structure JSONB
-- Vérifier que content contient au moins la clé 'fr'
ALTER TABLE fc_questions 
ADD CONSTRAINT content_has_fr 
CHECK (content ? 'fr' AND jsonb_typeof(content->'fr') = 'string');

-- Vérifier que options contient au moins la clé 'fr' et est un array
ALTER TABLE fc_questions 
ADD CONSTRAINT options_has_fr 
CHECK (options ? 'fr' AND jsonb_typeof(options->'fr') = 'array');

-- Vérifier que explanation contient au moins la clé 'fr'
ALTER TABLE fc_questions 
ADD CONSTRAINT explanation_has_fr 
CHECK (explanation ? 'fr' AND jsonb_typeof(explanation->'fr') = 'string');

-- 7. Créer des index GIN pour les recherches JSONB (performance)
CREATE INDEX IF NOT EXISTS idx_questions_content_gin ON fc_questions USING GIN (content);
CREATE INDEX IF NOT EXISTS idx_questions_options_gin ON fc_questions USING GIN (options);
CREATE INDEX IF NOT EXISTS idx_questions_explanation_gin ON fc_questions USING GIN (explanation);

-- 8. Fonction helper pour extraire le texte dans une langue donnée avec fallback
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

-- 9. Fonction helper pour extraire un array dans une langue donnée avec fallback
CREATE OR REPLACE FUNCTION get_localized_array(
  jsonb_field JSONB,
  locale TEXT DEFAULT 'fr'
)
RETURNS JSONB AS $$
BEGIN
  -- Essayer d'abord la locale demandée
  IF jsonb_field ? locale THEN
    RETURN jsonb_field->locale;
  END IF;
  
  -- Fallback sur 'fr' si disponible
  IF jsonb_field ? 'fr' THEN
    RETURN jsonb_field->'fr';
  END IF;
  
  -- Si aucune traduction disponible, retourner le premier array trouvé
  RETURN jsonb_field->jsonb_object_keys(jsonb_field);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 10. Commentaires pour documentation
COMMENT ON COLUMN fc_questions.content IS 'JSONB object avec clés de langue (fr, en, ar, etc.) et valeurs string';
COMMENT ON COLUMN fc_questions.scenario_context IS 'JSONB object avec clés de langue (fr, en, ar, etc.) et valeurs string, nullable';
COMMENT ON COLUMN fc_questions.options IS 'JSONB object avec clés de langue (fr, en, ar, etc.) et valeurs array de strings';
COMMENT ON COLUMN fc_questions.explanation IS 'JSONB object avec clés de langue (fr, en, ar, etc.) et valeurs string';
COMMENT ON COLUMN fc_profiles.preferred_language IS 'Langue préférée de l''utilisateur (fr, en, ar)';
