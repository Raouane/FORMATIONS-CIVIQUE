-- Script pour rendre toutes les questions SITUATION non-premium
-- Les questions SITUATION doivent être disponibles pour tous les utilisateurs
-- car elles font partie des 40 questions obligatoires de l'examen

-- ============================================
-- 1. VÉRIFICATION : Combien de questions SITUATION sont premium ?
-- ============================================
SELECT 
  complexity_level as niveau,
  COUNT(*) as total_situation_premium
FROM fc_questions
WHERE type = 'SITUATION'
  AND is_premium = true
GROUP BY complexity_level
ORDER BY complexity_level;

-- ============================================
-- 2. CORRECTION : Rendre toutes les questions SITUATION non-premium
-- ============================================
-- Cette commande rend toutes les questions SITUATION disponibles pour tous
UPDATE fc_questions
SET is_premium = false
WHERE type = 'SITUATION'
  AND is_premium = true;

-- ============================================
-- 3. VÉRIFICATION APRÈS CORRECTION
-- ============================================
SELECT 
  complexity_level as niveau,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as situation_non_premium,
  COUNT(CASE WHEN is_premium = true THEN 1 END) as situation_premium,
  COUNT(*) as total_situation
FROM fc_questions
WHERE type = 'SITUATION'
GROUP BY complexity_level
ORDER BY complexity_level;

-- ============================================
-- 4. VÉRIFICATION FINALE : Peut-on charger 40 questions maintenant ?
-- ============================================
SELECT 
  complexity_level as niveau,
  COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) as connaissance_disponibles,
  COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) as situation_disponibles,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as total_disponible,
  CASE 
    WHEN COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) >= 28 
     AND COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) >= 12
    THEN '✓ OUI (40 questions possibles)'
    ELSE '✗ NON - Manque encore des questions'
  END as peut_charger_40_questions
FROM fc_questions
GROUP BY complexity_level
ORDER BY complexity_level;
