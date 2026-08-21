/**
 * Static SEO audit over the built output in dist/.
 *
 * Run with:  npm run audit   (after npm run build)
 *
 * This is a pre-flight check, not a replacement for Google Search Console. It
 * catches the mistakes that are cheap to make and expensive to leave in: a
 * missing canonical, two <h1>s on a page, a title that will be truncated in the
 * SERP, an internal link pointing at a page that does not exist.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { BASE } from './base-path.mjs';

const DIST = 'dist';
const errors = [];
const warnings = [];

// When deployed under a base path (GitHub Pages project site), links in the
// output carry that prefix but the dist/ tree does not. Strip it before
// comparing links against real routes.
const stripBase = (p) => (BASE && p.startsWith(BASE + '/') ? p.slice(BASE.length) : p);

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

if (!existsSync(DIST)) {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));

/** dist/about/index.html -> /about ; dist/index.html -> / */
const toRoute = (file) => {
  const r = '/' + relative(DIST, file).split(sep).join('/');
  return r.replace(/\/index\.html$/, '') || '/';
};

const routes = new Set(htmlFiles.map(toRoute));
const grab = (html, re) => (html.match(re) ?? [])[1];

const pages = [];

for (const file of htmlFiles) {
  const route = toRoute(file);
  const html = readFileSync(file, 'utf8');
  const err = (m) => errors.push(`${route} — ${m}`);
  const warn = (m) => warnings.push(`${route} — ${m}`);

  const is404 = route === '/404';
  const noindex = /content="noindex/.test(html);

  /* ------------------------------------------------------------- title */
  const title = grab(html, /<title>([\s\S]*?)<\/title>/);
  if (!title) err('missing <title>');
  else if (title.length > 62) warn(`title is ${title.length} chars — Google truncates around 60`);
  else if (title.length < 15) warn(`title is only ${title.length} chars`);

  /* ------------------------------------------------------- description */
  const desc = grab(html, /<meta name="description" content="([^"]*)"/);
  if (!desc) err('missing meta description');
  else if (desc.length > 165) err(`meta description is ${desc.length} chars (max 165)`);
  else if (desc.length < 70) warn(`meta description is only ${desc.length} chars`);

  /* --------------------------------------------------------- canonical */
  const canonical = grab(html, /<link rel="canonical" href="([^"]*)"/);
  if (!canonical) err('missing canonical');
  else if (!canonical.startsWith('https://')) err(`canonical is not absolute: ${canonical}`);

  /* ----------------------------------------------------------- heading */
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)];
  if (h1s.length === 0) err('no <h1>');
  else if (h1s.length > 1) err(`${h1s.length} <h1> elements — there must be exactly one`);

  /* --------------------------------------------------------- Open Graph */
  for (const p of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) {
    if (!html.includes(`property="${p}"`)) err(`missing ${p}`);
  }
  if (!html.includes('name="twitter:card"')) warn('missing twitter:card');

  /* ------------------------------------------------------ structured data */
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let types = [];
  if (ld.length === 0 && !is404) err('no JSON-LD structured data');
  for (const [, raw] of ld) {
    try {
      const parsed = JSON.parse(raw);
      const nodes = parsed['@graph'] ?? [parsed];
      types = nodes.map((n) => (Array.isArray(n['@type']) ? n['@type'].join('+') : n['@type']));
      for (const n of nodes) {
        if (!n['@type']) err('JSON-LD node with no @type');
      }
    } catch (e) {
      err(`invalid JSON-LD: ${e.message}`);
    }
  }

  /* ------------------------------------------------------------- images */
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\balt=/.test(t));
  if (noAlt.length) err(`${noAlt.length} <img> without alt`);
  const noLazy = imgs.filter((t) => !/loading=/.test(t));
  if (noLazy.length) warn(`${noLazy.length} <img> without loading attribute`);

  /* -------------------------------------------------------------- lang */
  if (!/<html[^>]+lang="/.test(html)) err('missing lang on <html>');

  /* ----------------------------------------------- internal link targets */
  // Only <a href> — matching every href would also pick up <link rel=stylesheet>
  // and flag hashed asset bundles, which are not routes.
  const links = [...html.matchAll(/<a\b[^>]*\bhref="(\/[^"#?]*)"/g)].map((m) => m[1]);
  for (const l of new Set(links)) {
    const clean = stripBase(l).replace(/\/$/, '') || '/';
    // A link either resolves to a page route or to a real file in dist.
    if (routes.has(clean)) continue;
    if (existsSync(join(DIST, stripBase(l)))) continue;
    err(`internal link 404 → ${l}`);
  }

  /* ----------------------------------------------------- content volume */
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text.split(' ').filter(Boolean).length;
  if (words < 300 && !is404 && !noindex) warn(`thin content — only ~${words} words`);

  pages.push({
    route,
    title: title ?? '—',
    titleLen: title?.length ?? 0,
    descLen: desc?.length ?? 0,
    words,
    kb: +(Buffer.byteLength(html) / 1024).toFixed(1),
    schema: types.join(', ') || '—',
  });
}

/* ------------------------------------------------------- site-wide checks */
for (const f of ['robots.txt', 'sitemap-index.xml', 'favicon.svg', 'site.webmanifest', 'rss.xml']) {
  if (!existsSync(join(DIST, f))) errors.push(`site — missing ${f}`);
}
if (!existsSync(join(DIST, 'images', 'og-default.jpg'))) {
  errors.push('site — missing images/og-default.jpg (social previews will be blank)');
}

/* ------------------------------------------------------------------ report */
pages.sort((a, b) => a.route.localeCompare(b.route));

const pad = (s, n) => String(s).padEnd(n).slice(0, n);
console.log('\n\x1b[1mPAGE INVENTORY\x1b[0m');
console.log(pad('ROUTE', 46), pad('TTL', 4), pad('DESC', 5), pad('WORDS', 6), pad('KB', 6), 'SCHEMA');
console.log('-'.repeat(120));
for (const p of pages) {
  console.log(pad(p.route, 46), pad(p.titleLen, 4), pad(p.descLen, 5), pad(p.words, 6), pad(p.kb, 6), p.schema);
}

console.log(`\n\x1b[1mTotals\x1b[0m: ${pages.length} pages, ${pages.reduce((n, p) => n + p.words, 0).toLocaleString()} words`);

if (warnings.length) {
  console.log(`\n\x1b[33mWARNINGS (${warnings.length})\x1b[0m`);
  warnings.forEach((w) => console.log('  ⚠ ' + w));
}
if (errors.length) {
  console.log(`\n\x1b[31mERRORS (${errors.length})\x1b[0m`);
  errors.forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n\x1b[32m✓ No SEO errors.\x1b[0m\n');
