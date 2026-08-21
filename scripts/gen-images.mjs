/**
 * Generates the raster brand assets that a browser or social platform cannot
 * take as SVG: the Open Graph card, the app icons and the Apple touch icon.
 *
 * Run with:  npm run images
 *
 * These are placeholders built from the brand marks. Once you have real
 * photographs of the school, replace public/images/og-default.jpg with a
 * 1200x630 photo — a real classroom converts far better in a WhatsApp or
 * Facebook share preview than any generated card.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SUN = '#F4A340';
const INK = '#2C2420';
const CREAM = '#FFFBF3';
const TEAL = '#2A9D8F';

mkdirSync('public/images', { recursive: true });

/** The footprint mark, at an arbitrary size/offset. */
const foot = (x, y, s, fill = INK) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <path d="M20.5 33.5c-3.6 0-6.2-2.6-6.2-6.3 0-3.9 2.3-7.1 4.4-9.9 1.7-2.2 3.6-3.6 6-3.6 3.4 0 5.6 2.4 5.6 6 0 3.3-1.4 6.2-3.2 8.9-1.7 2.6-3.8 4.9-6.6 4.9Z" fill="${fill}"/>
    <circle cx="31.6" cy="14.4" r="2.5" fill="${fill}"/>
    <circle cx="35.1" cy="19.1" r="2.1" fill="${fill}"/>
    <circle cx="35.8" cy="24.3" r="1.8" fill="${fill}"/>
    <circle cx="34.4" cy="29" r="1.5" fill="${fill}"/>
  </g>`;

/* ------------------------------------------------------------ OG card ---- */
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${CREAM}"/>
  <circle cx="1060" cy="90" r="190" fill="${SUN}" opacity="0.18"/>
  <circle cx="110" cy="560" r="150" fill="${TEAL}" opacity="0.14"/>
  <circle cx="1010" cy="540" r="80" fill="${SUN}" opacity="0.25"/>

  <circle cx="96" cy="86" r="40" fill="${SUN}"/>
  ${foot(70, 60, 1.1)}

  <text x="150" y="80" font-family="Segoe UI, Arial, sans-serif" font-size="34" font-weight="700" fill="${INK}">Tiny Steps</text>
  <text x="150" y="112" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="600" letter-spacing="4" fill="${TEAL}">MONTESSORI</text>

  <text x="90" y="290" font-family="Segoe UI, Arial, sans-serif" font-size="72" font-weight="800" fill="${INK}">Where little feet take</text>
  <text x="90" y="372" font-family="Segoe UI, Arial, sans-serif" font-size="72" font-weight="800" fill="${INK}">their biggest steps.</text>
  <rect x="90" y="392" width="430" height="14" rx="7" fill="${SUN}" opacity="0.55"/>

  <text x="90" y="470" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#5A4A41">Montessori preschool &amp; daycare in Dehiwala, Colombo</text>
  <text x="90" y="516" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="600" fill="${TEAL}">Ages 1 – 8  ·  Small classes  ·  Published fees</text>

  ${foot(880, 400, 2.4, SUN)}
  ${foot(960, 450, 2.4, SUN)}
</svg>`;

await sharp(Buffer.from(og)).jpeg({ quality: 88, mozjpeg: true }).toFile('public/images/og-default.jpg');

/* -------------------------------------------------------------- icons ---- */
const icon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="10" fill="${SUN}"/>
  ${foot(0, 0, 1)}
</svg>`;

// Maskable-safe: the mark sits inside the middle 80% so a circular crop is fine.
for (const [size, name] of [
  [512, 'icon-512.png'],
  [192, 'icon-192.png'],
  [180, 'apple-touch-icon.png'],
]) {
  await sharp(Buffer.from(icon(size))).png().toFile(`public/${name}`);
}

// Square logo for the Organization JSON-LD node.
await sharp(Buffer.from(icon(512))).png().toFile('public/images/logo.png');

console.log('✓ og-default.jpg, logo.png, icon-192/512.png, apple-touch-icon.png');
