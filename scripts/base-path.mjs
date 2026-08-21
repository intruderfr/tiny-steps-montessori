/**
 * Normalises BASE_PATH into a single canonical form.
 *
 * Accepts "tiny-steps", "/tiny-steps", "/tiny-steps/" or "" and always returns
 * either "" (site served from a domain root) or "/tiny-steps".
 *
 * The leniency is deliberate: Git Bash on Windows rewrites a leading-slash
 * environment value into a Windows path (BASE_PATH=/foo arrives as
 * C:/Program Files/Git/foo), which silently corrupts every generated URL. Taking
 * the value without a leading slash sidesteps that entirely, and the guard below
 * catches it if someone passes one anyway.
 */
export function normaliseBase(raw) {
  let v = (raw ?? '').trim();

  // Undo Git Bash POSIX-path mangling: keep only the final path segment.
  if (/^[A-Za-z]:[\\/]/.test(v)) {
    v = v.split(/[\\/]/).filter(Boolean).pop() ?? '';
  }

  v = v.replace(/^\/+/, '').replace(/\/+$/, '');
  return v ? `/${v}` : '';
}

export const BASE = normaliseBase(process.env.BASE_PATH);
