import { QuestionTheme, UserLevel } from './database';

export enum PathType {
  SEJOUR = 'SEJOUR',
  RESIDENT = 'RESIDENT',
  NATURALISATION = 'NATURALISATION',
}

export interface Path {
  id: string;
  type: PathType;
  level: UserLevel;
  title: string;
  description: string;
  duration: string;
  questionsCount: number;
  icon: string;
}

export interface Theme {
  id: QuestionTheme;
  name: string;
  description: string;
  color: string;
  icon: string;
  questionCount: number; // Nombre de questions dans l'examen (ex: 11 pour VALEURS)
}
