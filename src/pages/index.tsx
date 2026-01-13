import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Header } from '@/components/features/home/Header';
import { Hero } from '@/components/features/home/Hero';
import { PathSelector } from '@/components/features/home/PathSelector';
import { HowItWorks } from '@/components/features/home/HowItWorks';
import { Themes } from '@/components/features/home/Themes';
import { Resources } from '@/components/features/home/Resources';
import { Footer } from '@/components/features/home/Footer';

export default function Home() {
  const router = useRouter();
  const { refreshPremiumStatus, isPremium } = useAuth();

  // Rafraîchir le statut premium après un paiement réussi
  useEffect(() => {
    if (router.query.premium_activated === 'true') {
      console.log('🎉 [Home] Premium activé détecté, rafraîchissement du statut...');
      // Attendre un peu pour que le webhook ait le temps de s'exécuter
      let isMounted = true;
      const refreshStatus = async () => {
        // Attendre 2 secondes pour que le webhook s'exécute
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (!isMounted) return;
        
        // Rafraîchir une fois
        await refreshPremiumStatus();
        console.log('✅ [Home] Statut premium rafraîchi, isPremium:', isPremium);
        
        // Nettoyer l'URL après le rafraîchissement
        if (isMounted) {
          router.replace('/', undefined, { shallow: true });
        }
      };
      refreshStatus();
      
      return () => {
        isMounted = false;
      };
    }
  }, [router.query.premium_activated, refreshPremiumStatus, router, isPremium]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <PathSelector />
        <HowItWorks />
        <Themes />
        <Resources />
      </main>
      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'fr', ['common', 'home'])),
    },
  };
};
