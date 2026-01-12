import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface UseTextToSpeechReturn {
  isPlaying: boolean;
  isPaused: boolean;
  isLanguageSupported: boolean;
  speak: (text: string, language?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLanguageSupported, setIsLanguageSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const router = useRouter();

  // Détection automatique de la langue depuis le router
  const getLanguage = (): string => {
    const locale = router.locale || 'fr';
    
    // Mapping des locales vers les codes de langue pour la synthèse vocale
    switch (locale) {
      case 'en':
        return 'en-US';
      case 'ar':
        return 'ar-SA'; // Arabe (Saudi Arabia) - supporté par la plupart des navigateurs
      case 'fr':
      default:
        return 'fr-FR';
    }
  };

  // Fonction pour obtenir les voix disponibles
  const getAvailableVoices = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return [];
    }
    return window.speechSynthesis.getVoices();
  };

  // Fonction pour vérifier si une langue est supportée
  const checkLanguageSupport = (langCode: string): boolean => {
    const voices = getAvailableVoices();
    if (voices.length === 0) return false;
    
    return voices.some(voice => {
      const voiceLang = voice.lang.split('-')[0].toLowerCase();
      return voiceLang === langCode.toLowerCase();
    });
  };

  const speak = (text: string, language?: string) => {
    // Vérifier si l'API est supportée
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech Synthesis API not supported');
      return;
    }

    // Arrêter toute lecture en cours
    stop();

    // Détecter la langue automatiquement si non fournie
    const detectedLanguage = language || getLanguage();
    const langCode = detectedLanguage.split('-')[0]; // 'ar', 'en', 'fr'
    
    // Obtenir les voix disponibles
    const voices = getAvailableVoices();
    
    // Vérifier si la langue est disponible dans le navigateur
    const hasLanguageSupport = checkLanguageSupport(langCode);
    setIsLanguageSupported(hasLanguageSupport);
    
    if (!hasLanguageSupport && voices.length > 0) {
      console.warn(`⚠️ Language ${detectedLanguage} is not supported by any installed voice. Available voices:`, 
        [...new Set(voices.map(v => v.lang))].join(', '));
      console.warn(`💡 The text will be read with the default voice, which may not pronounce ${detectedLanguage} correctly.`);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = detectedLanguage;
    utterance.rate = 1.0;
    utterance.volume = 1.0;
    utterance.pitch = 1.0;
    
    // Essayer de trouver une voix appropriée pour la langue
    if (voices.length > 0) {
      // Chercher d'abord une voix exacte pour la langue
      let preferredVoice = voices.find(voice => {
        const voiceLang = voice.lang.split('-')[0].toLowerCase();
        return voiceLang === langCode.toLowerCase();
      });
      
      // Si pas trouvé, chercher une voix qui contient le code de langue
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
          voice.lang.toLowerCase().includes(langCode.toLowerCase())
        );
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log(`Using voice: ${preferredVoice.name} (${preferredVoice.lang}) for language: ${detectedLanguage}`);
      } else {
        console.warn(`No voice found for language ${detectedLanguage}, using default voice`);
      }
    }

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

  // Charger les voix disponibles au montage et lors du changement de langue
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Forcer le chargement des voix (certains navigateurs ne les chargent qu'après une interaction)
    const loadVoices = () => {
      // Appeler getVoices() pour forcer le chargement
      window.speechSynthesis.getVoices();
    };

    // Charger immédiatement
    loadVoices();

    // Écouter l'événement voiceschanged (quand les voix sont chargées)
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [router.locale]);

  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return {
    isPlaying,
    isPaused,
    isLanguageSupported,
    speak,
    pause,
    resume,
    stop,
  };
}
