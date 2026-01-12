import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculatePercentage(score: number, total: number): number {
  return Math.round((score / total) * 100);
}

export function getThemeColor(theme: string): string {
  const colors: Record<string, string> = {
    VALEURS: '#3b82f6', // bleu
    DROITS: '#10b981', // vert
    HISTOIRE: '#f59e0b', // orange
    POLITIQUE: '#ef4444', // rouge
    SOCIETE: '#8b5cf6', // violet
  };
  return colors[theme] || '#6b7280';
}
