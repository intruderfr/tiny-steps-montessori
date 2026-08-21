/**
 * Generates the raster brand assets a browser or social platform cannot take
 * as SVG: the Open Graph card, the app icons and the Apple touch icon.
 *
 * Run with:  npm run images   (also runs automatically before every build)
 *
 * The artwork is rebuilt from the real Tiny Steps logo — three footprints
 * around a navy globe, over a teal ribbon.
 *
 * ⚠️  The OG card is a generated placeholder. Once you have photographs,
 * replace public/images/og-default.jpg with a 1200x630 photo of the school. A
 * real classroom converts far better in a WhatsApp or Facebook share preview
 * than any generated card.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

// Straight from the logo.
const RED = '#E1252B';
const GREEN = '#3F8F3C';
const YELLOW = '#F0D94A'; // logo primrose, nudged for legibility on white
const NAVY = '#2B2A5F';
const TEAL = '#1C9BC7';
const TEAL_DARK = '#14789D';
const PAPER = '#FFFFFF';

mkdirSync('public/images', { recursive: true });

/** One footprint: sole plus four stepped toes, pointing "up" before rotation. */
const foot = (rotate, fill) => `
  <g transform="rotate(${rotate})" fill="${fill}">
    <ellipse cx="0" cy="-10.6" rx="4.9" ry="6.4"/>
    <circle cx="4.3" cy="-17.6" r="2.05"/>
    <circle cx="1.2" cy="-19.1" r="1.75"/>
    <circle cx="-1.7" cy="-18.5" r="1.5"/>
    <circle cx="-4.1" cy="-16.9" r="1.25"/>
  </g>`;

/** The reduced mark: navy centre with three footprints at 120°. */
const mark = (x, y, scale) => `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <circle r="8.4" fill="${NAVY}"/>
    ${foot(8, RED)}
    ${foot(128, GREEN)}
    ${foot(248, YELLOW)}
  </g>`;

/* ------------------------------------------------------------ OG card ---- */
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${PAPER}"/>

  <!-- soft brand blooms, well clear of the text column -->
  <circle cx="1075" cy="95"  r="200" fill="${TEAL}"   opacity="0.09"/>
  <circle cx="1015" cy="520" r="150" fill="${YELLOW}" opacity="0.22"/>
  <circle cx="95"   cy="575" r="120" fill="${GREEN}"  opacity="0.09"/>

  <!-- lockup -->
  ${mark(96, 92, 3.4)}
  <text x="164" y="82" font-family="Segoe UI, Arial, sans-serif" font-size="36" font-weight="700" fill="${NAVY}">Tiny Steps</text>
  <text x="166" y="114" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="600" letter-spacing="5" fill="${TEAL}">MONTESSORI</text>

  <!-- headline -->
  <text x="90" y="288" font-family="Segoe UI, Arial, sans-serif" font-size="70" font-weight="800" fill="${NAVY}">Where little feet take</text>
  <text x="90" y="368" font-family="Segoe UI, Arial, sans-serif" font-size="70" font-weight="800" fill="${NAVY}">their biggest steps.</text>
  <rect x="90" y="388" width="410" height="13" rx="6.5" fill="${YELLOW}"/>

  <text x="90" y="462" font-family="Segoe UI, Arial, sans-serif" font-size="29" fill="#4C4E66">Montessori preschool &amp; daycare in Dehiwala, Colombo</text>

  <!-- the school's own tagline, on the ribbon teal -->
  <rect x="90" y="492" width="556" height="52" rx="26" fill="${TEAL}"/>
  <text x="118" y="527" font-family="Segoe UI, Arial, sans-serif" font-size="23" font-weight="700" letter-spacing="1.4" fill="${PAPER}">STEPPING TOWARDS A BRIGHTER FUTURE</text>

  <!-- a few footprints walking off toward the corner -->
  ${mark(980, 300, 2.2)}
  ${mark(1085, 385, 1.6)}
</svg>`;

await sharp(Buffer.from(og)).jpeg({ quality: 88, mozjpeg: true }).toFile('public/images/og-default.jpg');

/* -------------------------------------------------------------- icons ---- */
// White ground, because the mark's own three colours are the identity — a
// coloured tile would fight them. Rounded rect keeps it legible as a favicon.
const icon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="11" fill="${PAPER}"/>
  ${mark(24, 24, 1)}
</svg>`;

// Maskable-safe: the mark sits inside the middle ~80%, so a circular crop is fine.
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
