-- Script pour nettoyer les doublons de questions
-- ⚠️ ATTENTION : À exécuter avec précaution, sauvegarder d'abord !

-- 1. Identifier les doublons (même contenu FR, même niveau, même type)
WITH doublons AS (
  SELECT 
    id,
    content->>'fr' as contenu_fr,
    complexity_level,
    type,
    ROW_NUMBER() OVER (
      PARTITION BY content->>'fr', complexity_level, type 
      ORDER BY created_at DESC
    ) as rn
  FROM fc_questions
)
SELECT 
  id,
  contenu_fr,
  complexity_level,
  type,
  rn
FROM doublons
WHERE rn > 1
ORDER BY complexity_level, type, contenu_fr;

-- 2. Supprimer les doublons (garder le plus récent)
-- ⚠️ DÉCOMMENTEZ UNIQUEMENT APRÈS VÉRIFICATION
/*
WITH doublons AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY content->>'fr', complexity_level, type 
      ORDER BY created_at DESC
    ) as rn
  FROM fc_questions
)
DELETE FROM fc_questions
WHERE id IN (
  SELECT id FROM doublons WHERE rn > 1
);
*/

-- 3. Vérification après nettoyage
SELECT 
  complexity_level as niveau,
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as non_premium
FROM fc_questions
GROUP BY complexity_level, type
ORDER BY complexity_level, type;
