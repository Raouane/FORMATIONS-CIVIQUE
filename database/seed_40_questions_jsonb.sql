-- Script de seeding pour réinsérer les 40 questions au format JSONB
-- Exécuter ce script APRÈS avoir restauré la structure de la table
-- Format: JSONB avec clés 'fr', 'en', 'ar' pour la localisation

-- ============================================
-- THÈME 1 : PRINCIPES ET VALEURS (11 questions)
-- ============================================

-- Question 1
INSERT INTO fc_questions (theme, type, level, complexity_level, content, options, correct_answer, explanation, is_premium, scenario_context)
VALUES (
  'VALEURS',
  'CONNAISSANCE',
  'A2',
  'A2',
  '{"fr": "Quelle est la devise de la République française?", "en": "What is the motto of the French Republic?", "ar": "ما هو شعار الجمهورية الفرنسية؟"}',
  '{"fr": ["Liberté, Égalité, Fraternité", "Paix, Amour, Harmonie", "Justice, Droit, Loi", "Travail, Famille, Patrie"], "en": ["Liberty, Equality, Fraternity", "Peace, Love, Harmony", "Justice, Right, Law", "Work, Family, Homeland"], "ar": ["الحرية، المساواة، الإخاء", "السلام، الحب، الانسجام", "العدالة، الحق، القانون", "العمل، الأسرة، الوطن"]}',
  0,
  '{"fr": "La devise \"Liberté, Égalité, Fraternité\" est un symbole de la République inscrit dans la Constitution. Elle apparaît sur les frontons des mairies et les bâtiments publics depuis 1848.", "en": "The motto \"Liberty, Equality, Fraternity\" is a symbol of the Republic enshrined in the Constitution. It appears on the facades of town halls and public buildings since 1848.", "ar": "شعار \"الحرية، المساواة، الإخاء\" هو رمز للجمهورية منصوص عليه في الدستور. يظهر على واجهات البلديات والمباني العامة منذ عام 1848."}',
  false,
  NULL
);

-- Question 2
INSERT INTO fc_questions (theme, type, level, complexity_level, content, options, correct_answer, explanation, is_premium, scenario_context)
VALUES (
  'VALEURS',
  'CONNAISSANCE',
  'B1',
  'B1',
  '{"fr": "Que signifie le principe de laïcité en France?", "en": "What does the principle of secularism mean in France?", "ar": "ماذا يعني مبدأ العلمانية في فرنسا؟"}',
  '{"fr": ["L''interdiction de pratiquer une religion", "Le financement de toutes les religions par l''État", "La séparation de l''État et des religions et la liberté de conscience", "L''obligation d''avoir une religion pour voter"], "en": ["The prohibition of practicing a religion", "State funding of all religions", "The separation of State and religions and freedom of conscience", "The obligation to have a religion to vote"], "ar": ["حظر ممارسة الدين", "تمويل الدولة لجميع الأديان", "فصل الدولة عن الأديان وحرية الضمير", "وجوب وجود دين للتصويت"]}',
  2,
  '{"fr": "La laïcité garantit la neutralité de l''État vis-à-vis des cultes. Elle permet à chacun de pratiquer sa religion librement ou de ne pas en avoir, dans le respect de l''ordre public.", "en": "Secularism guarantees the neutrality of the State towards religions. It allows everyone to practice their religion freely or not to have one, while respecting public order.", "ar": "العلمانية تضمن حياد الدولة تجاه الأديان. تسمح لكل شخص بممارسة دينه بحرية أو عدم وجود دين، مع احترام النظام العام."}',
  false,
  NULL
);

-- Question 3
INSERT INTO fc_questions (theme, type, level, complexity_level, content, options, correct_answer, explanation, is_premium, scenario_context)
VALUES (
  'VALEURS',
  'CONNAISSANCE',
  'A2',
  'A2',
  '{"fr": "Qui est représentée sur le buste présent dans toutes les mairies de France?", "en": "Who is represented on the bust present in all French town halls?", "ar": "من هي الممثلة على التمثال الموجود في جميع بلديات فرنسا؟"}',
  '{"fr": ["Jeanne d''Arc", "Marianne", "La République", "La France"], "en": ["Joan of Arc", "Marianne", "The Republic", "France"], "ar": ["جان دارك", "ماريان", "الجمهورية", "فرنسا"]}',
  1,
  '{"fr": "Marianne est la figure allégorique de la République française. Elle porte un bonnet phrygien et symbolise la liberté.", "en": "Marianne is the allegorical figure of the French Republic. She wears a Phrygian cap and symbolizes liberty.", "ar": "ماريان هي الشخصية الرمزية للجمهورية الفرنسية. ترتدي قبعة فريجية وترمز إلى الحرية."}',
  false,
  NULL
);

