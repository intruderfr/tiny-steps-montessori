// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { BASE } from './scripts/base-path.mjs';

/**
 * Site URL and base path are environment-driven so the same source tree can be
 * built for two very different targets:
 *
 *   • The real domain (production)
 *       SITE_URL=https://tinystepsmontessori.lk   BASE_PATH=/
 *
 *   • A GitHub Pages project site (sharing a preview)
 *       SITE_URL=https://<user>.github.io   BASE_PATH=<repo>
 *
 * When BASE_PATH is not "/", scripts/fix-base.mjs runs after the build and
 * prefixes every root-absolute link in the HTML. See that file for why.
 */
const SITE_URL = process.env.SITE_URL || 'https://tinystepsmontessori.lk';
const BASE_PATH = BASE || '/'; // normalised: "" -> "/", "foo" -> "/foo"

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: { defaultLocale: 'en', locales: { en: 'en-LK' } },
    }),
  ],
  // Statically replaced so src/data/site.ts resolves the same values Astro uses.
  // Vite only auto-exposes PUBLIC_-prefixed vars, so these are defined by hand.
  vite: {
    define: {
      'import.meta.env.SITE_ORIGIN': JSON.stringify(SITE_URL.replace(/\/+$/, '')),
      'import.meta.env.SITE_BASE': JSON.stringify(BASE),
    },
  },
  build: { inlineStylesheets: 'auto', format: 'directory' },
  image: { responsiveStyles: true, layout: 'constrained' },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
});
