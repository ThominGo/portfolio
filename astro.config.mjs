import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

// Pages projet FR sans traduction complète : exclues du sitemap (noindex + canonical EN)
const content = JSON.parse(readFileSync(new URL('./src/data/content.json', import.meta.url), 'utf8'));
const untranslated = new Set(
  content.projects
    .filter((p) => (p.intro && !p.intro_fr) || (p.context && !p.context_fr) || (p.process && !p.process_fr))
    .map((p) => `/fr/work/${p.slug}`),
);

const site = 'https://thomas-marilleau.com';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  build: { format: 'file', inlineStylesheets: 'auto' },
  compressHTML: true,
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', fr: 'fr' } },
      filter: (page) => {
        const { pathname } = new URL(page);
        return !pathname.includes('/404') && !untranslated.has(pathname.replace(/\/$/, ''));
      },
    }),
  ],
  image: {
    // Autorise l'optimisation des images distantes tant que les médias ne sont pas rapatriés en local
    remotePatterns: [{ protocol: 'https' }],
  },
});
