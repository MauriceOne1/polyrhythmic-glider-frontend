import type { SeoData } from '../models/seo.models';

export const SITE_URL = 'https://polyglider.com';
export const SITE_NAME = 'Polyrhythmic Glider';
export const SITE_LOCALE = 'it_IT';
export const DEFAULT_SEO: SeoData = {
  title: SITE_NAME,
  description:
    'Polyrhythmic Glider è uno spazio per musica, codice ed esperimenti digitali tra ricerca sonora, live coding e sistemi aperti.',
  keywords: [
    'polyrhythmic glider',
    'musica',
    'codice',
    'live coding',
    'ricerca sonora',
    'esperimenti digitali',
  ],
  type: 'website',
  robots: 'index,follow',
};
