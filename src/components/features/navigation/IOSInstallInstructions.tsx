'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Share2, Plus } from 'lucide-react';

interface IOSInstallInstructionsProps {
  onClose?: () => void;
  compact?: boolean;
}

/**
 * Instructions d'installation spécifiques pour iOS (iPhone/iPad)
 * Safari ne supporte pas beforeinstallprompt, donc on affiche des instructions manuelles
 */
export function IOSInstallInstructions({ onClose, compact = false }: IOSInstallInstructionsProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    // Ne plus afficher pendant cette session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ios-install-dismissed', 'true');
    }
    onClose?.();
  };

  if (compact) {
    return (
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm">
        <div className="flex items-start gap-2">
          <Share2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium mb-1">Installer sur iPhone/iPad</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-xs">
              <li>Appuyez sur <strong>Partager</strong> <Share2 className="h-3 w-3 inline" /></li>
              <li>Sélectionnez <strong>Sur l'écran d'accueil</strong> <Plus className="h-3 w-3 inline" /></li>
            </ol>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={handleClose}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="border-primary bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Installer sur iPhone/iPad
          </CardTitle>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">
          Safari ne permet pas l'installation automatique. Suivez ces étapes simples :
        </CardDescription>
        <ol className="space-y-3 mb-4">
          <li className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Appuyez sur le bouton <strong>Partager</strong></p>
              <p className="text-sm text-muted-foreground">
                Trouvez l'icône <Share2 className="h-4 w-4 inline text-primary" /> en bas de l'écran Safari
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Sélectionnez <strong>"Sur l'écran d'accueil"</strong></p>
              <p className="text-sm text-muted-foreground">
                Faites défiler le menu et appuyez sur <Plus className="h-4 w-4 inline text-primary" /> <strong>"Sur l'écran d'accueil"</strong>
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Confirmez l'installation</p>
              <p className="text-sm text-muted-foreground">
                Appuyez sur <strong>"Ajouter"</strong> en haut à droite
              </p>
            </div>
          </li>
        </ol>
        <p className="text-xs text-muted-foreground italic">
          💡 L'application apparaîtra sur votre écran d'accueil comme une app native
        </p>
      </CardContent>
    </Card>
  );
}
