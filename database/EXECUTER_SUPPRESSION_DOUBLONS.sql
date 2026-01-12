-- Script final pour supprimer les 84 questions en trop
-- ⚠️ ATTENTION : Vérifiez d'abord que total_a_supprimer = 84

-- SUPPRIMER LES QUESTIONS EN TROP
-- On garde les 28 CONNAISSANCE + 12 SITUATION non-premium les plus récentes par niveau
WITH questions_ranked AS (
  SELECT 
    id,
    complexity_level,
    type,
    is_premium,
    ROW_NUMBER() OVER (
      PARTITION BY complexity_level, type 
      ORDER BY created_at DESC, id
    ) as rn
  FROM fc_questions
  WHERE is_premium = false
),
connaissance_a_garder AS (
  SELECT id
  FROM questions_ranked
  WHERE type = 'CONNAISSANCE' AND rn <= 28
),
situation_a_garder AS (
  SELECT id
  FROM questions_ranked
  WHERE type = 'SITUATION' AND rn <= 12
),
questions_a_garder AS (
  SELECT id FROM connaissance_a_garder
  UNION ALL
  SELECT id FROM situation_a_garder
)
DELETE FROM fc_questions
WHERE id NOT IN (SELECT id FROM questions_a_garder);

-- Vérification après suppression
SELECT 
  complexity_level as niveau,
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as non_premium
FROM fc_questions
GROUP BY complexity_level, type
ORDER BY complexity_level, type;

-- Vérification par niveau
SELECT 
  complexity_level as niveau,
  COUNT(*) as total,
  COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) as connaissance_non_premium,
  COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) as situation_non_premium
FROM fc_questions
GROUP BY complexity_level
ORDER BY complexity_level;

-- Total final
SELECT 
  COUNT(*) as total_questions,
  COUNT(DISTINCT complexity_level) as niveaux,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as non_premium,
  COUNT(CASE WHEN is_premium = true THEN 1 END) as premium
FROM fc_questions;
