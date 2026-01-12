-- Vérification finale après nettoyage des doublons

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

-- 2. Répartition par niveau uniquement
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

-- 3. Vérification que chaque niveau peut charger 40 questions
SELECT 
  complexity_level as niveau,
  COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) as connaissance_non_premium,
  COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) as situation_non_premium,
  CASE 
    WHEN COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) >= 28 
     AND COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) >= 12 
    THEN '✅ OUI' 
    ELSE '❌ NON' 
  END as peut_charger_40_questions
FROM fc_questions
GROUP BY complexity_level
ORDER BY complexity_level;

-- 4. Statistiques globales
SELECT 
  COUNT(*) as total_questions,
  COUNT(DISTINCT complexity_level) as niveaux,
  COUNT(DISTINCT type) as types,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as non_premium,
  COUNT(CASE WHEN is_premium = true THEN 1 END) as premium
FROM fc_questions;
