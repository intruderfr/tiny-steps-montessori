/**
 * THE LEARNING JOURNEY — local-only progress for the Kids Corner.
 *
 * ============================ PRIVACY ====================================
 * Everything here lives in localStorage on the child's own device. There is no
 * account, no server, no analytics and no network call of any kind. Nothing
 * about a child ever leaves the browser it was typed into.
 *
 * That is not a nice-to-have. A school website that collected children's names
 * and performance data would need authentication, a server, a lawful basis for
 * processing and a retention policy. Keeping it on-device means the school
 * never holds any of it, so none of that applies. The trade is that progress
 * does not follow a child between devices — which is the correct trade.
 *
 * The name field is optional and first-name-only by design.
 * =========================================================================
 *
 * ON STAGES AND RECORDS
 * The Kids Corner deliberately has no score, no timer and no way to lose. That
 * still holds. What this adds is different in kind:
 *
 *   • Stages are SEQUENCED DIFFICULTY, which is how Montessori materials
 *     already work — you are handed the next one when the last one is secure.
 *     Cleared stages never re-lock, and any unlocked stage can be replayed for
 *     as long as a child wants.
 *
 *   • The profile is a RECORD OF WORK, not a score. It says what a child can
 *     now do, in words. There are deliberately no points, no streaks, no daily
 *     rewards and nothing that punishes a gap of three weeks.
 */

const KEY = 'tiny-steps-journey-v1';
const EVENT = 'tiny:journey';

/* ------------------------------------------------------------------ types */

export interface StageRecord {
  /** Times this stage has been finished. */
  cleared: number;
  /** ISO date the stage was first finished. Used for the timeline. */
  firstAt?: string;
}

export interface ChallengeRecord {
  stages: Record<number, StageRecord>;
  /** Highest stage number finished. 0 = none yet. */
  best: number;
}

export interface Milestone {
  id: string;
  /** ISO date (yyyy-mm-dd). */
  date: string;
  text: string;
  kind: 'school' | 'home';
}

export interface Journey {
  v: 1;
  name: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  challenges: Record<string, ChallengeRecord>;
  milestones: Milestone[];
}

/* ------------------------------------------------------------- challenges */

export interface ChallengeDef {
  id: string;
  name: string;
  icon: string;
  /** The thinking skill it actually exercises, in plain words. */
  skill: string;
  stages: number;
  /** Shown on the journey page once every stage is finished. */
  mastery: string;
  /** Thinking skills, or things worth knowing. Used to group both pages. */
  group: 'brain' | 'knowledge';
}

export const GROUPS = {
  brain: { label: 'Brain challenges', blurb: 'How your child thinks — memory, logic, reasoning and number sense.' },
  knowledge: { label: 'Things worth knowing', blurb: 'Letters and sounds, shapes, telling the time, and our own island.' },
} as const;

export const CHALLENGES: ChallengeDef[] = [
  // ------------------------------------------------------------- thinking
  {
    id: 'sequence',
    name: 'Copy the Pattern',
    icon: '🎵',
    skill: 'Working memory',
    stages: 8,
    group: 'brain',
    mastery: 'Can hold a sequence of eight steps in mind and repeat it back.',
  },
  {
    id: 'pattern',
    name: 'What Comes Next?',
    icon: '🔗',
    skill: 'Logic and sequencing',
    stages: 8,
    group: 'brain',
    mastery: 'Can spot a repeating or growing rule and continue it.',
  },
  {
    id: 'oddone',
    name: 'Odd One Out',
    icon: '🔍',
    skill: 'Sorting and reasoning',
    stages: 8,
    group: 'brain',
    mastery: 'Can work out the rule a group shares, and find what breaks it.',
  },
  {
    id: 'maketen',
    name: 'Make Ten',
    icon: '🔟',
    skill: 'Number bonds',
    stages: 8,
    group: 'brain',
    mastery: 'Knows the pairs that make ten without counting them out.',
  },

  // ------------------------------------------------------------ knowledge
  {
    id: 'sounds',
    name: 'First Sounds',
    icon: '🔤',
    skill: 'Letters and sounds',
    stages: 8,
    group: 'knowledge',
    mastery: 'Hears the first, last and middle sounds in a word, and can clap its beats.',
  },
  {
    id: 'shapes',
    name: 'Shape Detective',
    icon: '🔷',
    skill: 'Shapes and geometry',
    stages: 8,
    group: 'knowledge',
    mastery: 'Names flat and solid shapes, and can count their sides and corners.',
  },
  {
    id: 'time',
    name: 'Tell the Time',
    icon: '🕰️',
    skill: 'Reading a clock',
    stages: 8,
    group: 'knowledge',
    mastery: 'Reads an analogue clock to the nearest five minutes.',
  },
  {
    id: 'lanka',
    name: 'My Sri Lanka',
    icon: '🇱🇰',
    skill: 'Our island',
    stages: 8,
    group: 'knowledge',
    mastery: 'Knows our animals, cities, festivals and national symbols.',
  },
];

