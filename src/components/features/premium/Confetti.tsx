'use client';

import { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
}

export function Confetti({ trigger, duration = 3000 }: ConfettiProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  if (!show) return null;

  const confettiColors = [
    '#FFD700', // Gold
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Light Salmon
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-[99] overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 2 + Math.random() * 2;
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];

        return (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-sm animate-confetti-fall"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}
