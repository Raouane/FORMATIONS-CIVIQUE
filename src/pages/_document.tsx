import { Html, Head, Main, NextScript } from 'next/document';
import { getDirection, getHTMLlang } from '@/lib/rtl';

export default function Document() {
  // Par défaut, on utilise 'fr' pour le SSR
  // La direction sera mise à jour côté client dans _app.tsx
  const defaultLocale = 'fr';
  const dir = getDirection(defaultLocale);
  const lang = getHTMLlang(defaultLocale);

  return (
    <Html lang={lang} dir={dir}>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0050a1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Formations Civiques 2026" />
        {/* Icônes PWA - à créer plus tard */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="description" content="Plateforme de préparation à l'examen de formation civique officiel 2026" />
        
        {/* Police Cairo pour l'arabe - Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
