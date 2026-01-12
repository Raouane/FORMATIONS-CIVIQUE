'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PremiumBadge({ className, size = 'md' }: PremiumBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-0.5 text-xs gap-1',
    lg: 'px-3 py-1 text-sm gap-1.5',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <div
      className={cn(
        'flex items-center rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-white font-bold shadow-sm',
        'animate-pulse hover:animate-none transition-all duration-300',
        'border border-amber-300/50',
        sizeClasses[size],
        className
      )}
    >
      <Sparkles className={iconSizes[size]} />
      <span>PREMIUM</span>
    </div>
  );
}
