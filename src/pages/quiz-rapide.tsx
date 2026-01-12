import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useAuth } from '@/providers/AuthProvider';
import { UserLevel } from '@/types';
import { SupportedLocale } from '@/lib/localization';
import { Header } from '@/components/features/home/Header';
import { Timer } from '@/components/features/exam/Timer';
import { ProgressBar } from '@/components/features/exam/ProgressBar';
import { QuestionCard } from '@/components/features/exam/QuestionCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState, useEffect, useCallback } from 'react';
import { EXAM_CONFIG } from '@/lib/constants';
import { Question } from '@/types/database';
import { questionService } from '@/services/questionService';
import { examService } from '@/services/examService';
import { supabase, TABLES } from '@/lib/supabase';

interface Answer {
  questionId: string;
  answerIndex: number;
}

export default function QuizRapidePage() {
  const router = useRouter();
  const { t, i18n } = useTranslation('exam');
  const { user } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(EXAM_CONFIG.QUIZ_RAPIDE_TIME);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupérer le niveau depuis l'URL ou utiliser A2 par défaut
  const level = (router.query.level as UserLevel) || UserLevel.A2;

  // Déterminer la locale actuelle
  const getCurrentLocale = (): SupportedLocale => {
    const locale = router.locale || i18n.language || 'fr';
    return (locale === 'fr' || locale === 'en' || locale === 'ar') ? locale : 'fr';
  };

  // Charger les questions au montage
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Récupérer le statut premium de l'utilisateur
        const { data: { user: authUser } } = await supabase.auth.getUser();
        let isPremium = false;

        if (authUser) {
          const { data: profile } = await supabase
            .from(TABLES.PROFILES)
            .select('is_premium')
            .eq('id', authUser.id)
            .single();

          isPremium = profile?.is_premium ?? false;
        }

        // Récupérer les questions pour le quiz rapide avec la locale
        const locale = getCurrentLocale();
        const loadedQuestions = await questionService.getQuestionsForQuickQuiz(undefined, level, locale);
        setQuestions(loadedQuestions);
        setStartedAt(new Date());
        setLoading(false);
      } catch (error) {
        console.error('Error loading questions:', error);
        setLoading(false);
      }
    };

    loadQuestions();
  }, [level, router.locale, i18n.language]);

  // Timer décompte
  useEffect(() => {
    if (isCompleted || loading || !startedAt) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit si timer atteint 0
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCompleted, loading, startedAt]);

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

  const handleSubmitExam = useCallback(async () => {
    if (questions.length === 0) return;

    setIsCompleted(true);

    // Calculer le score
    let correctCount = 0;
    const questionsAnswered = questions.map((question) => {
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
    const passed = percentage >= 70; // 70% pour le quiz rapide (7/10)

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
      console.error('Error submitting quiz:', error);
      // Même en cas d'erreur, rediriger vers les résultats (données en localStorage)
      router.push('/results');
    }
  }, [questions, answers, startedAt, level, router]);

  const handleFinish = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmFinish = async () => {
    setShowConfirmDialog(false);
    await handleSubmitExam();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {t('noQuestions')}
          </p>
          <Button onClick={() => router.push('/')}>{t('backHome')}</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers.find(
    (a) => a.questionId === currentQuestion.id
  )?.answerIndex ?? null;

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = answers.length;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        {/* Badge Quiz Rapide */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/revision')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            ⚡ Quiz Rapide
          </div>
        </div>

        {/* En-tête avec Timer et Progress */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Timer timeRemaining={timeRemaining} />
            <Button
              variant="outline"
              onClick={handleFinish}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {t('navigation.finish')}
            </Button>
          </div>
          <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
        </div>

        {/* Carte de question */}
        <Card className="p-6 md:p-8">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={(index) =>
              selectAnswer(currentQuestion.id, index)
            }
            disabled={isCompleted}
          />
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0 || isCompleted}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('navigation.previous')}
          </Button>

          <div className="text-sm text-muted-foreground">
            {answeredCount} / {totalQuestions} {t('navigation.answered')}
          </div>

          {isLastQuestion ? (
            <Button
              onClick={handleFinish}
              disabled={isCompleted}
              className="flex items-center gap-2"
            >
              {t('navigation.finish')}
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={goToNext}
              disabled={isCompleted}
              className="flex items-center gap-2"
            >
              {t('navigation.next')}
              <ChevronRight className="h-4 w-4 rtl-flip" />
            </Button>
          )}
        </div>
      </main>

      {/* Dialog de confirmation */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('quiz.dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('navigation.confirmFinish')}
              <br />
              <br />
              {t('quiz.dialog.description', { answered: answeredCount, total: totalQuestions })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('quiz.dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmFinish}>
              {t('quiz.dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'fr', ['common', 'exam'])),
    },
  };
};
