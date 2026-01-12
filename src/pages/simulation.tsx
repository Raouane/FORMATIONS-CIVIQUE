import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useAuth } from '@/providers/AuthProvider';
import { useExamSession } from '@/hooks/useExamSession';
import { UserLevel } from '@/types';
import { Header } from '@/components/features/home/Header';
import { Timer } from '@/components/features/exam/Timer';
import { ProgressBar } from '@/components/features/exam/ProgressBar';
import { QuestionCard } from '@/components/features/exam/QuestionCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
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
import { useState, useEffect } from 'react';
import { EXAM_CONFIG } from '@/lib/constants';

export default function SimulationPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation('exam');
  const { user } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);


  // Récupérer le niveau depuis l'URL ou utiliser A2 par défaut
  const level = (router.query.level as UserLevel) || UserLevel.A2;

  const {
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
    loading,
  } = useExamSession(level, EXAM_CONFIG.TOTAL_QUESTIONS);

  // Authentification optionnelle pour l'instant
  // if (!user && !loading) {
  //   router.push('/auth/login');
  //   return null;
  // }

  if (loading) {
    const loadingText = t('loading');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{loadingText || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    const noQuestionsText = t('noQuestions');
    const backHomeText = t('backHome');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {noQuestionsText || 'Aucune question disponible pour ce niveau.'}
          </p>
          <Button onClick={() => {
            const locale = router.locale || 'fr';
            router.push('/', '/', { locale });
          }}>{backHomeText || 'Retour à l\'accueil'}</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers.find(
    (a) => a.questionId === currentQuestion.id
  )?.answerIndex ?? null;

  const handleFinish = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmFinish = async () => {
    setShowConfirmDialog(false);
    await submitExam();
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = answers.length;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
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
            showFeedback={selectedAnswer !== null}
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
            <ChevronLeft className="h-4 w-4 rtl-flip" />
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
            <AlertDialogTitle>{t('navigation.dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('navigation.confirmFinish')}
              <br />
              <br />
              {t('navigation.dialog.description', { answered: answeredCount, total: totalQuestions })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('navigation.dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmFinish}>
              {t('navigation.dialog.confirm')}
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
