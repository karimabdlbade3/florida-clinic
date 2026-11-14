// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
// Final domain. Set SITE_URL in .env or the hosting dashboard before going live.
const SITE_URL = env.SITE_URL || process.env.SITE_URL || 'https://www.floridadentalclinics.example';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: { defaultLocale: 'ar', locales: { ar: 'ar-EG', en: 'en' } },
    }),
  ],
  vite: {
    // Keep scripts as external files so a strict CSP (script-src 'self') works.
    build: { assetsInlineLimit: 0 },
  },
});
