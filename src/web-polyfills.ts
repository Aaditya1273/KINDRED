/**
 * Web polyfills — loaded FIRST via index.web.js before any other module.
 * Installs localStorage memory fallback synchronously.
 */

const mem = new Map<string, string>();

const memStorage = {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => { mem.set(k, v); },
  removeItem: (k: string) => { mem.delete(k); },
  clear: () => { mem.clear(); },
  key: (i: number) => Array.from(mem.keys())[i] ?? null,
  get length() { return mem.size; },
};

// Test if real localStorage is accessible
let needsPolyfill = false;
try {
  window.localStorage.setItem('__t__', '1');
  window.localStorage.removeItem('__t__');
} catch {
  needsPolyfill = true;
}

if (needsPolyfill) {
  try {
    Object.defineProperty(window, 'localStorage', {
      value: memStorage,
      writable: true,
      configurable: true,
    });
  } catch {
    // already defined and non-configurable — nothing w