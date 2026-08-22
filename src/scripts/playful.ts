/**
 * Shared helpers for the Kids Corner games.
 *
 * Two design rules run through all of this, taken from how a Montessori
 * classroom actually works:
 *
 *   1. CONTROL OF ERROR. The material shows the child whether they were right,
 *      not an adult and not a score. So there are no points, no stars, no
 *      timers and no losing. A wrong choice simply does not fit, and the child
 *      tries again.
 *
 *   2. NO EXTRINSIC REWARD. Nothing here congratulates a child for being
 *      clever. Feedback describes what happened ("the stone sank") rather than
 *      judging them, which is the same language we use in the classroom.
 */

/* ------------------------------------------------------------------ audio */

let ctx: AudioContext | null = null;
let muted = false;

/** Read the saved preference once, on load. */
try {
  muted = localStorage.getItem('tiny-sound') === 'off';
} catch {
  /* private browsing — just default to sound on */
}

export const isMuted = () => muted;

export function setMuted(next: boolean) {
  muted = next;
  try {
    localStorage.setItem('tiny-sound', next ? 'off' : 'on');
  } catch {
    /* ignore */
  }
}

/**
 * Tones are synthesised rather than loaded as files: no network cost, and no
 * chance of a jarring clipped sample. The AudioContext is created lazily on the
 * first real interaction, which is also what browser autoplay rules require.
 */
function audio(): AudioContext | null {
  if (muted) return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, gain = 0.13) {
  const ac = audio();
  if (!ac) return;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  // Short attack and a smooth exponential tail — a hard stop clicks.
  amp.gain.setValueAtTime(0.0001, ac.currentTime + start);
  amp.gain.exponentialRampToValueAtTime(gain, ac.currentTime + start + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur);
  osc.connect(amp).connect(ac.destination);
  osc.start(ac.currentTime + start);
  osc.stop(ac.currentTime + start + dur + 0.02);
}

/** Soft click for any pick-up / selection. */
export const sfxTap = () => tone(660, 0, 0.08, 0.08);

/** Rising third — "that fits". Warm, not triumphant. */
export const sfxYes = () => {
  tone(523.25, 0, 0.14); // C5
  tone(659.25, 0.1, 0.22); // E5
};

/** Gentle low blip — "not that one". Deliberately not a buzzer. */
export const sfxNudge = () => tone(300, 0, 0.16, 0.07);

/** Little ascending run when a whole activity is finished. */
export const sfxDone = () => {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.3, 0.1));
};

/** Falling glissando for something sinking. */
export const sfxSink = () => {
  [520, 440, 370, 300].forEach((f, i) => tone(f, i * 0.07, 0.18, 0.08));
};

/** Rising bubble for something floating up. */
export const sfxFloat = () => {
  [400, 500, 620].forEach((f, i) => tone(f, i * 0.08, 0.2, 0.07));
};

/* ------------------------------------------------------------- utilities */

/** Fisher–Yates. Array.sort(() => Math.random() - 0.5) is not uniform. */
export function shuffle<T>(input: T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Announce something to screen readers without moving focus.
 * Games are visual, so every state change needs a spoken equivalent.
 */
export function say(region: HTMLElement | null, message: string) {
  if (!region) return;
  // Clearing first forces re-announcement when the text repeats.
  region.textContent = '';
  window.setTimeout(() => {
    region.textContent = message;
  }, 60);
}

/** Confetti-ish burst of brand-coloured dots. Pure DOM, no library. */
export function celebrate(host: HTMLElement) {
  if (reducedMotion()) return;
  const colours = ['#E1252B', '#3F8F3C', '#F5C518', '#1C9BC7', '#2B2A5F'];
  const layer = document.createElement('div');
  layer.className = 'burst';
  layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 22; i++) {
    const dot = document.createElement('i');
    dot.style.setProperty('--c', colours[i % colours.length]);
    dot.style.setProperty('--x', `${(Math.random() - 0.5) * 260}px`);
    dot.style.setProperty('--y', `${-60 - Math.random() * 190}px`);
    dot.style.setProperty('--r', `${Math.random() * 540 - 270}deg`);
    dot.style.setProperty('--d', `${Math.random() * 0.25}s`);
    layer.appendChild(dot);
  }
  host.appendChild(layer);
  window.setTimeout(() => layer.remove(), 1800);
}
