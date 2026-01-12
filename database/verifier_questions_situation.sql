-- Vérifier si des questions SITUATION existent mais sont marquées comme premium
-- ou si elles n'existent pas du tout

-- ============================================
-- 1. Vérifier toutes les questions SITUATION (premium et non-premium)
-- ============================================
SELECT 
  complexity_level as niveau,
  is_premium,
  COUNT(*) as total_situation
FROM fc_questions
WHERE type = 'SITUATION'
GROUP BY complexity_level, is_premium
ORDER BY complexity_level, is_premium;

-- ============================================
-- 2. Lister toutes les questions SITUATION existantes
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
ORDER BY complexity_level, is_premium, id;

-- ============================================
-- 3. Si des questions SITUATION existent mais sont premium, on peut les rendre non-premium
-- ============================================
-- DÉCOMMENTEZ ET EXÉCUTEZ CETTE COMMANDE SI DES QUESTIONS SITUATION SONT PREMIUM
-- UPDATE fc_questions
-- SET is_premium = false
-- WHERE type = 'SITUATION'
--   AND is_premium = true;
