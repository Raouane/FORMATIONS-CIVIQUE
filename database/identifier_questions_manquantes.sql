-- Script pour identifier exactement quelles questions manquent
-- et créer un rapport détaillé

-- ============================================
-- 1. RÉSUMÉ PAR NIVEAU ET TYPE
-- ============================================
SELECT 
  complexity_level as niveau,
  type,
  COUNT(*) as total_existant,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as non_premium,
  COUNT(CASE WHEN is_premium = true THEN 1 END) as premium,
  CASE 
    WHEN type = 'CONNAISSANCE' THEN 28
    WHEN type = 'SITUATION' THEN 12
  END as requis,
  CASE 
    WHEN type = 'CONNAISSANCE' THEN GREATEST(0, 28 - COUNT(CASE WHEN is_premium = false THEN 1 END))
    WHEN type = 'SITUATION' THEN GREATEST(0, 12 - COUNT(CASE WHEN is_premium = false THEN 1 END))
  END as manquantes
FROM fc_questions
GROUP BY complexity_level, type
ORDER BY complexity_level, type;

-- ============================================
-- 2. DÉTAIL PAR THÈME ET NIVEAU
-- ============================================
SELECT 
  complexity_level as niveau,
  theme,
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as non_premium
FROM fc_questions
GROUP BY complexity_level, theme, type
ORDER BY complexity_level, theme, type;

-- ============================================
-- 3. QUESTIONS PAR NIVEAU - BESOIN VS DISPONIBLE
-- ============================================
SELECT 
  complexity_level as niveau,
  -- CONNAISSANCE
  COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) as connaissance_disponible,
  28 as connaissance_requis,
  GREATEST(0, 28 - COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END)) as connaissance_manquantes,
  -- SITUATION
  COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) as situation_disponible,
  12 as situation_requis,
  GREATEST(0, 12 - COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END)) as situation_manquantes,
  -- TOTAL
  COUNT(CASE WHEN is_premium = false THEN 1 END) as total_disponible,
  40 as total_requis,
  GREATEST(0, 40 - COUNT(CASE WHEN is_premium = false THEN 1 END)) as total_manquantes
FROM fc_questions
GROUP BY complexity_level
ORDER BY complexity_level;
