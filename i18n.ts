import { getRequestConfig } from 'next-intl/server';
import { LOCALES, DEFAULT_LOCALE } from './lib/constants';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request
  let locale = await requestLocale;
  
  // Validate locale
  if (!locale || !LOCALES.includes(locale as typeof LOCALES[number])) {
    locale = DEFAULT_LOCALE;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
