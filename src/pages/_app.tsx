import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { AuthProvider } from '@/providers/AuthProvider';
import { InstallPrompt } from '@/components/InstallPrompt';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getDirection, getHTMLlang, getFontFamily } from '@/lib/rtl';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Gestion RTL dynamique
  useEffect(() => {
    if (typeof window !== 'undefined' && router.locale) {
      const dir = getDirection(router.locale);
      const lang = getHTMLlang(router.locale);
      const fontFamily = getFontFamily(router.locale);

      // Mettre à jour l'attribut dir sur <html>
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', lang);

      // Appliquer la police appropriée
      document.documentElement.style.fontFamily = fontFamily;

      // Mettre à jour le manifest pour PWA
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        manifestLink.setAttribute('href', `/manifest.json?locale=${router.locale}`);
      }
    }
  }, [router.locale]);

  // Le service worker est automatiquement enregistré par next-pwa

  return (
    <AuthProvider>
      <Component {...pageProps} />
      <InstallPrompt />
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
