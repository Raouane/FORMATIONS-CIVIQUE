-- Script de diagnostic pour vérifier le nombre de questions disponibles
-- Ce script permet d'identifier pourquoi seulement 28 questions sont chargées au lieu de 40

-- ============================================
-- 1. COMPTAGE GLOBAL PAR TYPE
-- ============================================
SELECT 
  type,
  COUNT(*) as total_questions
FROM fc_questions
GROUP BY type
ORDER BY type;

-- ============================================
-- 2. COMPTAGE PAR NIVEAU ET TYPE
-- ============================================
SELECT 
  complexity_level as niveau,
  type,
  COUNT(*) as total_questions
FROM fc_questions
GROUP BY complexity_level, type
ORDER BY complexity_level, type;

-- ============================================
-- 3. COMPTAGE PAR NIVEAU, TYPE ET STATUT PREMIUM
-- ============================================
SELECT 
  complexity_level as niveau,
  type,
  is_premium,
  COUNT(*) as total_questions
FROM fc_questions
GROUP BY complexity_level, type, is_premium
ORDER BY complexity_level, type, is_premium;

-- ============================================
-- 4. QUESTIONS DISPONIBLES POUR UN UTILISATEUR NON-PREMIUM (PAR NIVEAU)
-- ============================================
-- C'est ce que le code va récupérer pour un utilisateur non-premium
SELECT 
  complexity_level as niveau,
  type,
  COUNT(*) as questions_disponibles
FROM fc_questions
WHERE is_premium = false
GROUP BY complexity_level, type
ORDER BY complexity_level, type;

-- ============================================
-- 5. VÉRIFICATION DÉTAILLÉE PAR NIVEAU
-- ============================================
-- Pour chaque niveau, vérifier si on a assez de questions
SELECT 
  complexity_level as niveau,
  COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) as connaissance_non_premium,
  COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = true THEN 1 END) as connaissance_premium,
  COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) as situation_non_premium,
  COUNT(CASE WHEN type = 'SITUATION' AND is_premium = true THEN 1 END) as situation_premium,
  COUNT(CASE WHEN type = 'CONNAISSANCE' THEN 1 END) as total_connaissance,
  COUNT(CASE WHEN type = 'SITUATION' THEN 1 END) as total_situation,
  COUNT(*) as total_questions
FROM fc_questions
GROUP BY complexity_level
ORDER BY complexity_level;

-- ============================================
-- 6. PROBLÈME IDENTIFIÉ : Vérifier si on a au moins 28 CONNAISSANCE et 12 SITUATION par niveau
-- ============================================
SELECT 
  complexity_level as niveau,
  CASE 
    WHEN COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) >= 28 
    THEN '✓ OK (>= 28)' 
    ELSE '✗ INSUFFISANT (< 28)' 
  END as statut_connaissance,
  COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) as connaissance_disponibles,
  CASE 
    WHEN COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) >= 12 
    THEN '✓ OK (>= 12)' 
    ELSE '✗ INSUFFISANT (< 12)' 
  END as statut_situation,
  COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) as situation_disponibles
FROM fc_questions
GROUP BY complexity_level
ORDER BY complexity_level;

-- ============================================
-- 7. LISTE DES QUESTIONS SITUATION PAR NIVEAU (pour vérifier leur existence)
-- ============================================
SELECT 
  id,
  complexity_level as niveau,
  type,
  is_premium,
  theme,
  CASE 
    WHEN jsonb_typeof(content) = 'object' THEN content->>'fr'
    ELSE content::text
  END as contenu_fr
FROM fc_questions
WHERE type = 'SITUATION'
ORDER BY complexity_level, is_premium, id
LIMIT 50;

-- ============================================
-- 8. RÉSUMÉ FINAL : Ce que le système peut charger
-- ============================================
SELECT 
  complexity_level as niveau,
  'CONNAISSANCE' as type_attendu,
  28 as requis,
  LEAST(COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END), 28) as disponible,
  CASE 
    WHEN COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) >= 28 
    THEN '✓' 
    ELSE '✗ MANQUE ' || (28 - COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END))::text || ' QUESTIONS'
  END as statut
FROM fc_questions
GROUP BY complexity_level

UNION ALL

SELECT 
  complexity_level as niveau,
  'SITUATION' as type_attendu,
  12 as requis,
  LEAST(COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END), 12) as disponible,
  CASE 
    WHEN COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) >= 12 
    THEN '✓' 
    ELSE '✗ MANQUE ' || (12 - COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END))::text || ' QUESTIONS'
  END as statut
FROM fc_questions
GROUP BY complexity_level

ORDER BY niveau, type_attendu;
