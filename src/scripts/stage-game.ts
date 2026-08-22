/**
 * Shared stage machinery for the Brain Challenges.
 *
 * Each challenge supplies only its own board — how to build stage 5 of
 * "What Comes Next?" — and this handles everything the four have in common:
 * the stage picker, what is unlocked, recording a cleared stage, the status
 * line, and moving on.
 *
 * DESIGN NOTES
 * • Getting it wrong costs nothing. `nudge()` says so and lets the child carry
 *   on; there is no life counter, no score and no timer anywhere in here.
 * • Cleared stages never re-lock and can be replayed for as long as a child
 *   wants — repetition is the point of a Montessori material, not a failure.
 * • The next stage is offered, never forced. The child taps to move on.
 */
import { recordStage, bestStage, isUnlocked, isCleared, onChange } from './progress';
import { sfxYes, sfxNudge, sfxDone, say, celebrate } from './playful';

export interface StageGameOptions {
  root: HTMLElement;
  challengeId: string;
  stages: number;
  /** Build the board for this stage. Called on every start and replay. */
  onStart: (stage: number, api: StageApi) => void;
  /** Optional per-stage hint shown under the board. */
  hint?: (stage: number) => string;
}

export interface StageApi {
  /** The child solved it. Records progress and offers the next stage. */
  win: (message?: string) => void;
  /** Wrong, but harmless. Shows a nudge and leaves the board playable. */
  nudge: (message?: string) => void;
  /** Update the status line without any verdict. */
  tell: (message: string) => void;
  stage: number;
}

export function mountStageGame(opts: StageGameOptions) {
  const { root, challengeId, stages, onStart, hint } = opts;

  const picker = root.querySelector<HTMLElement>('[data-stage-picker]');
  const board = root.querySelector<HTMLElement>('[data-board]');
  const status = root.querySelector<HTMLElement>('[data-status]');
  const hintEl = root.querySelector<HTMLElement>('[data-hint]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-next]');
  const replayBtn = root.querySelector<HTMLButtonElement>('[data-replay]');

  let current = 1;
  let solved = false;

  /* --------------------------------------------------------- stage picker */
  const buildPicker = () => {
    if (!picker) return;
    picker.innerHTML = '';
    for (let s = 1; s <= stages; s++) {
      const unlocked = isUnlocked(challengeId, s);
      const cleared = isCleared(challengeId, s);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'stagebtn';
      b.dataset.stage = String(s);
      b.textContent = String(s);
      b.classList.toggle('is-cleared', cleared);
      b.classList.toggle('is-locked', !unlocked);
      b.classList.toggle('is-current', s === current);
      b.disabled = !unlocked;
      b.setAttribute(
        'aria-label',
        unlocked
          ? `Stage ${s}${cleared ? ', already finished' : ''}${s === current ? ', playing now' : ''}`
          : `Stage ${s}, not open yet — finish stage ${s - 1} first`
      );
      if (cleared) {
        const tick = document.createElement('span');
        tick.className = 'stagebtn__tick';
        tick.setAttribute('aria-hidden', 'true');
        tick.textContent = '✓';
        b.appendChild(tick);
      }
      b.addEventListener('click', () => start(s));
      picker.appendChild(b);
    }
  };

  /* ---------------------------------------------------------------- start */
  const start = (stage: number) => {
    if (!isUnlocked(challengeId, stage)) return;
    current = stage;
    solved = false;
    if (board) board.innerHTML = '';
    if (nextBtn) nextBtn.hidden = true;
    if (hintEl) hintEl.textContent = hint?.(stage) ?? '';
    buildPicker();
    onStart(stage, api);
  };

  /* ------------------------------------------------------------------ api */
  const api: StageApi = {
    get stage() {
      return current;
    },
    tell(message) {
      say(status, message);
    },
    nudge(message = 'Not that one — have another look.') {
      sfxNudge();
      say(status, message);
    },
    win(message) {
      // Guard against a double-fire from a fast double-tap.
      if (solved) return;
      solved = true;
      sfxYes();
      recordStage(challengeId, current);

      const last = current >= stages;
      if (last) {
        sfxDone();
        celebrate(root);
        say(status, message ?? `That was the last stage — you have finished the whole challenge!`);
      } else {
        say(status, message ?? `Stage ${current} done. Stage ${current + 1} is open now.`);
        if (nextBtn) {
          nextBtn.hidden = false;
          nextBtn.textContent = `Go to stage ${current + 1} →`;
        }
      }
      buildPicker();
    },
  };

  nextBtn?.addEventListener('click', () => start(Math.min(current + 1, stages)));
  replayBtn?.addEventListener('click', () => start(current));

  // Keep the picker honest if the journey is wiped from the progress page.
  onChange(() => {
    if (!isUnlocked(challengeId, current)) current = 1;
    buildPicker();
  });

  // Resume where the child left off: the first stage they have not cleared.
  const resumeAt = Math.min(bestStage(challengeId) + 1, stages);
  start(Math.max(1, resumeAt));

  return { start, api };
}
