-- Migration : Table fc_translations pour stocker les traductions de l'interface
-- Cette table centralise toutes les traductions (FR, EN, AR) dans la base de données
-- Cohérent avec le système JSONB utilisé pour les questions

-- 1. Table fc_translations
CREATE TABLE IF NOT EXISTS fc_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  namespace TEXT NOT NULL, -- 'common', 'home', 'exam', 'revision', 'results', 'auth'
  key TEXT NOT NULL, -- Clé de traduction (ex: 'title', 'nav.home', 'themes.valeurs.name')
  translations JSONB NOT NULL, -- { "fr": "...", "en": "...", "ar": "..." }
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(namespace, key)
);

-- 2. Index pour performances
CREATE INDEX IF NOT EXISTS idx_translations_namespace ON fc_translations(namespace);
CREATE INDEX IF NOT EXISTS idx_translations_key ON fc_translations(key);
CREATE INDEX IF NOT EXISTS idx_translations_namespace_key ON fc_translations(namespace, key);
-- Index GIN pour recherches dans le JSONB
CREATE INDEX IF NOT EXISTS idx_translations_jsonb ON fc_translations USING GIN (translations);

-- 3. Trigger pour updated_at
CREATE TRIGGER update_fc_translations_updated_at 
  BEFORE UPDATE ON fc_translations
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Fonction helper pour récupérer une traduction
CREATE OR REPLACE FUNCTION get_translation(
  p_namespace TEXT,
  p_key TEXT,
  p_locale TEXT DEFAULT 'fr'
)
RETURNS TEXT AS $$
DECLARE
  v_translation TEXT;
BEGIN
  SELECT translations->>p_locale
  INTO v_translation
  FROM fc_translations
  WHERE namespace = p_namespace AND key = p_key;
  
  -- Fallback sur 'fr' si la traduction n'existe pas
  IF v_translation IS NULL AND p_locale != 'fr' THEN
    SELECT translations->>'fr'
    INTO v_translation
    FROM fc_translations
    WHERE namespace = p_namespace AND key = p_key;
  END IF;
  
  RETURN COALESCE(v_translation, p_key); -- Retourne la clé si aucune traduction trouvée
END;
$$ LANGUAGE plpgsql STABLE;

-- 5. Fonction pour récupérer toutes les traductions d'un namespace
CREATE OR REPLACE FUNCTION get_translations_by_namespace(
  p_namespace TEXT,
  p_locale TEXT DEFAULT 'fr'
)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB := '{}'::jsonb;
  v_record RECORD;
BEGIN
  FOR v_record IN
    SELECT key, translations->>p_locale as translation, translations->>'fr' as fallback
    FROM fc_translations
    WHERE namespace = p_namespace
  LOOP
    -- Utilise la traduction demandée ou fallback sur 'fr'
    v_result := v_result || jsonb_build_object(
      v_record.key,
      COALESCE(v_record.translation, v_record.fallback, v_record.key)
    );
  END LOOP;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE;

-- 6. RLS (Row Level Security) - Les traductions sont publiques
ALTER TABLE fc_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Translations are public"
  ON fc_translations FOR SELECT
  TO authenticated, anon
  USING (true);

-- 7. Commentaires
COMMENT ON TABLE fc_translations IS 'Traductions de l''interface (boutons, labels, messages) en FR, EN, AR';
COMMENT ON COLUMN fc_translations.namespace IS 'Namespace i18n (common, home, exam, revision, results, auth)';
COMMENT ON COLUMN fc_translations.key IS 'Clé de traduction (ex: title, nav.home, themes.valeurs.name)';
COMMENT ON COLUMN fc_translations.translations IS 'Objet JSONB avec les traductions {fr, en, ar}';
