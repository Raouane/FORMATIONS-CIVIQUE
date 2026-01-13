'use client';

import { useTranslation } from 'next-i18next';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AnswerOptionsProps {
  options: string[];
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  correctAnswer?: number | null; // Pour afficher la bonne réponse après soumission
  showFeedback?: boolean;
  disabled?: boolean;
}

export function AnswerOptions({
  options,
  selectedAnswer,
  onSelect,
  correctAnswer = null,
  showFeedback = false,
  disabled = false,
}: AnswerOptionsProps) {
  const { t } = useTranslation('exam');
  
  // Log pour déboguer
  console.log('[AnswerOptions] Options reçues:', {
    options,
    type: typeof options,
    isArray: Array.isArray(options),
    length: Array.isArray(options) ? options.length : 'N/A'
  });
  
  // S'assurer que options est un tableau
  const optionsArray = Array.isArray(options) ? options : [];
  
  if (optionsArray.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        {t('answers.noOptions')}
      </div>
    );
  }

  return (
    <RadioGroup
      value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}
      onValueChange={(value) => onSelect(parseInt(value, 10))}
      disabled={disabled}
      className="space-y-3"
    >
      {optionsArray.map((option, index) => {
        const isSelected = selectedAnswer === index;
        const isCorrect = correctAnswer === index;
        // Afficher les couleurs immédiatement si une réponse est sélectionnée
        const showImmediateFeedback = isSelected && correctAnswer !== null;
        const isWrong = isSelected && showImmediateFeedback && !isCorrect;

        return (
          <div
            key={index}
            className={cn(
              'flex items-start space-x-3 rtl:space-x-reverse p-4 rounded-lg border-2 transition-all',
              // Si une réponse est sélectionnée et qu'on connaît la bonne réponse, afficher les couleurs
              showImmediateFeedback && isCorrect && 'border-green-500 bg-green-50',
              showImmediateFeedback && isWrong && 'border-red-500 bg-red-50',
              // Si pas de feedback immédiat mais sélectionné, style par défaut
              isSelected && !showImmediateFeedback && 'border-primary bg-primary/5',
              // Si showFeedback est true, toujours mettre en évidence la bonne réponse
              showFeedback && isCorrect && 'border-green-500 bg-green-50',
              disabled && 'opacity-60 cursor-not-allowed',
              !disabled && 'cursor-pointer hover:bg-gray-50'
            )}
            onClick={() => {
              if (disabled) return;
              onSelect(index);
            }}
          >
            <RadioGroupItem
              value={index.toString()}
              id={`option-${index}`}
              className="mt-1"
            />
            <Label
              htmlFor={`option-${index}`}
              className={cn(
                'flex-1 cursor-pointer text-left rtl:text-right',
                // Couleurs immédiates si feedback disponible
                showImmediateFeedback && isCorrect && 'text-green-700 font-semibold',
                showImmediateFeedback && isWrong && 'text-red-700',
                // Couleurs avec showFeedback (pour la page de résultats)
                showFeedback && isCorrect && 'text-green-700 font-semibold',
                showFeedback && isWrong && 'text-red-700'
              )}
            >
              {option}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
