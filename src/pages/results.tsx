import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { examService } from '@/services/examService';
import { questionService } from '@/services/questionService';
import { ExamResult, Question, QuestionTheme } from '@/types';
import { SupportedLocale } from '@/lib/localization';
import { Header } from '@/components/features/home/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Home, RotateCcw, BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import { formatTime, getThemeColor, cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { QuestionCard } from '@/components/features/exam/QuestionCard';
import { CircularProgress } from '@/components/ui/circular-progress';
import { PremiumCTA } from '@/components/features/premium/PremiumCTA';

export default function ResultsPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation('results');
  const { user, isPremium } = useAuth();
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);

  // Déterminer la locale actuelle
  const getCurrentLocale = (): SupportedLocale => {
    const locale = router.locale || i18n.language || 'fr';
    return (locale === 'fr' || locale === 'en' || locale === 'ar') ? locale : 'fr';
  };

  useEffect(() => {
    // Authentification optionnelle pour l'instant
    // if (!user) {
    //   router.push('/auth/login');
    //   return;
    // }

    const loadResults = async () => {
      try {
        const result = await examService.getLatestExamResult();
        if (!result) {
          router.push('/');
          return;
        }

        setExamResult(result);

        // Charger les questions pour afficher les détails
        const questionIds = result.questions_answered.map((q) => q.questionId);
        const loadedQuestions: Question[] = [];

        for (const questionId of questionIds) {
          const question = await questionService.getQuestionById(questionId);
          if (question) {
            loadedQuestions.push(question);
          }
        }

        setQuestions(loadedQuestions);
      } catch (error) {
        console.error('Error loading results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [user, router, router.locale, i18n.language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!examResult) {
    return null;
  }

  // Calculer les statistiques par thème
  const themeStats: Record<QuestionTheme, { correct: number; total: number }> = {
    VALEURS: { correct: 0, total: 0 },
    DROITS: { correct: 0, total: 0 },
    HISTOIRE: { correct: 0, total: 0 },
    POLITIQUE: { correct: 0, total: 0 },
    SOCIETE: { correct: 0, total: 0 },
  };

  examResult.questions_answered.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (question) {
      themeStats[question.theme].total++;
      if (answer.isCorrect) {
        themeStats[question.theme].correct++;
      }
    }
  });

  const filteredQuestions = showOnlyErrors
    ? questions.filter((q) => {
        const answer = examResult.questions_answered.find((a) => a.questionId === q.id);
        return answer && !answer.isCorrect;
      })
    : questions;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Verdict */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{t('title')}</CardTitle>
              {examResult.passed ? (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle2 className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('verdict.passed')}
                </Badge>
              ) : (
                <Badge className="bg-red-500 text-white">
                  <XCircle className="h-4 w-4 mr-2" />
                  {t('verdict.failed')}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <CircularProgress
                  value={examResult.percentage}
                  size={180}
                  strokeWidth={14}
                  className="mb-4"
                  showLabel={true}
                  variant={examResult.passed ? 'success' : 'error'}
                >
                  <div className="text-center">
                    <div className={cn(
                      "text-4xl font-bold",
                      examResult.passed ? "text-green-600" : "text-red-600"
                    )}>
                      {examResult.score}/40
                    </div>
                    <div className="text-xl text-muted-foreground mt-1 font-semibold">
                      {examResult.percentage}%
                    </div>
                  </div>
                </CircularProgress>
                <p className="text-lg text-muted-foreground text-center max-w-md">
                  {examResult.passed
                    ? t('verdict.message.passed', { percentage: examResult.percentage })
                    : t('verdict.message.failed', { percentage: examResult.percentage })}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Temps passé</p>
                  <p className="text-lg font-semibold">{formatTime(examResult.time_spent)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Niveau</p>
                  <p className="text-lg font-semibold">{examResult.level}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium CTA - Affiché après le verdict avec animation */}
        <div className="mb-8">
          <PremiumCTA examResult={examResult} />
        </div>

        {/* Progression par thème */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t('themes.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(Object.keys(themeStats) as QuestionTheme[]).map((theme) => {
                const stats = themeStats[theme];
                const percentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                const themeName = t(`themes.${theme.toLowerCase()}`);

                return (
                  <div key={theme} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{themeName}</span>
                      <span className="text-sm text-muted-foreground">
                        {stats.correct}/{stats.total} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getThemeColor(theme),
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Détail des questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t('questions.title')}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={showOnlyErrors ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowOnlyErrors(true)}
                >
                  {t('questions.errors')}
                </Button>
                <Button
                  variant={!showOnlyErrors ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowOnlyErrors(false)}
                >
                  {t('questions.all')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredQuestions.map((question, index) => {
                const answer = examResult.questions_answered.find((a) => a.questionId === question.id);
                const isCorrect = answer?.isCorrect ?? false;

                return (
                  <AccordionItem key={question.id} value={`question-${index}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3 text-left rtl:text-right">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                        )}
                        <span className="font-medium">
                          {t('questions.question', { number: index + 1 })}: {question.content.substring(0, 60)}...
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <QuestionCard
                        question={question}
                        selectedAnswer={answer?.answerIndex ?? null}
                        onSelectAnswer={() => {}}
                        showFeedback={true}
                        disabled={true}
                      />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button onClick={() => router.push('/')} variant="outline">
            <Home className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('actions.backHome')}
          </Button>
          <Button onClick={() => {
            const locale = router.locale || 'fr';
            router.push('/simulation', '/simulation', { locale });
          }}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('actions.retry')}
          </Button>
          {!examResult.passed && (
            <Button onClick={() => router.push('/revision')} variant="outline">
              <BookOpen className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('actions.reviewErrors')}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'fr', ['common', 'results', 'exam'])),
    },
  };
};
