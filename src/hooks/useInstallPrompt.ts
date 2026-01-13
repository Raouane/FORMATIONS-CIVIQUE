'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Détecte si l'utilisateur est sur iOS (iPhone/iPad)
 */
function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Ne pas afficher les instructions si déjà installé
  return isIOS && !isStandalone;
}

/**
 * Hook pour gérer l'installation PWA différée
 * Capture l'événement beforeinstallprompt et le garde en réserve
 * pour déclenchement manuel au bon moment
 * Gère également le cas iOS avec instructions spécifiques
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsInstalled(isStandalone);
      
      // Détecter iOS
      setIsIOS(isIOSDevice());
    }

    // Capturer l'événement beforeinstallprompt
    const handler = (e: Event) => {
      // Empêcher l'affichage automatique du bandeau du navigateur
      e.preventDefault();
      // Stocker l'événement pour utilisation ultérieure
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Nettoyer l'événement si l'app est installée
    const appInstalledHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  /**
   * Déclencher l'installation
   * @returns true si l'installation a été acceptée, false sinon
   */
  const promptInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      // Afficher le prompt d'installation natif
      await deferredPrompt.prompt();
      
      // Attendre la réponse de l'utilisateur
      const { outcome } = await deferredPrompt.userChoice;
      
      // Nettoyer l'événement après utilisation
      setDeferredPrompt(null);
      setIsInstallable(false);

      if (outcome === 'accepted') {
        setIsInstalled(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    isIOS,
    promptInstall,
  };
}
