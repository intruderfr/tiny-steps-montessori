/**
 * Generate the hash for a family access code.
 *
 *   npm run code -- "TINYSTEPS-FAMILY"
 *
 * Paste the printed hash into CODE_HASHES in src/scripts/access.ts and rebuild.
 * The plain code never enters the repo or the shipped site, so nobody can read
 * a working code out of the page source.
 *
 * You can keep several hashes in the array at once — useful for issuing a new
 * code each intake while the old one still works.
 */
import { createHash } from 'node:crypto';

const raw = process.argv[2];
if (!raw) {
  console.error('Usage: npm run code -- "YOUR-CODE"');
  process.exit(1);
}

// Must match normalise() in src/scripts/access.ts exactly.
const normalised = raw.trim().toUpperCase().replace(/[\s_-]+/g, '-');
const hash = createHash('sha256').update(normalised, 'utf8').digest('hex');

console.log(`\n  code as typed : ${raw}`);
console.log(`  normalised    : ${normalised}`);
console.log(`  hash          : ${hash}\n`);
console.log('  Paste that hash into CODE_HASHES in src/scripts/access.ts\n');
