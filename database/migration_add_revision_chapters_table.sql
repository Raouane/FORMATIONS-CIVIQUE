-- Migration : Table fc_revision_chapters pour stocker le contenu des chapitres de révision
-- Cette table centralise le contenu multilingue (FR, EN, AR) dans la base de données
-- Cohérent avec le système JSONB utilisé pour les questions et traductions

-- 1. Table fc_revision_chapters
CREATE TABLE IF NOT EXISTS fc_revision_chapters (
  id TEXT PRIMARY KEY, -- 'devise', 'laicite', 'droits-citoyen', etc.
  theme TEXT NOT NULL CHECK (theme IN ('VALEURS', 'DROITS', 'HISTOIRE', 'POLITIQUE', 'SOCIETE')),
  level TEXT NOT NULL CHECK (level IN ('A2', 'B1', 'B2')),
  title JSONB NOT NULL, -- {"fr": "...", "en": "...", "ar": "..."}
  content JSONB NOT NULL, -- {"fr": "...", "en": "...", "ar": "..."} (Markdown)
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Index pour performances
CREATE INDEX IF NOT EXISTS idx_revision_chapters_theme ON fc_revision_chapters(theme);
CREATE INDEX IF NOT EXISTS idx_revision_chapters_level ON fc_revision_chapters(level);
CREATE INDEX IF NOT EXISTS idx_revision_chapters_theme_level ON fc_revision_chapters(theme, level);
CREATE INDEX IF NOT EXISTS idx_revision_chapters_order ON fc_revision_chapters(order_index);
-- Index GIN pour recherches dans le JSONB
CREATE INDEX IF NOT EXISTS idx_revision_chapters_title_jsonb ON fc_revision_chapters USING GIN (title);
CREATE INDEX IF NOT EXISTS idx_revision_chapters_content_jsonb ON fc_revision_chapters USING GIN (content);

-- 3. Trigger pour updated_at
CREATE TRIGGER update_fc_revision_chapters_updated_at 
  BEFORE UPDATE ON fc_revision_chapters
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Fonction helper pour récupérer un chapitre localisé
CREATE OR REPLACE FUNCTION get_revision_chapter(
  p_id TEXT,
  p_locale TEXT DEFAULT 'fr'
)
RETURNS TABLE (
  id TEXT,
  theme TEXT,
  level TEXT,
  title TEXT,
  content TEXT,
  order_index INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rc.id,
    rc.theme,
    rc.level,
    COALESCE(rc.title->>p_locale, rc.title->>'fr') as title,
    COALESCE(rc.content->>p_locale, rc.content->>'fr') as content,
    rc.order_index
  FROM fc_revision_chapters rc
  WHERE rc.id = p_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- 5. Fonction pour récupérer tous les chapitres d'un thème et niveau
CREATE OR REPLACE FUNCTION get_revision_chapters_by_theme(
  p_theme TEXT,
  p_level TEXT DEFAULT NULL,
  p_locale TEXT DEFAULT 'fr'
)
RETURNS TABLE (
  id TEXT,
  theme TEXT,
  level TEXT,
  title TEXT,
  content TEXT,
  order_index INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rc.id,
    rc.theme,
    rc.level,
    COALESCE(rc.title->>p_locale, rc.title->>'fr') as title,
    COALESCE(rc.content->>p_locale, rc.content->>'fr') as content,
    rc.order_index
  FROM fc_revision_chapters rc
  WHERE rc.theme = p_theme
    AND (p_level IS NULL OR rc.level = p_level)
  ORDER BY rc.order_index;
END;
$$ LANGUAGE plpgsql STABLE;

-- 6. RLS (Row Level Security) - Les chapitres sont publics
ALTER TABLE fc_revision_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Revision chapters are public"
  ON fc_revision_chapters FOR SELECT
  TO authenticated, anon
  USING (true);

-- 7. Commentaires
COMMENT ON TABLE fc_revision_chapters IS 'Chapitres de révision avec contenu multilingue (FR, EN, AR)';
COMMENT ON COLUMN fc_revision_chapters.id IS 'Identifiant unique du chapitre (devise, laicite, etc.)';
COMMENT ON COLUMN fc_revision_chapters.title IS 'Titre du chapitre en JSONB {fr, en, ar}';
COMMENT ON COLUMN fc_revision_chapters.content IS 'Contenu Markdown du chapitre en JSONB {fr, en, ar}';
