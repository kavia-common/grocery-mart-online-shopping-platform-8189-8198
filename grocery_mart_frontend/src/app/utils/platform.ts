/* Avoid direct references to browser globals to keep SSR/lint clean. */

/* Ambient declarations to satisfy TypeScript without requiring DOM libs at build time. */
declare const window: any;
declare const document: any;

/** Whether running in a browser (has window and document). */
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

// PUBLIC_INTERFACE
/** Safe access to window only in browser context. Returns undefined on server. */
export function getWindow(): any | undefined {
  return isBrowser ? window : undefined;
}

// PUBLIC_INTERFACE
/** Safe access to localStorage. Provides an in-memory shim on server. */
export const safeStorage: any = (() => {
  const w = getWindow();
  if (w && w.localStorage) {
    return w.localStorage;
  }
  // minimal shim for server/build contexts
  const mem = new Map<string, string>();
  return {
    get length() { return mem.size; },
    clear: () => mem.clear(),
    getItem: (key: string) => (mem.has(key) ? mem.get(key)! : null),
    key: (index: number) => Array.from(mem.keys())[index] ?? null,
    removeItem: (key: string) => { mem.delete(key); },
    setItem: (key: string, value: string) => { mem.set(key, String(value)); }
  };
})();

// PUBLIC_INTERFACE
/** Builds a URL string by appending query params safely without using global URL constructor directly. */
export function buildUrl(basePath: string, params?: Record<string, string | undefined | null>): string {
  if (!params) return basePath;
  const w = getWindow();
  // Use native URLSearchParams if present, otherwise simple manual concat.
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && String(v).length > 0) as [string, string][];
  if (entries.length === 0) return basePath;
  if (w && typeof w.URLSearchParams !== 'undefined') {
    const usp = new w.URLSearchParams();
    for (const [k, v] of entries) usp.set(k, String(v));
    const qs = usp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }
  const esc = (s: string) => encodeURIComponent(s);
  const qs = entries.map(([k, v]) => `${esc(k)}=${esc(String(v))}`).join('&');
  return qs ? `${basePath}?${qs}` : basePath;
}
