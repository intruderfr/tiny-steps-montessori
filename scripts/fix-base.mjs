/**
 * Rewrites root-absolute URLs in the built HTML to sit under a base path.
 *
 * WHY THIS EXISTS
 * Astro's `base` option prefixes the assets *it* generates, but it deliberately
 * does not rewrite links you authored yourself — `<a href="/about">` stays
 * exactly as written. That is correct for most projects, and fine when the site
 * is served from a domain root.
 *
 * GitHub Pages project sites are not served from a root. They live at
 * https://<user>.github.io/<repo>/, so every hand-written "/about" would 404.
 *
 * Rather than thread a base-path helper through ~30 templates and all the
 * markdown content — which would make the source worse for the real launch —
 * this pass fixes the output once, at the end of the build.
 *
 * It is a no-op when there is no base path (the production case), so the code
 * you ship to the real domain never goes near it.
 *
 * Runs automatically via the `postbuild` npm script.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { BASE } from './base-path.mjs';

if (!BASE) {
  console.log('fix-base: no base path — nothing to rewrite.');
  process.exit(0);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const seg = escape(BASE.slice(1)); // "tiny-steps", no leading slash

/**
 * Matches href/src/action values starting with a single "/", then asserts the
 * remainder is not already base-prefixed.
 *
 * Both lookaheads sit AFTER the consumed "/" — testing them before it would
 * compare the base against a string that still starts with "/", the assertion
 * would never fire, and already-prefixed URLs would be prefixed a second time.
 */
const attrRe = new RegExp(`(\\b(?:href|src|action)=")\\/(?!\\/)(?!${seg}\\/)`, 'g');

let files = 0;
let edits = 0;

for (const file of walk('dist')) {
  if (!/\.(html|xml)$/.test(file)) continue;

  const src = readFileSync(file, 'utf8');

  let out = src.replace(attrRe, (_m, attr) => {
    edits++;
    return `${attr}${BASE}/`;
  });

  // srcset is comma-separated and not caught by the attribute pattern above.
  out = out.replace(/\bsrcset="([^"]*)"/g, (m, val) => {
    if (!val.includes('/')) return m;
    const fixed = val
      .split(',')
      .map((part) => {
        const t = part.trim();
        if (!t.startsWith('/') || t.startsWith('//') || t.startsWith(`${BASE}/`)) return t;
        edits++;
        return BASE + t;
      })
      .join(', ');
    return `srcset="${fixed}"`;
  });

  if (out !== src) {
    writeFileSync(file, out);
    files++;
  }
}

console.log(`fix-base: prefixed ${edits} URLs with "${BASE}" across ${files} files.`);
