import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface UseTextToSpeechReturn {
  isPlaying: boolean;
  isPaused: boolean;
  speak: (text: string, language?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const router = useRouter();

  // Détection automatique de la langue depuis le router
  const getLanguage = (): string => {
    const locale = router.locale || 'fr';
    return locale === 'en' ? 'en-US' : 'fr-FR';
  };

  const speak = (text: string, language?: string) => {
    // Vérifier si l'API est supportée
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech Synthesis API not supported');
      return;
    }

    // Arrêter toute lecture en cours
    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language || getLanguage();
    utterance.rate = 1.0;
    utterance.volume = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (error) => {
      // Les erreurs 'interrupted' sont normales (quand une nouvelle synthèse démarre)
      // ou quand l'utilisateur arrête manuellement la lecture
      if (error.error !== 'interrupted' && error.error !== 'canceled') {
        console.warn('Speech synthesis error:', error.error, error);
      }
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Annuler toutes les synthèses en cours
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  };

  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return {
    isPlaying,
    isPaused,
    speak,
    pause,
    resume,
    stop,
  };
}
