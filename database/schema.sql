-- Schéma SQL Supabase pour Formations Civiques 2026
-- Tables préfixées fc_ pour isolation
-- Exécuter ce script dans l'éditeur SQL de Supabase Dashboard

-- 1. Table fc_profiles (Profils utilisateurs)
CREATE TABLE IF NOT EXISTS fc_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  objective TEXT NOT NULL DEFAULT 'A2' CHECK (objective IN ('A2', 'B1', 'B2')),
  stripe_customer_id TEXT,
  subscription_status TEXT CHECK (subscription_status IN ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING')),
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Table fc_questions (Questions d'examen)
CREATE TABLE IF NOT EXISTS fc_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme TEXT NOT NULL CHECK (theme IN ('VALEURS', 'DROITS', 'HISTOIRE', 'POLITIQUE', 'SOCIETE')),
  type TEXT NOT NULL CHECK (type IN ('CONNAISSANCE', 'SITUATION')),
  level TEXT NOT NULL CHECK (level IN ('A2', 'B1', 'B2')),
  complexity_level TEXT NOT NULL CHECK (complexity_level IN ('A2', 'B1', 'B2')),
  content TEXT NOT NULL,
  scenario_context TEXT,
  options JSONB NOT NULL, -- Array de 4 options
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  explanation TEXT NOT NULL,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table fc_user_progress (Progression utilisateur)
CREATE TABLE IF NOT EXISTS fc_user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES fc_profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES fc_questions(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  last_reviewed TIMESTAMPTZ,
  next_review TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- 4. Table fc_exam_results (Résultats d'examens)
CREATE TABLE IF NOT EXISTS fc_exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES fc_profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 40),
  percentage INTEGER NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  time_spent INTEGER NOT NULL, -- en secondes
  passed BOOLEAN NOT NULL, -- >= 80%
  level TEXT NOT NULL CHECK (level IN ('A2', 'B1', 'B2')),
  questions_answered JSONB NOT NULL, -- Array de {questionId, answerIndex, isCorrect}
  email_sent BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_questions_theme ON fc_questions(theme);
CREATE INDEX IF NOT EXISTS idx_questions_type ON fc_questions(type);
CREATE INDEX IF NOT EXISTS idx_questions_level ON fc_questions(level);
CREATE INDEX IF NOT EXISTS idx_questions_complexity ON fc_questions(complexity_level);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON fc_user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_question ON fc_user_progress(question_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_user ON fc_exam_results(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_completed ON fc_exam_results(completed_at DESC);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fc_profiles_updated_at BEFORE UPDATE ON fc_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fc_questions_updated_at BEFORE UPDATE ON fc_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fc_user_progress_updated_at BEFORE UPDATE ON fc_user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour créer automatiquement un profil après inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.fc_profiles (id, email, full_name, objective, is_premium)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'objective', 'A2'),
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Politiques RLS (Row Level Security)
-- Activer RLS sur toutes les tables
ALTER TABLE fc_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fc_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fc_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE fc_exam_results ENABLE ROW LEVEL SECURITY;

-- Politique fc_profiles : Les utilisateurs peuvent voir et modifier leur propre profil
CREATE POLICY "Users can view own profile"
  ON fc_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON fc_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Politique fc_questions : Tous les utilisateurs authentifiés peuvent voir les questions non-premium
CREATE POLICY "Authenticated users can view non-premium questions"
  ON fc_questions FOR SELECT
  TO authenticated
  USING (is_premium = false OR EXISTS (
    SELECT 1 FROM fc_profiles WHERE id = auth.uid() AND is_premium = true
  ));

-- Politique fc_user_progress : Les utilisateurs peuvent voir et modifier leur propre progression
CREATE POLICY "Users can manage own progress"
  ON fc_user_progress FOR ALL
  USING (auth.uid() = user_id);

-- Politique fc_exam_results : Les utilisateurs peuvent voir et créer leurs propres résultats
CREATE POLICY "Users can manage own exam results"
  ON fc_exam_results FOR ALL
  USING (auth.uid() = user_id);

-- Commentaires pour documentation
COMMENT ON TABLE fc_profiles IS 'Profils utilisateurs avec objectif de formation (A2/B1/B2)';
COMMENT ON TABLE fc_questions IS 'Questions d''examen conformes au programme officiel 2026';
COMMENT ON TABLE fc_user_progress IS 'Progression et historique des réponses par utilisateur';
COMMENT ON TABLE fc_exam_results IS 'Résultats des examens simulés avec score et détails';
