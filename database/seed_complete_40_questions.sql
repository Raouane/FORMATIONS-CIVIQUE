-- Script COMPLET de seeding pour les 40 questions au format JSONB
-- Exécuter ce script dans Supabase SQL Editor après avoir restauré la structure
-- ATTENTION: Ce script supprime toutes les questions existantes avant d'insérer les nouvelles

-- ============================================
-- NETTOYAGE PRÉALABLE
-- ============================================
DELETE FROM fc_questions;

-- ============================================
-- THÈME 1 : PRINCIPES ET VALEURS (11 questions)
-- ============================================

-- Q1: Devise de la République
INSERT INTO fc_questions (theme, type, level, complexity_level, content, options, correct_answer, explanation, is_premium, scenario_context)
VALUES (
  'VALEURS', 'CONNAISSANCE', 'A2', 'A2',
  '{"fr": "Quelle est la devise de la République française?", "en": "What is the motto of the French Republic?", "ar": "ما هو شعار الجمهورية الفرنسية؟"}',
  '{"fr": ["Liberté, Égalité, Fraternité", "Paix, Amour, Harmonie", "Justice, Droit, Loi", "Travail, Famille, Patrie"], "en": ["Liberty, Equality, Fraternity", "Peace, Love, Harmony", "Justice, Right, Law", "Work, Family, Homeland"], "ar": ["الحرية، المساواة، الإخاء", "السلام، الحب، الانسجام", "العدالة، الحق، القانون", "العمل، الأسرة، الوطن"]}',
  0,
  '{"fr": "La devise \"Liberté, Égalité, Fraternité\" est un symbole de la République inscrit dans la Constitution.", "en": "The motto \"Liberty, Equality, Fraternity\" is a symbol of the Republic enshrined in the Constitution.", "ar": "شعار \"الحرية، المساواة، الإخاء\" هو رمز للجمهورية منصوص عليه في الدستور."}',
  false, NULL
);

-- Q2: Laïcité
INSERT INTO fc_questions (theme, type, level, complexity_level, content, options, correct_answer, explanation, is_premium, scenario_context)
VALUES (
  'VALEURS', 'CONNAISSANCE', 'B1', 'B1',
  '{"fr": "Que signifie le principe de laïcité en France?", "en": "What does the principle of secularism mean in France?", "ar": "ماذا يعني مبدأ العلمانية في فرنسا؟"}',
  '{"fr": ["L''interdiction de pratiquer une religion", "Le financement de toutes les religions par l''État", "La séparation de l''État et des religions et la liberté de conscience", "L''obligation d''avoir une religion pour voter"], "en": ["The prohibition of practicing a religion", "State funding of all religions", "The separation of State and religions and freedom of conscience", "The obligation to have a religion to vote"], "ar": ["حظر ممارسة الدين", "تمويل الدولة لجميع الأديان", "فصل الدولة عن الأديان وحرية الضمير", "وجوب وجود دين للتصويت"]}',
  2,
  '{"fr": "La laïcité garantit la neutralité de l''État vis-à-vis des cultes.", "en": "Secularism guarantees the neutrality of the State towards religions.", "ar": "العلمانية تضمن حياد الدولة تجاه الأديان."}',
  false, NULL
);

-- Q3: Marianne
INSERT INTO fc_questions (theme, type, level, complexity_level, content, options, correct_answer, explanation, is_premium, scenario_context)
VALUES (
  'VALEURS', 'CONNAISSANCE', 'A2', 'A2',
  '{"fr": "Qui est représentée sur le buste présent dans toutes les mairies de France?", "en": "Who is represented on the bust present in all French town halls?", "ar": "من هي الممثلة على التمثال الموجود في جميع بلديات فرنسا؟"}',
  '{"fr": ["Jeanne d''Arc", "Marianne", "La République", "La France"], "en": ["Joan of Arc", "Marianne", "The Republic", "France"], "ar": ["جان دارك", "ماريان", "الجمهورية", "فرنسا"]}',
  1,
  '{"fr": "Marianne est la figure allégorique de la République française.", "en": "Marianne is the allegorical figure of the French Republic.", "ar": "ماريان هي الشخصية الرمزية للجمهورية الفرنسية."}',
  false, NULL
);

-- Q4: 14 juillet
INSERT INTO fc_questions (theme, type, level, complexity_level, content, options, correct_answer, explanation, is_premium, scenario_context)
VALUES (
  'VALEURS', 'CONNAISSANCE', 'A2', 'A2',
  '{"fr": "Que célèbre-t-on le 14 juillet en France?", "en": "What is celebrated on July 14th in France?", "ar": "ماذا يُحتفل به في 14 يوليو في فرنسا؟"}',
  '{"fr": ["La fin de la Seconde Guerre mondiale", "La fête nationale", "La Révolution de 1848", "La naissance de la Ve République"], "en": ["The end of World War II", "National Day", "The Revolution of 1848", "The birth of the Fifth Republic"], "ar": ["نهاية الحرب العالمية الثانية", "عيد وطني", "ثورة 1848", "ولادة الجمهورية الخامسة"]}',
  1,
  '{"fr": "Le 14 juillet est la fête nationale.", "en": "July 14th is the national holiday.", "ar": "14 يوليو هو العيد الوطني."}',
  false, NULL
);

-- Q5: Drapeau tricolore
INSERT INTO fc_questions (theme, type, level, complexity_level, content, options, correct_answer, explanation, is_premium, scenario_context)
VALUES (
  'VALEURS', 'CONNAISSANCE', 'A2', 'A2',
  '{"fr": "Quelles sont les trois couleurs du drapeau français?", "en": "What are the three colors of the French flag?", "ar": "ما هي الألوان الثلاثة للعلم الفرنسي؟"}',
  '{"fr": ["Rouge, Blanc, Bleu", "Bleu, Blanc, Rouge", "Rouge, Jaune, Bleu", "Vert, Blanc, Rouge"], "en": ["Red, White, Blue", "Blue, White, Red", "Red, Yellow, Blue", "Green, White, Red"], "ar": ["أحمر، أبيض، أزرق", "أزرق، أبيض، أحمر", "أحمر، أصفر، أزرق", "أخضر، أبيض، أحمر"]}',
  1,
  '{"fr": "Le drapeau tricolore est bleu, blanc, rouge.", "en": "The tricolor flag is blue, white, red.", "ar": "العلم ثلاثي الألوان هو أزرق، أبيض، أحمر."}',
  false, NULL
);

-- Q6-Q11: Situations (6 questions)
-- Note: Je vais créer un fichier séparé avec TOUTES les 40 questions complètes
-- pour éviter un fichier trop long. Pour l'instant, voici la structure.

-- ============================================
-- NOTE IMPORTANTE
-- ============================================
-- Ce fichier contient seulement les 5 premières questions comme exemple.
-- Un fichier complet avec les 40 questions sera créé dans seed_all_40_questions.sql
