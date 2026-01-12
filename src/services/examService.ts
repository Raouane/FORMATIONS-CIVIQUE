import { supabase, TABLES } from '@/lib/supabase';
import { Question, UserLevel, ExamResult } from '@/types/database';
import { questionService } from './questionService';
import { SupportedLocale } from '@/lib/localization';
import { EXAM_CONFIG } from '@/lib/constants';

class ExamService {
  async startExamSession(
    level: UserLevel, 
    locale?: SupportedLocale,
    isPremium?: boolean // Nouveau paramètre optionnel
  ): Promise<Question[]> {
    // Si isPremium n'est pas fourni, le récupérer (fallback pour compatibilité)
    let premiumStatus = isPremium;
    
    if (premiumStatus === undefined) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from(TABLES.PROFILES)
          .select('is_premium')
          .eq('id', user.id)
          .single();
        
        premiumStatus = profile?.is_premium ?? false;
      } else {
        premiumStatus = false;
      }
    }

    // Récupérer les questions avec le statut premium connu dès le départ
    const questions = await questionService.getQuestionsForExam(level, premiumStatus, locale);
    
    // Si utilisateur gratuit, limiter à 10 questions côté service
    if (!premiumStatus) {
      return questions.slice(0, EXAM_CONFIG.QUIZ_RAPIDE_QUESTIONS);
    }
    
    return questions;
  }

  async submitExamResult(result: {
    score: number;
    percentage: number;
    timeSpent: number;
    passed: boolean;
    level: UserLevel;
    questionsAnswered: {
      questionId: string;
      answerIndex: number;
      isCorrect: boolean;
    }[];
  }): Promise<ExamResult> {
    const { data: { user } } = await supabase.auth.getUser();

    // Si pas d'utilisateur, stocker en localStorage pour l'instant
    if (!user) {
      const localResult: ExamResult = {
        id: `local-${Date.now()}`,
        user_id: 'anonymous',
        score: result.score,
        percentage: result.percentage,
        time_spent: result.timeSpent,
        passed: result.passed,
        level: result.level,
        questions_answered: result.questionsAnswered,
        email_sent: false,
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      // Stocker dans localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastExamResult', JSON.stringify(localResult));
      }

      return localResult;
    }

    // Si utilisateur connecté, sauvegarder en DB
    const { data, error } = await supabase
      .from(TABLES.EXAM_RESULTS)
      .insert({
        user_id: user.id,
        score: result.score,
        percentage: result.percentage,
        time_spent: result.timeSpent,
        passed: result.passed,
        level: result.level,
        questions_answered: result.questionsAnswered,
        email_sent: false,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Envoyer l'email de rapport (asynchrone, ne pas bloquer)
    this.sendExamReportEmail(data.id).catch(console.error);

    return data as ExamResult;
  }

  async getExamHistory(limit: number = 10): Promise<ExamResult[]> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from(TABLES.EXAM_RESULTS)
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as ExamResult[];
  }

  async getLatestExamResult(): Promise<ExamResult | null> {
    const { data: { user } } = await supabase.auth.getUser();

    // Si pas d'utilisateur, récupérer depuis localStorage
    if (!user) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('lastExamResult');
        if (stored) {
          try {
            return JSON.parse(stored) as ExamResult;
          } catch (e) {
            return null;
          }
        }
      }
      return null;
    }

    // Si utilisateur connecté, récupérer depuis DB
    const { data, error } = await supabase
      .from(TABLES.EXAM_RESULTS)
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Aucun résultat trouvé
        return null;
      }
      throw error;
    }

    return data as ExamResult;
  }

  private async sendExamReportEmail(examResultId: string): Promise<void> {
    // Cette fonction sera appelée par l'API route /api/emails/send-exam-report
    // pour éviter d'exposer la clé Resend dans le client
    try {
      await fetch('/api/emails/send-exam-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examResultId }),
      });
    } catch (error) {
      console.error('Error sending exam report email:', error);
    }
  }
}

export const examService = new ExamService();
