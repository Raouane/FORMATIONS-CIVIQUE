-- Script pour optimiser les performances des requêtes de questions
-- À exécuter dans Supabase SQL Editor

-- 1. Index composite pour les requêtes principales (type + level + premium)
CREATE INDEX IF NOT EXISTS idx_questions_type_level_premium 
ON fc_questions(type, complexity_level, is_premium);

-- 2. Index pour les requêtes par niveau et type
CREATE INDEX IF NOT EXISTS idx_questions_level_type 
ON fc_questions(complexity_level, type);

-- 3. Index pour les requêtes par niveau uniquement
CREATE INDEX IF NOT EXISTS idx_questions_level 
ON fc_questions(complexity_level);

-- 4. Index pour les requêtes par type uniquement
CREATE INDEX IF NOT EXISTS idx_questions_type 
ON fc_questions(type);

-- 5. Index pour is_premium (si utilisé seul)
CREATE INDEX IF NOT EXISTS idx_questions_premium 
ON fc_questions(is_premium) WHERE is_premium = false;

-- Vérification des index créés
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'fc_questions'
ORDER BY indexname;

-- Statistiques sur la table
SELECT 
    COUNT(*) as total_questions,
    COUNT(DISTINCT complexity_level) as niveaux,
    COUNT(DISTINCT type) as types,
    COUNT(CASE WHEN is_premium = false THEN 1 END) as non_premium,
    COUNT(CASE WHEN is_premium = true THEN 1 END) as premium
FROM fc_questions;

-- Analyse de la table pour optimiser les requêtes
ANALYZE fc_questions;
