module.exports = {
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'ar'],
    localeDetection: true,
  },
  localePath: typeof window === 'undefined' 
    ? require('path').resolve('./public/locales')
    : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  fallbackLng: 'fr',
  debug: process.env.NODE_ENV === 'development',
};
