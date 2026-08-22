/**
 * FAMILY ACCESS — who can play the later stages.
 *
 * ==================== WHAT THIS IS, AND WHAT IT IS NOT ====================
 * This is a SOFT GATE. It is browser-side JavaScript on a static site, so an
 * adult who opens developer tools can get past it. There is no server here to
 * check anything against, and pretending otherwise would be dishonest.
 *
 * What it does achieve, and what it was chosen for:
 *   • Casual visitors get a real taste (stages 1–3 of everything) and then a
 *     clear, friendly reason to enrol.
 *   • The codes themselves are stored as SHA-256 hashes, so nobody can read a
 *     working family code out of the page source and pass it around. That is
 *     the part that actually matters day to day.
 *   • No accounts, no server, no children's data. Consistent with the rest of
 *     the Kids Corner.
 *
 * If you ever need REAL enforcement — per-family codes you can revoke, or
 * knowing who used what — that needs a backend, and it should be built as one.
 * =========================================================================
 *
 * TO ISSUE OR CHANGE A CODE
 *   npm run code -- "YOUR-NEW-CODE"
 * That prints a hash. Paste it into CODE_HASHES below and rebuild. The code
 * itself never appears anywhere in the repo or the shipped site.
 */

/** Stages every visitor can play, enrolled or not. */
export const FREE_STAGES = 3;

/**
 * SHA-256 hashes of valid family codes.
 *
 * The starter code below is "TINYSTEPS-FAMILY" — CHANGE IT before launch,
 * because it is written down in this comment and therefore public.
 * Generate a replacement with:  npm run code -- "YOUR-CODE"
 */
const CODE_HASHES = [
  '104d43b662b756b63244ecea5ea6d568370cb8884c81dbbfd8bbe9521a786c4e', // "TINYSTEPS-FAMILY" — ⚠️ replace before launch
];

const KEY = 'tiny-steps-access-v1';
const EVENT = 'tiny:access';

/** Normalise before hashing so "tinysteps family" and "TINYSTEPS-FAMILY" match. */
const normalise = (raw: string) => raw.trim().toUpperCase().replace(/[\s_-]+/g, '-');

export async function hashCode(raw: string): Promise<string> {
  const data = new TextEncoder().encode(normalise(raw));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function hasAccess(): boolean {
  try {
    return CODE_HASHES.includes(localStorage.getItem(KEY) ?? '');
  } catch {
    return false;
  }
}

/**
 * Check a code and remember it if it is right.
 * Returns false for a wrong code — never throws, so the UI stays simple.
 */
export async function redeem(raw: string): Promise<boolean> {
  if (!raw.trim()) return false;
  // crypto.subtle only exists in a secure context (https or localhost).
  if (!globalThis.crypto?.subtle) return false;

  const hash = await hashCode(raw);
  if (!CODE_HASHES.includes(hash)) return false;

  try {
    localStorage.setItem(KEY, hash);
  } catch {
    /* private mode — access holds for this session only */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
  return true;
}

export function signOut() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onAccessChange(fn: () => void) {
  window.addEventListener(EVENT, fn);
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) fn();
  });
}

/** Is this stage playable right now? */
export const stageAllowed = (stage: number) => stage <= FREE_STAGES || hasAccess();
