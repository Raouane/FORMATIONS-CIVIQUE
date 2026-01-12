import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Header } from '@/components/features/home/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { QuestionTheme, UserLevel } from '@/types/database';
import { THEMES_DATA } from '@/lib/constants';
import { BookOpen, Play, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getRevisionChapters, RevisionChapter } from '@/services/revisionChapterService';
import { REVISION_CONTENT } from '@/lib/revision-content'; // Fallback si BD vide

export default function RevisionPage() {
  const router = useRouter();
  const { t } = useTranslation('revision');
  const [selectedLevel, setSelectedLevel] = useState<UserLevel | 'all'>('all');
  const [chapters, setChapters] = useState<RevisionChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = (router.locale || 'fr') as 'fr' | 'en' | 'ar';

  // Charger les chapitres depuis la BD
  useEffect(() => {
    async function loadChapters() {
      try {
        const loaded = await getRevisionChapters(locale);
        if (loaded.length > 0) {
          setChapters(loaded);
        } else {
          // Fallback sur REVISION_CONTENT si la BD est vide
          console.warn('[Revision] Aucun chapitre dans la BD, utilisation du fallback');
          setChapters(REVISION_CONTENT.map(ch => ({
            id: ch.id,
            theme: ch.theme,
            level: ch.level,
            title: ch.title,
            content: ch.content,
            order: ch.order,
          })));
        }
      } catch (error) {
        console.error('[Revision] Erreur chargement BD, utilisation du fallback:', error);
        // Fallback sur REVISION_CONTENT en cas d'erreur
        setChapters(REVISION_CONTENT.map(ch => ({
          id: ch.id,
          theme: ch.theme,
          level: ch.level,
          title: ch.title,
          content: ch.content,
          order: ch.order,
        })));
      } finally {
        setLoading(false);
      }
    }

    loadChapters();
  }, [locale]);

  // Filtrer le contenu par niveau si sélectionné
  const filteredContent = useMemo(() => {
    if (!chapters || chapters.length === 0) {
      return [];
    }
    return selectedLevel === 'all'
      ? chapters
      : chapters.filter((chapter) => chapter.level === selectedLevel);
  }, [chapters, selectedLevel]);

  // Grouper le contenu par thème
  const contentByTheme = useMemo(() => {
    return filteredContent.reduce((acc, chapter) => {
      if (!acc[chapter.theme]) {
        acc[chapter.theme] = [];
      }
      acc[chapter.theme].push(chapter);
      return acc;
    }, {} as Record<QuestionTheme, RevisionChapter[]>);
  }, [filteredContent]);

  // Obtenir les informations du thème
  const getThemeInfo = (theme: QuestionTheme) => {
    return THEMES_DATA.find((t) => t.id === theme);
  };

  // Rendre le contenu markdown en HTML simple
  const renderContent = (content: string) => {
    // Conversion simple du markdown en HTML
    let html = content
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br />');

    // Wrapper les listes
    html = html.replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-6 mb-4">$1</ul>');
    html = html.replace(/<\/ul>\s*<ul/g, '');

    return `<div class="prose max-w-none"><p class="mb-4">${html}</p></div>`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('loading', { ns: 'common' }) || 'Chargement...'}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2 rtl-flip" />
                {t('buttons.back', { ns: 'common' }) || 'Retour'}
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {t('title')}
              </h1>
              <p className="text-muted-foreground">
                {t('description')}
              </p>
            </div>
          </div>

          {/* Filtre par niveau */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm font-medium">{t('level.label')}:</span>
            <Button
              variant={selectedLevel === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLevel('all')}
            >
              {t('all')}
            </Button>
            <Button
              variant={selectedLevel === UserLevel.A2 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLevel(UserLevel.A2)}
            >
              {t('level.a2')}
            </Button>
            <Button
              variant={selectedLevel === UserLevel.B1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLevel(UserLevel.B1)}
            >
              {t('level.b1')}
            </Button>
            <Button
              variant={selectedLevel === UserLevel.B2 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLevel(UserLevel.B2)}
            >
              {t('level.b2')}
            </Button>
          </div>
        </div>

        {/* Contenu par thème */}
        <div className="space-y-6">
          {Object.entries(contentByTheme).map(([theme, themeChapters]) => {
            const themeInfo = getThemeInfo(theme as QuestionTheme);
            if (!themeInfo) return null;

            return (
              <Card key={theme}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">
                        {t(`themes.${theme.toLowerCase()}.name`, { 
                          defaultValue: themeInfo.name 
                        })}
                      </CardTitle>
                      <CardDescription>
                        {t(`themes.${theme.toLowerCase()}.description`, { 
                          defaultValue: themeInfo.description 
                        })}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {themeChapters.length} {themeChapters.length > 1 ? t('chapters') : t('chapter')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {themeChapters
                      .sort((a, b) => a.order - b.order)
                      .map((chapter) => (
                        <AccordionItem key={chapter.id} value={chapter.id}>
                          <AccordionTrigger className="text-left rtl:text-right">
                            <div className="flex items-center gap-3">
                              <BookOpen className="h-5 w-5 text-primary" />
                              <span className="font-semibold">
                                {t(`chapterTitles.${chapter.id}`, { defaultValue: chapter.title })}
                              </span>
                              <Badge variant="outline" className="ml-auto rtl:ml-0 rtl:mr-auto">
                                {chapter.level}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div
                              className="prose max-w-none mt-4"
                              dangerouslySetInnerHTML={{
                                __html: renderContent(chapter.content),
                              }}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bouton Quiz Rapide */}
        <Card className="mt-8 bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              {t('quickQuiz.button')}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              {t('quickQuiz.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push('/quiz-rapide')}
              className="w-full md:w-auto"
            >
              <Play className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('quickQuiz.button')}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'fr', ['common', 'revision'])),
    },
  };
};
