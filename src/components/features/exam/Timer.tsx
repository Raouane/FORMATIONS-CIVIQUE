'use client';

import { formatTime } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  timeRemaining: number; // en secondes
  className?: string;
}

export function Timer({ timeRemaining, className }: TimerProps) {
  const isWarning = timeRemaining < 300; // Moins de 5 minutes

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg border',
        isWarning
          ? 'bg-red-50 border-red-200 text-red-700'
          : 'bg-blue-50 border-blue-200 text-blue-700',
        className
      )}
    >
      <Clock className="h-4 w-4" />
      <span className="font-mono font-semibold text-lg">
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
}
