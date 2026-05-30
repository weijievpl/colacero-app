import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Static import for export compatibility
  const messages: Record<string, any> = {
    es: await import('./messages/es.json').then(m => m.default),
    en: await import('./messages/en.json').then(m => m.default),
    zh: await import('./messages/zh.json').then(m => m.default),
    pt: await import('./messages/pt.json').then(m => m.default),
    fr: await import('./messages/fr.json').then(m => m.default),
  };

  return {
    locale,
    messages: messages[locale as string] || messages['es'],
  };
});
