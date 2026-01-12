-- Script pour nettoyer les questions en trop et garder exactement 40 par niveau
-- ⚠️ ATTENTION : À exécuter avec précaution, sauvegarder d'abord !

-- 1. Vérifier l'état actuel
SELECT 
  complexity_level as niveau,
  type,
  COUNT(*) as total,
  COUNT(CASE WHEN is_premium = false THEN 1 END) as non_premium
FROM fc_questions
GROUP BY complexity_level, type
ORDER BY complexity_level, type;

-- 2. Identifier les questions à garder (28 CONNAISSANCE + 12 SITUATION non-premium par niveau)
-- Pour chaque niveau, on garde :
-- - Les 28 premières questions CONNAISSANCE non-premium (par ID ou created_at)
-- - Les 12 premières questions SITUATION non-premium (par ID ou created_at)

-- 3. Créer une table temporaire avec les IDs à garder
CREATE TEMP TABLE questions_a_garder AS
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
)
SELECT id FROM connaissance_a_garder
UNION ALL
SELECT id FROM situation_a_garder;

-- 4. Vérifier combien de questions seront gardées
SELECT 
  q.complexity_level as niveau,
  q.type,
  COUNT(*) as questions_a_garder
FROM fc_questions q
INNER JOIN questions_a_garder g ON q.id = g.id
GROUP BY q.complexity_level, q.type
ORDER BY q.complexity_level, q.type;

-- 5. Vérifier combien de questions seront supprimées
SELECT 
  COUNT(*) as total_a_supprimer,
  COUNT(CASE WHEN type = 'CONNAISSANCE' THEN 1 END) as connaissance_a_supprimer,
  COUNT(CASE WHEN type = 'SITUATION' THEN 1 END) as situation_a_supprimer
FROM fc_questions
WHERE id NOT IN (SELECT id FROM questions_a_garder);

-- 6. Afficher les questions qui seront supprimées (pour vérification)
SELECT 
  q.id,
  q.complexity_level as niveau,
  q.type,
  LEFT(q.content->>'fr', 50) as contenu_fr,
  q.is_premium,
  q.created_at
FROM fc_questions q
WHERE q.id NOT IN (SELECT id FROM questions_a_garder)
ORDER BY q.complexity_level, q.type, q.created_at DESC
LIMIT 50;

-- 7. ⚠️ SUPPRIMER LES QUESTIONS EN TROP (DÉCOMMENTEZ UNIQUEMENT APRÈS VÉRIFICATION)
/*
DELETE FROM fc_questions
WHERE id NOT IN (SELECT id FROM questions_a_garder);
*/

-- 8. Vérification finale après nettoyage
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
