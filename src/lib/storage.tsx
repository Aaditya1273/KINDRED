import { Platform } from 'react-native';

// Web-safe storage — MMKV on native, localStorage on web
const isWeb = Platform.OS === 'web';

let _mmkv: import('react-native-mmkv').MMKV | null = null;
if (!isWeb) {
  const { createMMKV } = require('react-native-mmkv');
  _mmkv = createMMKV();
}

function webGet(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function webSet(key: string, value: string): void {
  try { window.localStorage.setItem(key, value); } catch {}
}
function webDel(key: string): void {
  try { window.localStorage.removeItem(key); } catch {}
}

export const storage = {
  getString: (key: string): string | undefined => {
    if (_mmkv) return _mmkv.getString(key);
    return webGet(key) ?? undefined;
  },
  set: (key: string, value: string): void => {
    if (_mmkv) { _mmkv.set(key, value); } else { webSet(key, value); }
  },
  delete: (key: string): void => {
    if (_mmkv) { _mmkv.delete(key); } else { webDel(key); }
  },
  getAllKeys: (): string[] => {
    if (_mmkv) return _mmkv.getAllKeys();
    try { return Object.keys(window.localStorage); } catch { return []; }
  },
};

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  return value ? JSON.parse(value) ?? null : null;
}

export async function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  storage.delete(key);
}
