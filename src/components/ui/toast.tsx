'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'success' | 'error';
}

export function Toast({
  open,
  onOpenChange,
  title,
  description,
  duration = 5000,
  variant = 'default',
}: ToastProps) {
  React.useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onOpenChange]);

  if (!open) return null;

  const variantStyles = {
    default: 'bg-background border-border',
    success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    error: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
  };

  return (
    <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-5 fade-in-0 duration-300">
      <div
        className={cn(
          'flex items-start gap-3 rounded-lg border p-4 shadow-lg max-w-md',
          variantStyles[variant]
        )}
      >
        <div className="flex-1">
          {title && (
            <div className="font-semibold text-sm mb-1">{title}</div>
          )}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
        <button
          onClick={() => onOpenChange(false)}
          className="rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
