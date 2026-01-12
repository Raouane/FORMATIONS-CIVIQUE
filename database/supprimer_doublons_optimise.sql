-- Script optimisé pour supprimer les doublons en une seule transaction
-- ⚠️ ATTENTION : À exécuter avec précaution, sauvegarder d'abord !

BEGIN;

-- ÉTAPE 1 : Vérifier l'état actuel
SELECT 
  complexity_level as niveau,
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as non_premium
FROM fc_questions
GROUP BY complexity_level, type
ORDER BY complexity_level, type;

-- ÉTAPE 2 : Identifier et supprimer les questions en trop
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
-- Afficher ce qui sera supprimé AVANT de supprimer
SELECT 
  COUNT(*) as total_a_supprimer,
  COUNT(CASE WHEN type = 'CONNAISSANCE' THEN 1 END) as connaissance_a_supprimer,
  COUNT(CASE WHEN type = 'SITUATION' THEN 1 END) as situation_a_supprimer
FROM fc_questions
WHERE id NOT IN (SELECT id FROM questions_a_garder);

-- ÉTAPE 3 : ⚠️ SUPPRIMER LES QUESTIONS EN TROP
-- DÉCOMMENTEZ UNIQUEMENT APRÈS AVOIR VÉRIFIÉ L'ÉTAPE 2
/*
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
*/

-- ÉTAPE 4 : Vérification finale
/*
SELECT 
  complexity_level as niveau,
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as non_premium
FROM fc_questions
GROUP BY complexity_level, type
ORDER BY complexity_level, type;

SELECT 
  complexity_level as niveau,
  COUNT(*) as total,
  COUNT(CASE WHEN type = 'CONNAISSANCE' AND is_premium = false THEN 1 END) as connaissance_non_premium,
  COUNT(CASE WHEN type = 'SITUATION' AND is_premium = false THEN 1 END) as situation_non_premium
FROM fc_questions
GROUP BY complexity_level
ORDER BY complexity_level;
*/

-- Si tout est OK, décommentez cette ligne pour valider la transaction
-- COMMIT;

-- Si problème, décommentez cette ligne pour annuler
-- ROLLBACK;
