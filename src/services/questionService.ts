import { supabase, TABLES } from '@/lib/supabase';
import { Question, QuestionRaw, QuestionTheme, QuestionType, UserLevel, ComplexityLevel } from '@/types/database';
import { EXAM_CONFIG } from '@/lib/constants';
import { extractLocalizedQuestion, SupportedLocale } from '@/lib/localization';

class QuestionService {
  /**
   * Récupère la locale actuelle depuis le navigateur ou utilise 'fr' par défaut
   */
  private getCurrentLocale(): SupportedLocale {
    if (typeof window !== 'undefined') {
      const locale = document.documentElement.lang || navigator.language?.split('-')[0] || 'fr';
      return (locale === 'fr' || locale === 'en' || locale === 'ar') ? locale : 'fr';
    }
    return 'fr';
  }

  async getQuestionsByTheme(
    theme: QuestionTheme, 
    level?: UserLevel, 
    locale?: SupportedLocale
  ): Promise<Question[]> {
    const currentLocale = locale || this.getCurrentLocale();
    
    let query = supabase
      .from(TABLES.QUESTIONS)
      .select('*')
      .eq('theme', theme);

    if (level) {
      query = query.eq('complexity_level', level);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Extraire les traductions selon la locale
    return (data || []).map((q: QuestionRaw) => 
      extractLocalizedQuestion(q, currentLocale)
    ) as Question[];
  }

  async getQuestionsByType(
    type: QuestionType, 
    level?: UserLevel, 
    locale?: SupportedLocale
  ): Promise<Question[]> {
    const currentLocale = locale || this.getCurrentLocale();
    
    let query = supabase
      .from(TABLES.QUESTIONS)
      .select('*')
      .eq('type', type);

    if (level) {
      query = query.eq('complexity_level', level);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Extraire les traductions selon la locale
    return (data || []).map((q: QuestionRaw) => 
      extractLocalizedQuestion(q, currentLocale)
    ) as Question[];
  }

  async getQuestionsForExam(
    level: UserLevel, 
    isPremium: boolean = false,
    locale?: SupportedLocale
  ): Promise<Question[]> {
    const currentLocale = locale || this.getCurrentLocale();
    
    // Paralléliser les requêtes pour améliorer les performances
    // Récupérer 28 questions CONNAISSANCE et 12 questions SITUATION en parallèle
    const knowledgeQuery = supabase
      .from(TABLES.QUESTIONS)
      .select('*')
      .eq('type', QuestionType.CONNAISSANCE)
      .eq('complexity_level', level)
      .limit(EXAM_CONFIG.KNOWLEDGE_QUESTIONS);

    if (!isPremium) {
      knowledgeQuery.eq('is_premium', false);
    }

    const situationQuery = supabase
      .from(TABLES.QUESTIONS)
      .select('id, theme, type, level, complexity_level, content, options, correct_answer, explanation, scenario_context, is_premium')
      .eq('type', QuestionType.SITUATION)
      .eq('complexity_level', level)
      .limit(EXAM_CONFIG.SITUATION_QUESTIONS);

    if (!isPremium) {
      situationQuery.eq('is_premium', false);
    }

    // Exécuter les deux requêtes en parallèle au lieu de séquentiellement
    const [knowledgeResult, situationResult] = await Promise.all([
      knowledgeQuery,
      situationQuery
    ]);

    if (knowledgeResult.error) throw knowledgeResult.error;
    if (situationResult.error) throw situationResult.error;

    const knowledgeQuestions = knowledgeResult.data || [];
    const situationQuestions = situationResult.data || [];

    // Mélanger et retourner
    const allQuestions = [
      ...knowledgeQuestions,
      ...situationQuestions,
    ];

    // Extraire les traductions selon la locale
    const parsedQuestions = allQuestions.map((q: QuestionRaw) => {
      return extractLocalizedQuestion(q, currentLocale);
    }) as Question[];

    // Mélanger aléatoirement
    const shuffled = this.shuffleArray(parsedQuestions);
    
    return shuffled;
  }

  async getQuestionsForQuickQuiz(
    theme?: QuestionTheme, 
    level?: UserLevel,
    locale?: SupportedLocale
  ): Promise<Question[]> {
    const currentLocale = locale || this.getCurrentLocale();
    let query = supabase
      .from(TABLES.QUESTIONS)
      .select('*')
      .limit(EXAM_CONFIG.QUIZ_RAPIDE_QUESTIONS);

    if (theme) {
      query = query.eq('theme', theme);
    }

    if (level) {
      query = query.eq('complexity_level', level);
    }

    // Inclure au moins 2-3 questions SITUATION
    const { data, error } = await query;

    if (error) throw error;

    // Extraire les traductions selon la locale
    const questions = (data || []).map((q: QuestionRaw) => 
      extractLocalizedQuestion(q, currentLocale)
    ) as Question[];
    
    // S'assurer qu'il y a au moins 2 questions SITUATION
    const situationQuestions = questions.filter((q) => q.type === QuestionType.SITUATION);
    if (situationQuestions.length < 2) {
      // Ajouter des questions SITUATION si nécessaire
      const additionalSituations = await this.getQuestionsByType(QuestionType.SITUATION, level, currentLocale);
      const needed = 2 - situationQuestions.length;
      questions.push(...additionalSituations.slice(0, needed));
    }

    return this.shuffleArray(questions.slice(0, EXAM_CONFIG.QUIZ_RAPIDE_QUESTIONS));
  }

  async getQuestionById(
    questionId: string, 
    locale?: SupportedLocale
  ): Promise<Question | null> {
    const currentLocale = locale || this.getCurrentLocale();
    
    const { data, error } = await supabase
      .from(TABLES.QUESTIONS)
      .select('*')
      .eq('id', questionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    // Extraire les traductions selon la locale
    return extractLocalizedQuestion(data, currentLocale) as Question;
  }


  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export const questionService = new QuestionService();