export const challengesIn = (group: 'brain' | 'knowledge') =>
  CHALLENGES.filter((c) => c.group === group);

export const challengeById = (id: string) => CHALLENGES.find((c) => c.id === id);

export const AVATARS = ['🦊', '🐨', '🐢', '🦉', '🐙', '🦋', '🐝', '🦔', '🐰', '🐳', '🦒', '🐧'];

/* ---------------------------------------------------------------- storage */

const blank = (): Journey => ({
  v: 1,
  name: '',
  avatar: AVATARS[0],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  challenges: {},
  milestones: [],
});

let cache: Journey | null = null;

export function load(): Journey {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Journey;
      // Guard against a hand-edited or half-written record.
      if (parsed && parsed.v === 1 && typeof parsed.challenges === 'object') {
        parsed.milestones ??= [];
        cache = parsed;
        return cache;
      }
    }
  } catch {
    /* corrupt or unavailable (private mode) — fall through to a fresh one */
  }
  cache = blank();
  return cache;
}

function save(j: Journey) {
  j.updatedAt = new Date().toISOString();
  cache = j;
  try {
    localStorage.setItem(KEY, JSON.stringify(j));
  } catch {
    /* storage full or blocked — the session still works, it just will not persist */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: j }));
}

/** Subscribe to any change. Returns an unsubscribe function. */
export function onChange(fn: (j: Journey) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<Journey>).detail);
  window.addEventListener(EVENT, handler);
  // Keep two open tabs in step.
  const storage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      fn(load());
    }
  };
  window.addEventListener('storage', storage);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', storage);
  };
}

/* ------------------------------------------------------------------- api */

export function setIdentity(name: string, avatar: string) {
  const j = load();
  // First name only, and capped — there is no reason to hold more than that.
  j.name = name.trim().slice(0, 24);
  j.avatar = avatar;
  save(j);
}

export function recordStage(challengeId: string, stage: number) {
  const j = load();
  const c = (j.challenges[challengeId] ??= { stages: {}, best: 0 });
  const rec = (c.stages[stage] ??= { cleared: 0 });
  rec.cleared += 1;
  rec.firstAt ??= new Date().toISOString();
  if (stage > c.best) c.best = stage;
  save(j);
}

/** Highest stage finished for a challenge. 0 when untouched. */
export const bestStage = (challengeId: string) => load().challenges[challengeId]?.best ?? 0;

/**
 * Stage 1 is always open; after that you need the previous one.
 * Nothing ever re-locks, and any unlocked stage can be replayed freely.
 */
export const isUnlocked = (challengeId: string, stage: number) =>
  stage <= 1 || bestStage(challengeId) >= stage - 1;

export const isCleared = (challengeId: string, stage: number) =>
  (load().challenges[challengeId]?.stages[stage]?.cleared ?? 0) > 0;

export function summary() {
  const j = load();
  const perChallenge = CHALLENGES.map((c) => {
    const best = j.challenges[c.id]?.best ?? 0;
    return { ...c, best, done: best >= c.stages, pct: Math.round((best / c.stages) * 100) };
  });
  const totalStages = CHALLENGES.reduce((n, c) => n + c.stages, 0);
  const clearedStages = perChallenge.reduce((n, c) => n + c.best, 0);
  return {
    name: j.name,
    avatar: j.avatar,
    perChallenge,
    totalStages,
    clearedStages,
    mastered: perChallenge.filter((c) => c.done).length,
    started: j.createdAt,
  };
}

/* ------------------------------------------------------------ milestones */

export function addMilestone(m: Omit<Milestone, 'id'>) {
  const j = load();
  j.milestones.unshift({
    ...m,
    text: m.text.trim().slice(0, 200),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  });
  j.milestones = j.milestones.slice(0, 60);
  save(j);
}

export function removeMilestone(id: string) {
  const j = load();
  j.milestones = j.milestones.filter((m) => m.id !== id);
  save(j);
}

/* ------------------------------------------------------------------ wipe */

/** Delete everything. Offered prominently — the family owns this data. */
export function wipe() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  cache = null;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: load() }));
}

export const hasProfile = () => {
  const j = load();
  return Boolean(j.name) || Object.keys(j.challenges).length > 0 || j.milestones.length > 0;
};
