/**
 * One-off importer: takes the raw WhatsApp exports and turns them into named,
 * right-sized source images the site can use.
 *
 *   node scripts/import-photos.mjs "C:/Users/Aslam/Downloads/tiny"
 *
 * WhatsApp filenames ("WhatsApp Image 2026-08-21 at 14.35.06 (2).jpeg") carry no
 * meaning, sort meaninglessly, and would make the gallery impossible to edit by
 * hand. This maps each one to a descriptive slug used everywhere afterwards.
 *
 * Originals run to ~28 MB and up to 4032px. They are capped at 1500px on the
 * long edge here. That is the size the gallery lightbox opens at, and it is the
 * fallback `src` Astro emits alongside the responsive srcset — so leaving it
 * larger inflates both the repo and every no-srcset fallback for no visible
 * gain. Astro generates the smaller 320/480/720 variants from these at build.
 *
 * Safe to re-run: it overwrites by slug.
 */
import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = process.argv[2] || 'C:/Users/Aslam/Downloads/tiny';
const OUT = 'src/assets/photos';
const MAX_EDGE = 1500;

/**
 * Curated selection, keyed by position in the sorted source listing.
 * Near-duplicate frames from the same moment are deliberately left out — a
 * gallery of five almost-identical tyre-painting shots reads as padding.
 */
const PICKS = {
  1:  'nature-trip-paddy-field',
  3:  'nature-trip-muddy-child',
  4:  'field-trip-group-dehiwala',
  6:  'farm-visit-holding-chick',
  7:  'field-trip-under-the-trees',
  8:  'nature-trip-mud-play',
  9:  'international-day-britain',
  10: 'international-day-africa',
  11: 'international-day-asia',
  13: 'colouring-world-maps',
  15: 'practical-life-pouring',
  16: 'farm-visit-hen-on-hat',
  17: 'farm-visit-meeting-animals',
  18: 'upcycling-painting-tyres',
  21: 'upcycling-red-tyre',
  23: 'morning-assembly-classroom',
  24: 'role-play-kitchen-corner',
  25: 'classroom-free-play',
  27: 'cookery-day-display',
  28: 'threading-beads',
  29: 'sorting-and-matching',
  31: 'career-day-pilots',
  32: 'career-day-dress-up',
  33: 'career-day-community-helpers',
  36: 'ice-cream-outing',
  42: 'stem-club-circuits-table',
  43: 'stem-club-building-circuits',
  44: 'stem-club-wiring-a-switch',
  45: 'toddler-water-play',
  46: 'toddler-washing-basin',
  47: 'water-basins-outdoors',
  49: 'practical-life-watering-plant',
  50: 'playground-whole-school',
  51: 'avurudu-new-year-stage',
  52: 'avurudu-new-year-group',
  53: 'science-sink-and-float',
  55: 'art-fish-collage',
  57: 'art-fish-puppet',
};

if (!existsSync(SRC)) {
  console.error(`Source folder not found: ${SRC}`);
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const files = readdirSync(SRC)
  .filter((f) => /\.jpe?g$/i.test(f))
  .sort();

let bytesIn = 0;
let bytesOut = 0;
let count = 0;

for (const [idxStr, slug] of Object.entries(PICKS)) {
  const file = files[Number(idxStr) - 1];
  if (!file) {
    console.warn(`  ! no source at index ${idxStr} (${slug})`);
    continue;
  }
  const from = join(SRC, file);
  const to = join(OUT, `${slug}.jpg`);

  bytesIn += statSync(from).size;

  await sharp(from)
    .rotate() // honour EXIF orientation, then strip it — phone photos rely on this
    .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(to);

  bytesOut += statSync(to).size;
  count++;
}

const mb = (b) => (b / 1024 / 1024).toFixed(1) + ' MB';
console.log(`✓ imported ${count} photos into ${OUT}`);
console.log(`  ${mb(bytesIn)} → ${mb(bytesOut)}`);
