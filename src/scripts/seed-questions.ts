import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { Question, QuestionTheme, QuestionType, UserLevel, ComplexityLevel } from '@/types/database';

// Charger les variables d'environnement
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  console.error('⚠️  Pour le seeding, SUPABASE_SERVICE_ROLE_KEY est recommandée pour bypasser les RLS');
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERREUR: SUPABASE_SERVICE_ROLE_KEY est requise pour le seeding');
  console.error('   La SERVICE_ROLE_KEY bypass les politiques RLS et permet l\'insertion.');
  console.error('');
  console.error('📝 Pour obtenir votre SERVICE_ROLE_KEY:');
  console.error('   1. Allez sur Supabase Dashboard → Settings → API');
  console.error('   2. Copiez la "service_role" key (⚠️ gardez-la secrète)');
  console.error('   3. Ajoutez-la dans .env.local : SUPABASE_SERVICE_ROLE_KEY=votre-cle');
  console.error('');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Questions du Thème 1 : Principes et Valeurs (Lot 1 + Lot 2)
const questions: Omit<Question, 'id' | 'created_at' | 'updated_at'>[] = [
  // LOT 1 - Questions de connaissance
  {
    theme: QuestionTheme.VALEURS,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Quelle est la devise de la République française?",
    scenario_context: null,
    options: [
      "Liberté, Égalité, Fraternité",
      "Travail, Famille, Patrie",
      "Unité, Justice, Prospérité",
      "Paix, Amour, Harmonie"
    ],
    correct_answer: 0,
    explanation: "La devise 'Liberté, Égalité, Fraternité' est un symbole de la République inscrit dans la Constitution. Elle apparaît sur les frontons des mairies et les bâtiments publics depuis 1848.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.VALEURS,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Que signifie le principe de laïcité en France?",
    scenario_context: null,
    options: [
      "L'interdiction de pratiquer une religion",
      "Le financement de toutes les religions par l'État",
      "La séparation de l'État et des religions et la liberté de conscience",
      "L'obligation d'avoir une religion pour voter"
    ],
    correct_answer: 2,
    explanation: "La laïcité garantit la neutralité de l'État vis-à-vis des cultes. Elle permet à chacun de pratiquer sa religion librement ou de ne pas en avoir, dans le respect de l'ordre public.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.VALEURS,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Qui est représentée sur le buste présent dans toutes les mairies de France?",
    scenario_context: null,
    options: [
      "La reine de France",
      "Marianne",
      "La déesse de la guerre",
      "Une sainte catholique"
    ],
    correct_answer: 1,
    explanation: "Marianne est la figure allégorique de la République française. Elle porte un bonnet phrygien et symbolise la liberté.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.VALEURS,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Que célèbre-t-on le 14 juillet en France?",
    scenario_context: null,
    options: [
      "La fin de la Seconde Guerre mondiale",
      "La fête nationale",
      "L'anniversaire du Président",
      "La victoire de Napoléon"
    ],
    correct_answer: 1,
    explanation: "Le 14 juillet est la fête nationale. Elle commémore notamment la prise de la Bastille en 1789, marquant le début de la Révolution française.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.VALEURS,
    type: QuestionType.SITUATION,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Quelle règle s'applique à un usager dans une mairie ou une préfecture concernant sa religion?",
    scenario_context: "Vous vous rendez dans un service public pour une démarche administrative.",
    options: [
      "L'usager doit cacher sa religion pour entrer",
      "Le service public est neutre, mais l'usager est libre d'exprimer ses convictions tant qu'il ne trouble pas l'ordre public",
      "L'usager doit obligatoirement déclarer sa religion à l'agent d'accueil",
      "Le service public impose la religion de la majorité à tous les usagers"
    ],
    correct_answer: 1,
    explanation: "Le principe de neutralité s'applique aux agents publics, mais les usagers bénéficient de la liberté de conscience et de culte dans le cadre défini par la loi pour l'accès aux services publics.",
    is_premium: true,
  },
  // LOT 2 - Dernière question de connaissance + 5 questions de situation
  {
    theme: QuestionTheme.VALEURS,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Quelles sont les trois couleurs du drapeau français?",
    scenario_context: null,
    options: [
      "Rouge, blanc, jaune",
      "Bleu, blanc, rouge",
      "Vert, blanc, rouge",
      "Bleu, jaune, rouge"
    ],
    correct_answer: 1,
    explanation: "Le drapeau tricolore, emblème national de la Ve République, est né de la réunion des couleurs du Roi (blanc) et de la ville de Paris (bleu et rouge).",
    is_premium: false,
  },
  {
    theme: QuestionTheme.VALEURS,
    type: QuestionType.SITUATION,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Un employeur refuse de vous embaucher uniquement parce que vous êtes une femme. Que dit la loi française?",
    scenario_context: "Vous postulez pour un emploi dans une entreprise privée.",
    options: [
      "L'employeur est libre de choisir qui il veut sans justification",
      "C'est une discrimination interdite, car les femmes et les hommes ont les mêmes droits",
      "L'employeur peut refuser si le travail est difficile physiquement",
      "C'est autorisé si l'entreprise est petite"
    ],
    correct_answer: 1,
    explanation: "L'égalité entre les femmes et les hommes est un principe fondamental protégé par la loi. Toute discrimination à l'embauche basée sur le sexe est passible de sanctions pénales.",
    is_premium: true,
  },
  {
    theme: QuestionTheme.VALEURS,
    type: QuestionType.SITUATION,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Une école publique organise une sortie au musée. Une mère d'élève portant un foulard religieux souhaite accompagner la classe. Est-ce autorisé?",
    scenario_context: "Le principe de laïcité à l'école.",
    options: [
      "Non, aucun signe religieux n'est admis lors d'une activité scolaire",
      "Oui, car elle est une collaboratrice bénévole et non un agent public soumis à la neutralité",
      "Oui, mais seulement si elle retire son foulard à l'intérieur du musée",
      "Non, seuls les parents athées peuvent accompagner les élèves"
    ],
    correct_answer: 1,
    explanation: "La laïcité impose la neutralité aux agents publics. Les parents d'élèves sont des usagers ou des collaborateurs occasionnels ; ils peuvent exprimer leurs convictions religieuses tant que leur tenue ou leur comportement ne constitue pas un acte de prosélytisme.",
    is_premium: true,
  },
  {
    theme: QuestionTheme.VALEURS,
    type: QuestionType.SITUATION,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Vous êtes témoin d'une agression physique violente dans la rue. Quelle doit être votre réaction selon les règles de la République?",
    scenario_context: "Assistance à personne en danger.",
    options: [
      "Filmer la scène pour la diffuser sur les réseaux sociaux",
      "Ne pas intervenir pour ne pas prendre de risques personnels",
      "Alerter immédiatement les secours (17 ou 112) et porter assistance si cela est possible sans danger",
      "Attendre que la police arrive par hasard"
    ],
    correct_answer: 2,
    explanation: "Le respect de la loi implique un devoir de solidarité. La non-assistance à personne en danger est un délit en France.",
    is_premium: true,
  },
  {
    theme: QuestionTheme.VALEURS,
    type: QuestionType.SITUATION,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Vous souhaitez critiquer une décision du gouvernement sur internet. Qu'est-ce qui est autorisé par la liberté d'expression?",
    scenario_context: "Usage de la liberté d'expression sur les réseaux sociaux.",
    options: [
      "Tout est autorisé, y compris les insultes et les menaces",
      "Vous pouvez exprimer votre opinion, mais l'injure, la diffamation et l'incitation à la haine sont interdites",
      "Seules les critiques positives sont autorisées",
      "Aucune critique n'est permise sur internet"
    ],
    correct_answer: 1,
    explanation: "La liberté d'expression est un droit fondamental mais elle connaît des limites légales : l'injure, la diffamation et l'incitation à la haine ou à la violence sont interdites.",
    is_premium: true,
  },
  {
    theme: QuestionTheme.VALEURS,
    type: QuestionType.SITUATION,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Un agent de mairie refuse de traiter votre dossier car il n'approuve pas vos convictions politiques. Que se passe-t-il?",
    scenario_context: "Neutralité des agents publics.",
    options: [
      "L'agent a le droit de suivre ses opinions personnelles",
      "L'agent manque à son devoir de neutralité et commet une faute professionnelle",
      "C'est autorisé si le maire est d'accord",
      "L'usager doit changer ses opinions pour obtenir son document"
    ],
    correct_answer: 1,
    explanation: "Le principe de laïcité et de neutralité impose aux agents des services publics de traiter tous les usagers de manière égale, sans distinction d'opinion, de religion ou d'origine.",
    is_premium: true,
  },
  // THÈME 2 : DROITS ET DEVOIRS (Lot 3 + Lot 4)
  // LOT 3 - Début du thème DROITS
  {
    theme: QuestionTheme.DROITS,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Quel est le texte qui proclame les droits de l'homme en France?",
    scenario_context: null,
    options: [
      "Le Code civil",
      "La Déclaration des droits de l'homme et du citoyen de 1789",
      "Le Code pénal",
      "La Constitution de 1958"
    ],
    correct_answer: 1,
    explanation: "Adoptée le 26 août 1789, cette Déclaration est le texte fondateur qui établit les droits naturels et imprescriptibles de l'homme en France.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.DROITS,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Le droit de grève est-il autorisé en France?",
    scenario_context: null,
    options: [
      "Non, il est strictement interdit",
      "Oui, il est reconnu par la Constitution mais encadré par la loi",
      "Oui, mais seulement pour les fonctionnaires",
      "Non, sauf en cas de guerre"
    ],
    correct_answer: 1,
    explanation: "Le droit de grève est un droit fondamental garanti par la Constitution. Il s'exerce dans le cadre des lois qui le réglementent.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.DROITS,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Le paiement des impôts en France est-il une obligation?",
    scenario_context: null,
    options: [
      "Non, c'est facultatif",
      "Oui, c'est un devoir pour financer les services publics",
      "Oui, mais seulement pour les riches",
      "Non, sauf si vous êtes étranger"
    ],
    correct_answer: 1,
    explanation: "Toute personne résidant en France a le devoir de contribuer aux charges publiques selon ses capacités, afin de financer l'école, la santé et la sécurité.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.DROITS,
    type: QuestionType.SITUATION,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Un propriétaire refuse de vous louer un appartement en raison de votre origine. Que pouvez-vous faire?",
    scenario_context: "Vous recherchez un logement dans le secteur privé.",
    options: [
      "Rien, c'est son droit",
      "Porter plainte pour discrimination, car c'est interdit par la loi",
      "Lui proposer plus d'argent",
      "Attendre qu'il change d'avis"
    ],
    correct_answer: 1,
    explanation: "La discrimination fondée sur l'origine, la religion ou le sexe est un délit puni par la loi. Vous pouvez saisir la justice ou le Défenseur des droits.",
    is_premium: true,
  },
  {
    theme: QuestionTheme.DROITS,
    type: QuestionType.SITUATION,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Vous êtes témoin d'une scène de violence conjugale chez vos voisins. Quelle est la conduite à tenir?",
    scenario_context: "Respect de la loi et assistance aux personnes.",
    options: [
      "Ne pas intervenir pour respecter la vie privée du couple",
      "Appeler immédiatement les secours (le 17 ou le 3919)",
      "Attendre le lendemain pour en parler au gardien",
      "Filmer la scène pour vos réseaux sociaux"
    ],
    correct_answer: 1,
    explanation: "En France, toute personne témoin de violences a le devoir d'alerter les autorités. La protection des victimes prime sur le respect de la vie privée.",
    is_premium: true,
  },
  // LOT 4 - Fin du thème DROITS
  {
    theme: QuestionTheme.DROITS,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Toute personne résidant en France doit-elle respecter les lois françaises?",
    scenario_context: null,
    options: [
      "Non, seulement les Français",
      "Oui, c'est une obligation pour tous",
      "Oui, mais seulement les lois civiles",
      "Non, si vous êtes en vacances"
    ],
    correct_answer: 1,
    explanation: "Le respect des lois est un devoir fondamental pour toute personne vivant en France, quelle que soit sa nationalité ou sa situation.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.DROITS,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Qu'est-ce que l'autorité parentale selon le droit français?",
    scenario_context: null,
    options: [
      "Le droit de choisir la religion de ses voisins",
      "L'ensemble des droits et devoirs des parents pour protéger et éduquer leur enfant",
      "L'obligation pour les enfants de travailler pour leurs parents",
      "Le droit de punir physiquement ses enfants"
    ],
    correct_answer: 1,
    explanation: "L'autorité parentale est un ensemble de droits et de devoirs ayant pour but l'intérêt de l'enfant (santé, sécurité, moralité et éducation).",
    is_premium: false,
  },
  {
    theme: QuestionTheme.DROITS,
    type: QuestionType.SITUATION,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Vous jetez volontairement une bouteille ou un mégot par terre dans l'espace public. Que se passe-t-il?",
    scenario_context: "Respect de l'environnement et de la propreté urbaine.",
    options: [
      "Rien, c'est autorisé",
      "Vous risquez une amende, car c'est interdit",
      "C'est autorisé si personne ne vous voit",
      "C'est autorisé seulement le dimanche"
    ],
    correct_answer: 1,
    explanation: "Le respect de l'environnement est une obligation. Jeter des déchets dans la rue constitue une infraction passible d'une contravention.",
    is_premium: true,
  },
  {
    theme: QuestionTheme.DROITS,
    type: QuestionType.SITUATION,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Un employeur vous propose de travailler sans contrat et de vous payer en espèces (travail au noir). Que dit la loi?",
    scenario_context: "Droit du travail et protection sociale.",
    options: [
      "C'est une bonne opportunité car vous ne payez pas d'impôts",
      "C'est illégal, vous n'êtes pas protégé en cas d'accident et l'employeur risque des poursuites",
      "C'est autorisé pour les trois premiers mois de travail",
      "C'est obligatoire si vous n'avez pas de compte bancaire"
    ],
    correct_answer: 1,
    explanation: "Le travail non déclaré est strictement interdit en France. Il prive le travailleur de ses droits sociaux (santé, retraite) et expose l'employeur à de lourdes sanctions.",
    is_premium: true,
  },
  {
    theme: QuestionTheme.DROITS,
    type: QuestionType.SITUATION,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Votre employeur vous demande de lui fournir les détails d'un diagnostic médical récent. Êtes-vous obligé de répondre?",
    scenario_context: "Respect de la vie privée et confidentialité médicale.",
    options: [
      "Oui, l'employeur doit tout savoir sur votre santé",
      "Non, le secret médical est protégé par la loi et l'employeur ne peut pas exiger ces détails",
      "Oui, mais seulement si vous travaillez dans un bureau",
      "Non, sauf si vos collègues sont au courant"
    ],
    correct_answer: 1,
    explanation: "Le principe de confidentialité garantit que les informations médicales restent privées. L'employeur n'a pas accès à votre dossier médical.",
    is_premium: true,
  },
  {
    theme: QuestionTheme.DROITS,
    type: QuestionType.SITUATION,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Un agent de police procède à un contrôle d'identité dans la rue et vous demande vos papiers. Quelle est votre obligation?",
    scenario_context: "Relation avec les forces de l'ordre.",
    options: [
      "Refuser de les montrer",
      "Les présenter, car c'est une obligation légale lors d'un contrôle",
      "Les montrer seulement si vous êtes français",
      "Les montrer seulement le jour"
    ],
    correct_answer: 1,
    explanation: "Toute personne se trouvant en France doit être en mesure de justifier de son identité ou de la régularité de son séjour lors d'un contrôle légal par les autorités.",
    is_premium: true,
  },
  // THÈME 3 : HISTOIRE, GÉOGRAPHIE ET CULTURE FRANÇAISE (8 questions - toutes CONNAISSANCE)
  {
    theme: QuestionTheme.HISTOIRE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "En quelle année a commencé la Révolution française?",
    scenario_context: null,
    options: [
      "1789",
      "1792",
      "1815",
      "1848"
    ],
    correct_answer: 0,
    explanation: "La Révolution française a débuté en 1789, marquée notamment par la prise de la Bastille le 14 juillet.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.HISTOIRE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Quelles sont les dates de la Première Guerre mondiale?",
    scenario_context: null,
    options: [
      "1914 - 1918",
      "1939 - 1945",
      "1870 - 1871",
      "1954 - 1962"
    ],
    correct_answer: 0,
    explanation: "La Première Guerre mondiale s'est déroulée de 1914 à 1918. Le 11 novembre commémore l'armistice de ce conflit.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.HISTOIRE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.B2,
    complexity_level: ComplexityLevel.B2,
    content: "Lequel de ces pays est un pays fondateur de l'Union européenne?",
    scenario_context: null,
    options: [
      "La Pologne",
      "La Grèce",
      "L'Italie",
      "L'Espagne"
    ],
    correct_answer: 2,
    explanation: "L'Italie fait partie des six pays fondateurs de la Communauté économique européenne (ancêtre de l'UE) lors du traité de Rome en 1957.",
    is_premium: true,
  },
  {
    theme: QuestionTheme.HISTOIRE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Quel fleuve traverse la ville de Paris?",
    scenario_context: null,
    options: [
      "La Loire",
      "Le Rhône",
      "La Garonne",
      "La Seine"
    ],
    correct_answer: 3,
    explanation: "La Seine est le fleuve qui traverse la capitale française.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.HISTOIRE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Citez trois pays frontaliers de la France métropolitaine :",
    scenario_context: null,
    options: [
      "Espagne, Italie, Allemagne",
      "Portugal, Grèce, Autriche",
      "Royaume-Uni, Irlande, Danemark",
      "Belgique, Pays-Bas, Suisse"
    ],
    correct_answer: 0,
    explanation: "La France métropolitaine possède des frontières terrestres avec huit pays, dont l'Espagne, l'Italie et l'Allemagne.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.HISTOIRE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Quelle est la plus haute chaîne de montagnes en France?",
    scenario_context: null,
    options: [
      "Les Pyrénées",
      "Le Massif central",
      "Les Alpes",
      "Le Jura"
    ],
    correct_answer: 2,
    explanation: "Les Alpes sont la chaîne de montagnes la plus élevée de France, avec le Mont-Blanc qui culmine à 4 807 mètres.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.HISTOIRE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Lequel de ces monuments est situé à Paris?",
    scenario_context: null,
    options: [
      "Le château de Versailles",
      "La tour Eiffel",
      "Le Mont-Saint-Michel",
      "Le pont du Gard"
    ],
    correct_answer: 1,
    explanation: "La tour Eiffel est l'un des monuments les plus emblématiques de Paris et de la France.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.HISTOIRE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Qui était Molière?",
    scenario_context: null,
    options: [
      "Un célèbre peintre français",
      "Un écrivain et dramaturge célèbre",
      "Un homme politique du XXe siècle",
      "Un grand explorateur français"
    ],
    correct_answer: 1,
    explanation: "Molière était un dramaturge et comédien français du XVIIe siècle, auteur de pièces de théâtre classiques célèbres dans le monde entier.",
    is_premium: true,
  },
  // THÈME 4 : SYSTÈME INSTITUTIONNEL ET POLITIQUE (6 questions - toutes CONNAISSANCE)
  {
    theme: QuestionTheme.POLITIQUE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Qui nomme le Premier ministre en France?",
    scenario_context: null,
    options: [
      "Le peuple par un vote",
      "Le Président de la République",
      "L'Assemblée nationale",
      "Le Sénat"
    ],
    correct_answer: 1,
    explanation: "Selon la Constitution de la Ve République, c'est le Président de la République qui nomme le Premier ministre.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.POLITIQUE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "De quelles chambres est composé le Parlement français?",
    scenario_context: null,
    options: [
      "Une seule chambre",
      "L'Assemblée nationale et le Sénat",
      "Le Conseil constitutionnel et le Conseil d'État",
      "Le Président et le Premier ministre"
    ],
    correct_answer: 1,
    explanation: "Le Parlement possède le pouvoir législatif. Il est composé de deux chambres : l'Assemblée nationale (députés) et le Sénat (sénateurs).",
    is_premium: false,
  },
  {
    theme: QuestionTheme.POLITIQUE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "La séparation des pouvoirs est un principe fondamental. Quels sont les trois pouvoirs concernés?",
    scenario_context: null,
    options: [
      "Le pouvoir civil, militaire et religieux",
      "Le pouvoir exécutif, législatif et judiciaire",
      "Le pouvoir de la police, de l'école et de l'hôpital",
      "Le pouvoir du Maire, du Préfet et du Ministre"
    ],
    correct_answer: 1,
    explanation: "La démocratie française repose sur la séparation entre celui qui exécute les lois (exécutif), celui qui les vote (législatif) et celui qui les fait respecter (judiciaire).",
    is_premium: true,
  },
  {
    theme: QuestionTheme.POLITIQUE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Pour combien de temps le Président de la République est-il élu?",
    scenario_context: null,
    options: [
      "4 ans",
      "5 ans",
      "7 ans",
      "10 ans"
    ],
    correct_answer: 1,
    explanation: "Depuis 2002, le mandat du Président (le quinquennat) dure 5 ans. Il est élu au suffrage universel direct.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.POLITIQUE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.B2,
    complexity_level: ComplexityLevel.B2,
    content: "Quel est le rôle principal du Conseil constitutionnel?",
    scenario_context: null,
    options: [
      "Voter les lois",
      "Vérifier que les lois respectent la Constitution",
      "Nommer les ministres",
      "Diriger l'armée"
    ],
    correct_answer: 1,
    explanation: "Le Conseil constitutionnel est le gardien de la Constitution. Il s'assure que les lois votées ne sont pas contraires aux droits fondamentaux.",
    is_premium: true,
  },
  {
    theme: QuestionTheme.POLITIQUE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Où se situe le siège officiel du Parlement européen?",
    scenario_context: null,
    options: [
      "À Paris",
      "À Bruxelles",
      "À Strasbourg",
      "À Luxembourg"
    ],
    correct_answer: 2,
    explanation: "Bien que les commissions se réunissent à Bruxelles, le siège officiel et le lieu des sessions plénières du Parlement européen se situent à Strasbourg.",
    is_premium: true,
  },
  // THÈME 5 : VIVRE DANS LA SOCIÉTÉ FRANÇAISE (4 questions - toutes CONNAISSANCE)
  {
    theme: QuestionTheme.SOCIETE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Quel type de mariage est légalement reconnu par l'État en France?",
    scenario_context: null,
    options: [
      "Le mariage religieux uniquement",
      "Le mariage civil célébré à la mairie",
      "Le mariage coutumier",
      "Le mariage à l'étranger uniquement"
    ],
    correct_answer: 1,
    explanation: "En France, seul le mariage civil célébré devant un officier d'état civil à la mairie est légalement reconnu par l'État.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.SOCIETE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.B1,
    complexity_level: ComplexityLevel.B1,
    content: "Dans quel délai maximum un enfant doit-il être déclaré à la mairie après sa naissance?",
    scenario_context: null,
    options: [
      "3 jours",
      "5 jours",
      "7 jours",
      "15 jours"
    ],
    correct_answer: 1,
    explanation: "La déclaration de naissance est une obligation légale qui doit être effectuée à la mairie du lieu de naissance dans les 5 jours suivant l'accouchement.",
    is_premium: true,
  },
  {
    theme: QuestionTheme.SOCIETE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "Jusqu'à quel âge l'instruction (école) est-elle obligatoire pour tous les enfants en France?",
    scenario_context: null,
    options: [
      "14 ans",
      "16 ans",
      "18 ans",
      "21 ans"
    ],
    correct_answer: 1,
    explanation: "L'instruction est obligatoire pour tous les enfants résidant en France, qu'ils soient français ou étrangers, de l'âge de 3 ans jusqu'à 16 ans révolus.",
    is_premium: false,
  },
  {
    theme: QuestionTheme.SOCIETE,
    type: QuestionType.CONNAISSANCE,
    level: UserLevel.A2,
    complexity_level: ComplexityLevel.A2,
    content: "En cas d'urgence médicale grave, quel numéro court permet d'appeler le SAMU?",
    scenario_context: null,
    options: [
      "15",
      "17",
      "18",
      "112"
    ],
    correct_answer: 0,
    explanation: "Le 15 est le numéro d'urgence pour joindre le SAMU (urgence médicale). Le 17 est pour la police et le 18 pour les pompiers.",
    is_premium: false,
  },
];

