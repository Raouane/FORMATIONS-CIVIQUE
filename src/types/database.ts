// Types pour la base de données Supabase (préfixe fc_)

export enum QuestionTheme {
  VALEURS = 'VALEURS',
  DROITS = 'DROITS',
  HISTOIRE = 'HISTOIRE',
  POLITIQUE = 'POLITIQUE',
  SOCIETE = 'SOCIETE',
}

export enum QuestionType {
  CONNAISSANCE = 'CONNAISSANCE',
  SITUATION = 'SITUATION',
}

export enum UserLevel {
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
}

export enum ComplexityLevel {
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  TRIALING = 'TRIALING',
}

// Type pour les champs localisés (JSONB avec clés de langue)
export type LocalizedField = { [locale: string]: string };
export type LocalizedArray = { [locale: string]: string[] };

// Type pour les données brutes de la base (avec JSONB)
export interface QuestionRaw {
  id: string;
  theme: QuestionTheme;
  type: QuestionType;
  level: UserLevel;
  complexity_level: ComplexityLevel;
  content: LocalizedField; // JSONB: { "fr": "...", "en": "...", "ar": "..." }
  scenario_context?: LocalizedField | null; // JSONB: { "fr": "...", "en": "...", "ar": "..." }
  options: LocalizedArray; // JSONB: { "fr": [...], "en": [...], "ar": [...] }
  correct_answer: number; // Index 0-3
  explanation: LocalizedField; // JSONB: { "fr": "...", "en": "...", "ar": "..." }
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

// Type pour les questions avec traductions extraites (utilisé côté client)
export interface Question {
  id: string;
  theme: QuestionTheme;
  type: QuestionType;
  level: UserLevel;
  complexity_level: ComplexityLevel;
  content: string; // Texte extrait selon la locale
  scenario_context?: string | null; // Texte extrait selon la locale
  options: string[]; // Options extraites selon la locale
  correct_answer: number; // Index 0-3
  explanation: string; // Texte extrait selon la locale
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  objective: UserLevel;
  preferred_language?: string; // 'fr', 'en', 'ar', etc.
  stripe_customer_id: string | null;
  subscription_status: SubscriptionStatus | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  is_correct: boolean;
  attempts: number;
  last_reviewed: string | null;
  next_review: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExamResult {
  id: string;
  user_id: string;
  score: number;
  percentage: number;
  time_spent: number; // en secondes
  passed: boolean; // >= 80%
  level: UserLevel;
  questions_answered: {
    questionId: string;
    answerIndex: number;
    isCorrect: boolean;
  }[];
  email_sent: boolean;
  completed_at: string;
  created_at: string;
}

export interface ExamSession {
  id: string;
  questions: Question[];
  startedAt: Date;
  timeLimit: number; // en secondes (2700 = 45min)
  level: UserLevel;
}
