-- Exemple : Ajouter une traduction anglaise à une question existante
-- Remplacez 'votre-question-id' par l'ID réel de la question

-- 1. Vérifier la structure actuelle
SELECT 
  id,
  content,
  options,
  explanation,
  scenario_context
FROM fc_questions
WHERE id = 'votre-question-id';

-- 2. Ajouter la traduction anglaise
UPDATE fc_questions
SET 
  content = content || '{"en": "What is the motto of the French Republic?"}'::jsonb,
  options = options || '{"en": ["Liberty, Equality, Fraternity", "God, King, Country", "Work, Family, Fatherland", "Freedom, Justice, Peace"]}'::jsonb,
  explanation = explanation || '{"en": "The motto 'Liberty, Equality, Fraternity' is a symbol of the Republic inscribed in the Constitution."}'::jsonb,
  scenario_context = CASE 
    WHEN scenario_context IS NOT NULL THEN 
      scenario_context || '{"en": "You are in a public service office."}'::jsonb
    ELSE NULL
  END
WHERE id = 'votre-question-id';

-- 3. Vérifier la mise à jour
SELECT 
  id,
  content->>'fr' as content_fr,
  content->>'en' as content_en,
  options->'fr' as options_fr,
  options->'en' as options_en,
  explanation->>'fr' as explanation_fr,
  explanation->>'en' as explanation_en
FROM fc_questions
WHERE id = 'votre-question-id';

-- 4. Exemple : Ajouter une traduction arabe
UPDATE fc_questions
SET 
  content = content || '{"ar": "ما هو شعار الجمهورية الفرنسية؟"}'::jsonb,
  options = options || '{"ar": ["الحرية، المساواة، الأخوة", "الله، الملك، الوطن", "العمل، الأسرة، الوطن", "الحرية، العدالة، السلام"]}'::jsonb,
  explanation = explanation || '{"ar": "شعار 'الحرية، المساواة، الأخوة' هو رمز للجمهورية منصوص عليه في الدستور."}'::jsonb
WHERE id = 'votre-question-id';

-- 5. Exemple : Mettre à jour toutes les questions d'un thème
-- (ATTENTION : À utiliser avec précaution, testez d'abord sur une question)
UPDATE fc_questions
SET 
  content = content || jsonb_build_object('en', 'English translation of: ' || (content->>'fr')),
  options = options || jsonb_build_object('en', options->'fr'),
  explanation = explanation || jsonb_build_object('en', 'English explanation of: ' || (explanation->>'fr'))
WHERE theme = 'VALEURS' 
  AND NOT (content ? 'en'); -- Seulement si la traduction EN n'existe pas déjà
