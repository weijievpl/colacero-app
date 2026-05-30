import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  const validLocales = ['es', 'en', 'zh', 'pt', 'fr'];
  if (!locale || !validLocales.includes(locale)) {
    locale = 'es';
  }

  const messages: Record<string, any> = {
    es: (await import('./messages/es.json')).default,
    en: (await import('./messages/en.json')).default,
    zh: (await import('./messages/zh.json')).default,
    pt: (await import('./messages/pt.json')).default,
    fr: (await import('./messages/fr.json')).default,
  };

  return {
    locale: locale as string,
    messages: messages[locale] || messages['es'],
  };
});