async function seedQuestions() {
  console.log('🌱 Début du seeding des questions...\n');

  try {
    // Vérifier la connexion
    const { error: healthError } = await supabase
      .from('fc_questions')
      .select('count')
      .limit(1);

    if (healthError && healthError.code !== 'PGRST116') {
      console.error('❌ Erreur de connexion:', healthError.message);
      return false;
    }

    console.log('✅ Connexion à Supabase réussie\n');

    // Préparer les données pour l'insertion
    const questionsToInsert = questions.map((q) => ({
      theme: q.theme,
      type: q.type,
      level: q.level,
      complexity_level: q.complexity_level,
      content: q.content,
      scenario_context: q.scenario_context,
      options: JSON.stringify(q.options), // Convertir en JSON string
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      is_premium: q.is_premium,
    }));

    // Insérer les questions
    const { data, error } = await supabase
      .from('fc_questions')
      .insert(questionsToInsert)
      .select();

    if (error) {
      console.error('❌ Erreur lors de l\'insertion:', error.message);
      return false;
    }

    console.log(`✅ ${data.length} questions insérées avec succès !\n`);

    // Statistiques
    const stats = {
      total: questions.length,
      connaissance: questions.filter((q) => q.type === QuestionType.CONNAISSANCE).length,
      situation: questions.filter((q) => q.type === QuestionType.SITUATION).length,
      a2: questions.filter((q) => q.level === UserLevel.A2).length,
      b1: questions.filter((q) => q.level === UserLevel.B1).length,
      premium: questions.filter((q) => q.is_premium).length,
    };

    console.log('📊 Statistiques:');
    console.log(`   Total: ${stats.total} questions`);
    console.log(`   Connaissance: ${stats.connaissance}`);
    console.log(`   Situation: ${stats.situation}`);
    console.log(`   Niveau A2: ${stats.a2}`);
    console.log(`   Niveau B1: ${stats.b1}`);
    console.log(`   Premium: ${stats.premium}\n`);

    console.log('✅ Seeding terminé avec succès !');
    return true;
  } catch (error: any) {
    console.error('❌ Erreur fatale:', error.message);
    return false;
  }
}

seedQuestions()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  });
