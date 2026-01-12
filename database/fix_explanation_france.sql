-- Script pour corriger la traduction de l'explication
-- Remplace "en Fr" par "en France" dans l'explication de la question sur l'instruction obligatoire

UPDATE fc_questions
SET explanation = jsonb_set(
  explanation,
  '{fr}',
  '"L''instruction est obligatoire pour tous les enfants résidant en France, qu''ils soient français ou étrangers, de l''âge de 3 ans jusqu''à 16 ans révolus."'::jsonb
)
WHERE explanation->>'fr' LIKE '%résidant en Fr%'
  AND explanation->>'fr' NOT LIKE '%résidant en France%';

-- Vérification
SELECT 
  id,
  content->>'fr' as question,
  explanation->>'fr' as explanation
FROM fc_questions
WHERE explanation->>'fr' LIKE '%instruction est obligatoire%'
  AND explanation->>'fr' LIKE '%résidant%';