-- Question 4
INSERT INTO fc_questions (theme, type, level, complexity_level, content, options, correct_answer, explanation, is_premium, scenario_context)
VALUES (
  'VALEURS',
  'CONNAISSANCE',
  'A2',
  'A2',
  '{"fr": "Que célèbre-t-on le 14 juillet en France?", "en": "What is celebrated on July 14th in France?", "ar": "ماذا يُحتفل به في 14 يوليو في فرنسا؟"}',
  '{"fr": ["La fin de la Seconde Guerre mondiale", "La fête nationale", "La Révolution de 1848", "La naissance de la Ve République"], "en": ["The end of World War II", "National Day", "The Revolution of 1848", "The birth of the Fifth Republic"], "ar": ["نهاية الحرب العالمية الثانية", "عيد وطني", "ثورة 1848", "ولادة الجمهورية الخامسة"]}',
  1,
  '{"fr": "Le 14 juillet est la fête nationale. Elle commémore notamment la prise de la Bastille en 1789, marquant le début de la Révolution française.", "en": "July 14th is the national holiday. It commemorates the storming of the Bastille in 1789, marking the beginning of the French Revolution.", "ar": "14 يوليو هو العيد الوطني. يحتفل بذكرى اقتحام الباستيل في عام 1789، مما يمثل بداية الثورة الفرنسية."}',
  false,
  NULL
);

-- Question 5
INSERT INTO fc_questions (theme, type, level, complexity_level, content, options, correct_answer, explanation, is_premium, scenario_context)
VALUES (
  'VALEURS',
  'SITUATION',
  'B1',
  'B1',
  '{"fr": "Quelle règle s''applique à un usager dans une mairie ou une préfecture concernant sa religion?", "en": "What rule applies to a user in a town hall or prefecture regarding their religion?", "ar": "ما هي القاعدة التي تنطبق على المستخدم في البلدية أو المحافظة فيما يتعلق بدينه؟"}',
  '{"fr": ["L''usager doit cacher sa religion pour entrer", "Le service public est neutre, mais l''usager est libre d''exprimer ses convictions tant qu''il ne trouble pas l''ordre public", "L''usager doit obligatoirement déclarer sa religion à l''agent d''accueil", "Le service public impose la religion de la majorité à tous les usagers"], "en": ["The user must hide their religion to enter", "Public service is neutral, but the user is free to express their beliefs as long as they do not disturb public order", "The user must declare their religion to the reception agent", "Public service imposes the majority religion on all users"], "ar": ["يجب على المستخدم إخفاء دينه للدخول", "الخدمة العامة محايدة، لكن المستخدم حر في التعبير عن معتقداته طالما أنه لا يزعج النظام العام", "يجب على المستخدم الإعلان عن دينه لموظف الاستقبال", "الخدمة العامة تفرض دين الأغلبية على جميع المستخدمين"]}',
  1,
  '{"fr": "Le principe de neutralité s''applique aux agents publics, mais les usagers bénéficient de la liberté de conscience et de culte dans le cadre défini par la loi pour l''accès aux services publics.", "en": "The principle of neutrality applies to public agents, but users benefit from freedom of conscience and worship within the framework defined by law for access to public services.", "ar": "مبدأ الحياد ينطبق على الموظفين العموميين، لكن المستخدمين يستفيدون من حرية الضمير والعبادة في الإطار المحدد بالقانون للوصول إلى الخدمات العامة."}',
  true,
  '{"fr": "Vous vous rendez dans un service public pour une démarche administrative.", "en": "You go to a public service for an administrative procedure.", "ar": "تذهب إلى خدمة عامة لإجراء إداري."}'
);

-- Continuer avec les 35 questions restantes...
-- (Je vais créer un fichier séparé avec toutes les 40 questions pour éviter un fichier trop long)
