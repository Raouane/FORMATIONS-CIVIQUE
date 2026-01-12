-- Script pour vérifier les doublons et la répartition des questions

-- 1. Répartition par niveau et type
SELECT 
  complexity_level as niveau,
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as non_premium,
  COUNT(CASE WHEN is_premium = true THEN 1 END) as premium
FROM fc_questions
GROUP BY complexity_level, type
ORDER BY complexity_level, type;

-- 2. Vérifier les doublons par contenu (même texte français)
SELECT 
  content->>'fr' as contenu_fr,
  complexity_level,
  type,
  COUNT(*) as occurrences
FROM fc_questions
GROUP BY content->>'fr', complexity_level, type
HAVING COUNT(*) > 1
ORDER BY occurrences DESC, complexity_level, type;

-- 3. Statistiques globales
SELECT 
  COUNT(*) as total_questions,
  COUNT(DISTINCT complexity_level) as niveaux,
  COUNT(DISTINCT type) as types,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as non_premium,
  COUNT(CASE WHEN is_premium = true THEN 1 END) as premium
FROM fc_questions;

-- 4. Répartition par niveau uniquement
SELECT 
  complexity_level as niveau,
  COUNT(*) as total,
  COUNT(CASE WHEN type = 'CONNAISSANCE' THEN 1 END) as connaissance,
  COUNT(CASE WHEN type = 'SITUATION' THEN 1 END) as situation,
  COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) as connaissance_non_premium,
  COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) as situation_non_premium
FROM fc_questions
GROUP BY complexity_level
ORDER BY complexity_level;
