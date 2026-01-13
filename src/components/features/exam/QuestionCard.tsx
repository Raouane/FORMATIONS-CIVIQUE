'use client';

import { useTranslation } from 'next-i18next';
import { Question } from '@/types';
import { AnswerOptions } from './AnswerOptions';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  showFeedback?: boolean;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  showFeedback = false,
  disabled = false,
}: QuestionCardProps) {
  const { t } = useTranslation('exam');
  const { isPlaying, isPaused, isLanguageSupported, speak, pause, resume, stop } = useTextToSpeech();

  const handleReadAloud = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      // Avertir l'utilisateur si la langue n'est pas supportée, mais permettre la lecture
      if (!isLanguageSupported) {
        console.warn('⚠️ No voice available for this language. The text will be read with the default voice, which may not pronounce it correctly.');
      }
      speak(question.content);
    }
  };

  return (
    <div className="space-y-6">
      {/* Question */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4 rtl:flex-row-reverse">
          <h2 className="text-xl font-semibold text-gray-900 flex-1 break-words text-left rtl:text-right">
            {question.content}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={handleReadAloud}
            className={cn(
              "shrink-0",
              !isLanguageSupported && "opacity-75"
            )}
            disabled={disabled}
            title={!isLanguageSupported ? (t('speech.notSupported') || 'Aucune voix spécifique disponible. La lecture utilisera la voix par défaut.') : undefined}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : isPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Mise en situation (si question de type SITUATION) */}
        {question.type === 'SITUATION' && question.scenario_context && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">
              {t('situation.label')}
            </p>
            <p className="text-sm text-blue-800">{question.scenario_context}</p>
          </div>
        )}
      </div>

      {/* Options de réponse */}
      <AnswerOptions
        options={question.options}
        selectedAnswer={selectedAnswer}
        onSelect={onSelectAnswer}
        correctAnswer={question.correct_answer}
        showFeedback={showFeedback}
        disabled={disabled}
      />

      {/* Explication (après soumission) */}
      {showFeedback && question.explanation && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {t('explanation.label')} :
          </p>
          <p className="text-sm text-gray-700 break-words">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
