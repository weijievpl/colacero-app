import createMiddleware from 'next-intl/middleware';
import { LOCALES, DEFAULT_LOCALE } from './lib/constants';

export default createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
});

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - Static files (favicon, images, etc.)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
