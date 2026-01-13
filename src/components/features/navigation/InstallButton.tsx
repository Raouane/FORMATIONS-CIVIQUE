'use client';

import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { IOSInstallInstructions } from './IOSInstallInstructions';
import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface InstallButtonProps {
  variant?: 'default' | 'ghost' | 'outline' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
  compact?: boolean;
  showIOSInstructions?: boolean; // Afficher les instructions iOS au clic
}

/**
 * Bouton d'installation PWA discret et élégant
 * S'affiche uniquement si l'app est installable et non déjà installée
 */
export function InstallButton({
  variant = 'ghost',
  size = 'default',
  className = '',
  showIcon = true,
  showText = true,
  compact = false,
  showIOSInstructions = false,
}: InstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, promptInstall } = useInstallPrompt();
  const [isInstalling, setIsInstalling] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  // Ne rien afficher si l'app est déjà installée
  if (isInstalled) {
    return null;
  }

  // Sur iOS, afficher le bouton même si beforeinstallprompt n'est pas disponible
  // Le bouton affichera les instructions au clic
  const shouldShow = isInstallable || (isIOS && !isInstalled);
  
  if (!shouldShow) {
    return null;
  }

  const handleClick = async () => {
    // Si iOS, afficher les instructions au lieu du prompt natif
    if (isIOS) {
      if (showIOSInstructions) {
        setShowIOSModal(true);
      } else {
        // Si showIOSInstructions est false, on peut quand même afficher un message
        alert('Pour installer sur iPhone/iPad :\n\n1. Appuyez sur Partager (icône carrée avec flèche)\n2. Sélectionnez "Sur l\'écran d\'accueil"\n3. Confirmez avec "Ajouter"');
      }
      return;
    }

    // Pour Android/Chrome, utiliser le prompt natif
    setIsInstalling(true);
    try {
      await promptInstall();
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  if (compact) {
    return (
      <>
        <Button
          variant={variant}
          size={size}
          onClick={handleClick}
          disabled={isInstalling}
          className={className}
          title={isIOS ? "Voir les instructions d'installation iOS" : "Installer l'application mobile"}
        >
          {showIcon && <Smartphone className="h-4 w-4" />}
        </Button>
        {showIOSModal && showIOSInstructions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="max-w-md w-full">
              <IOSInstallInstructions onClose={() => setShowIOSModal(false)} />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isInstalling}
        className={className}
      >
        {showIcon && <Download className="h-4 w-4 mr-2" />}
        {showText && (isInstalling ? 'Installation...' : isIOS ? 'Installer (iOS)' : 'Installer l\'app')}
      </Button>
      {showIOSModal && showIOSInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="max-w-md w-full">
            <IOSInstallInstructions onClose={() => setShowIOSModal(false)} />
          </div>
        </div>
      )}
    </>
  );
}
