import { Path, Theme, PathType, QuestionTheme, UserLevel } from '@/types';

export const PATHS_DATA: Path[] = [
  {
    id: 'sejour-a2',
    type: PathType.SEJOUR,
    level: UserLevel.A2,
    title: 'Séjour A2',
    description: 'Pour les personnes souhaitant obtenir un titre de séjour',
    duration: '45 minutes',
    questionsCount: 40,
    icon: 'Plane',
  },
  {
    id: 'resident-b1',
    type: PathType.RESIDENT,
    level: UserLevel.B1,
    title: 'Résident B1',
    description: 'Pour les personnes souhaitant obtenir une carte de résident',
    duration: '45 minutes',
    questionsCount: 40,
    icon: 'Home',
  },
  {
    id: 'naturalisation-b2',
    type: PathType.NATURALISATION,
    level: UserLevel.B2,
    title: 'Naturalisation B2',
    description: 'Pour les personnes souhaitant obtenir la nationalité française',
    duration: '45 minutes',
    questionsCount: 40,
    icon: 'Flag',
  },
];

export const THEMES_DATA: Theme[] = [
  {
    id: QuestionTheme.VALEURS,
    name: 'Principes et Valeurs',
    description: 'Les valeurs fondamentales de la République française',
    color: '#3b82f6',
    icon: 'Heart',
    questionCount: 11, // 27.5% de 40 questions
  },
  {
    id: QuestionTheme.DROITS,
    name: 'Droits et Devoirs',
    description: 'Les droits et devoirs du citoyen français',
    color: '#10b981',
    icon: 'Scale',
    questionCount: 7,
  },
  {
    id: QuestionTheme.HISTOIRE,
    name: 'Histoire de France',
    description: 'Les grandes dates et événements de l\'histoire française',
    color: '#f59e0b',
    icon: 'BookOpen',
    questionCount: 7,
  },
  {
    id: QuestionTheme.POLITIQUE,
    name: 'Politique et Institutions',
    description: 'Le fonctionnement des institutions françaises',
    color: '#8b5cf6', // Violet
    icon: 'Building2',
    questionCount: 8,
  },
  {
    id: QuestionTheme.SOCIETE,
    name: 'Société Française',
    description: 'La société française contemporaine',
    color: '#ef4444', // Rouge
    icon: 'Users',
    questionCount: 7,
  },
];

export const STATS_DATA = [
  {
    label: 'Questions',
    value: '40',
    description: 'Questions officielles',
  },
  {
    label: 'Durée',
    value: '45 min',
    description: 'Temps alloué',
  },
  {
    label: 'Réussite',
    value: '80%',
    description: 'Score minimum requis',
  },
];

export const EXAM_CONFIG = {
  TOTAL_QUESTIONS: 40,
  KNOWLEDGE_QUESTIONS: 28, // CONNAISSANCE
  SITUATION_QUESTIONS: 12, // SITUATION
  TIME_LIMIT: 2700, // 45 minutes en secondes
  PASSING_SCORE: 80, // 80% = 32/40
  QUIZ_RAPIDE_QUESTIONS: 10,
  QUIZ_RAPIDE_TIME: 900, // 15 minutes
} as const;
