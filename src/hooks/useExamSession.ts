import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Question, UserLevel, ExamResult } from '@/types/database';
import { examService } from '@/services/examService';
import { EXAM_CONFIG } from '@/lib/constants';
import { SupportedLocale } from '@/lib/localization';

interface Answer {
  questionId: string;
  answerIndex: number;
}

interface UseExamSessionReturn {
  currentQuestionIndex: number;
  questions: Question[];
  answers: Answer[];
  timeRemaining: number;
  isCompleted: boolean;
  startedAt: Date | null;
  selectAnswer: (questionId: string, answerIndex: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  submitExam: () => Promise<void>;
  pauseTimer: () => void;
  resumeTimer: () => void;
  loading: boolean;
}

export function useExamSession(level: UserLevel, totalQuestions: number = EXAM_CONFIG.TOTAL_QUESTIONS): UseExamSessionReturn {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(EXAM_CONFIG.TIME_LIMIT);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  // Déterminer la locale actuelle
  const getCurrentLocale = (): SupportedLocale => {
    const locale = router.locale || i18n.language || 'fr';
    return (locale === 'fr' || locale === 'en' || locale === 'ar') ? locale : 'fr';
  };

  // Récupérer le niveau depuis l'URL si disponible, sinon utiliser le paramètre
  const effectiveLevel = (router.query.level as UserLevel) || level;

  // Charger les questions au montage
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const locale = getCurrentLocale();
        const loadedQuestions = await examService.startExamSession(effectiveLevel, locale);
        setQuestions(loadedQuestions);
        setStartedAt(new Date());
        setLoading(false);
      } catch (error) {
        console.error('Error loading questions:', error);
        setLoading(false);
      }
    };

    loadQuestions();
  }, [effectiveLevel, router.locale, i18n.language, router.query.level]);

  // Timer décompte
  useEffect(() => {
    if (isCompleted || loading || isTimerPaused || !startedAt) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit si timer atteint 0
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCompleted, loading, isTimerPaused, startedAt]);

  const selectAnswer = useCallback((questionId: string, answerIndex: number) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId, answerIndex };
        return updated;
      }
      return [...prev, { questionId, answerIndex }];
    });
  }, []);

  const goToNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Dernière question, permettre soumission
      setIsCompleted(true);
    }
  }, [currentQuestionIndex, questions.length]);

  const goToPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const submitExam = useCallback(async () => {
    if (questions.length === 0) return;

    setIsCompleted(true);
    setIsTimerPaused(true);

    // Calculer le score
    let correctCount = 0;
    const questionsAnswered = questions.map((question, index) => {
      const answer = answers.find((a) => a.questionId === question.id);
      const isCorrect = answer?.answerIndex === question.correct_answer;
      if (isCorrect) correctCount++;
      return {
        questionId: question.id,
        answerIndex: answer?.answerIndex ?? -1,
        isCorrect,
      };
    });

    const score = correctCount;
    const percentage = Math.round((score / questions.length) * 100);
    const timeSpent = startedAt ? Math.floor((new Date().getTime() - startedAt.getTime()) / 1000) : 0;
    const passed = percentage >= EXAM_CONFIG.PASSING_SCORE;

    try {
      // Sauvegarder le résultat (fonctionne avec ou sans utilisateur)
      await examService.submitExamResult({
        score,
        percentage,
        timeSpent,
        passed,
        level,
        questionsAnswered,
      });

      // Rediriger vers la page de résultats
      router.push('/results');
    } catch (error) {
      console.error('Error submitting exam:', error);
      // Même en cas d'erreur, rediriger vers les résultats (données en localStorage)
      router.push('/results');
    }
  }, [questions, answers, startedAt, level, router]);

  const pauseTimer = useCallback(() => {
    setIsTimerPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsTimerPaused(false);
  }, []);

  return {
    currentQuestionIndex,
    questions,
    answers,
    timeRemaining,
    isCompleted,
    startedAt,
    selectAnswer,
    goToNext,
    goToPrevious,
    submitExam,
    pauseTimer,
    resumeTimer,
    loading,
  };
}
