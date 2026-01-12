import { useRouter } from 'next/router';
import { useAuth } from '@/providers/AuthProvider';
import { UserLevel } from '@/types/database';
import { examService } from '@/services/examService';

export function useNavigation() {
  const router = useRouter();
  const { user } = useAuth();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const startPath = async (level: UserLevel) => {
    // Authentification optionnelle pour l'instant
    // if (!user) {
    //   router.push('/auth/login');
    //   return;
    // }

    // Naviguer immédiatement pour un feedback instantané
    // Les questions seront chargées par useExamSession sur la page simulation
    const locale = router.locale || 'fr';
    
    // Passer le niveau dans l'URL pour que useExamSession le récupère
    router.push(`/simulation?level=${level}`, `/simulation?level=${level}`, { locale });
    
    // Précharger les questions en arrière-plan (non-bloquant)
    examService.startExamSession(level, locale as any).catch((error) => {
      console.error('[USE_NAVIGATION] Erreur lors du préchargement:', error);
      // L'erreur sera gérée par useExamSession sur la page simulation
    });
  };

  return {
    navigateTo,
    startPath,
  };
}
