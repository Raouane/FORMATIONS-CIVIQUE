'use client';

/**
 * Composant InstallPrompt - Version différée
 * 
 * Ce composant ne s'affiche plus automatiquement.
 * Il capture l'événement beforeinstallprompt et le garde en réserve.
 * 
 * Pour déclencher l'installation, utilisez le hook useInstallPrompt
 * ou le composant InstallButton dans les endroits stratégiques :
 * - Après un paiement réussi
 * - Après un test réussi
 * - Dans le header/footer
 * - Dans le profil utilisateur
 * 
 * @example
 * import { InstallButton } from '@/components/features/navigation/InstallButton';
 * 
 * <InstallButton variant="ghost" compact />
 */

export function InstallPrompt() {
  // Ce composant ne fait plus rien visuellement
  // Il est conservé pour la compatibilité avec _app.tsx
  // L'installation est maintenant gérée par useInstallPrompt et InstallButton
  return null;
}
