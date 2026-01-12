-- Script de vérification rapide pour l'examen
-- Vérifie si on peut charger 40 questions (28 CONNAISSANCE + 12 SITUATION) par niveau

-- ============================================
-- VÉRIFICATION RAPIDE PAR NIVEAU
-- ============================================
-- Pour chaque niveau, vérifie si on peut charger 40 questions
SELECT 
  complexity_level as niveau,
  -- Questions CONNAISSANCE disponibles (non-premium)
  COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) as connaissance_disponibles,
  -- Questions SITUATION disponibles (non-premium)
  COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) as situation_disponibles,
  -- Total disponible
  COUNT(CASE WHEN is_premium = false THEN 1 END) as total_disponible,
  -- Peut-on charger 40 questions ?
  CASE 
    WHEN COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) >= 28 
     AND COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) >= 12
    THEN '✓ OUI (40 questions possibles)'
    ELSE '✗ NON - Manque des questions'
  END as peut_charger_40_questions,
  -- Détail du problème
  CASE 
    WHEN COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) < 28 
    THEN 'Manque ' || (28 - COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END))::text || ' questions CONNAISSANCE'
    ELSE ''
  END ||
  CASE 
    WHEN COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) < 12 
    THEN CASE 
      WHEN COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) < 28 
      THEN ' et ' || (12 - COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END))::text || ' questions SITUATION'
      ELSE 'Manque ' || (12 - COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END))::text || ' questions SITUATION'
    END
    ELSE ''
  END as probleme_detecte
FROM fc_questions
GROUP BY complexity_level
ORDER BY complexity_level;

-- ============================================
-- COMPTAGE PAR THÈME ET TYPE (pour comprendre la répartition)
-- ============================================
SELECT 
  theme,
  type,
  complexity_level as niveau,
  COUNT(*) as total,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as non_premium,
  COUNT(CASE WHEN is_premium = true THEN 1 END) as premium
FROM fc_questions
GROUP BY theme, type, complexity_level
ORDER BY theme, type, complexity_level;

-- ============================================
-- QUESTIONS SITUATION MANQUANTES PAR NIVEAU
-- ============================================
-- Si moins de 12 questions SITUATION par niveau, affiche combien il en manque
SELECT 
  complexity_level as niveau,
  COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) as situation_disponibles,
  12 as requis,
  GREATEST(0, 12 - COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END)) as manquantes
FROM fc_questions
GROUP BY complexity_level
HAVING COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) < 12
ORDER BY complexity_level;
