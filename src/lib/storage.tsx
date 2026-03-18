import { Platform } from 'react-native';
import { mmkvWebInstance } from './polyfill-storage';

// Web-safe storage — MMKV on native, localStorage on web (via polyfill)
const isWeb = Platform.OS === 'web';

let _mmkv: import('react-native-mmkv').MMKV | any = null;
if (!isWeb) {
  const { createMMKV } = require('react-native-mmkv');
  _mmkv = createMMKV();
} else {
  _mmkv = mmkvWebInstance;
}

export const storage = {
  getString: (key: string): string | undefined => _mmkv?.getString(key),
  set: (key: string, value: string): void => _mmkv?.set(key, value),
  delete: (key: string): void => _mmkv?.remove(key),
  getAllKeys: (): string[] => _mmkv?.getAllKeys() ?? [],
  getBoolean: (key: string): boolean | undefined => _mmkv?.getBoolean(key),
  getNumber: (key: string): number | undefined => _mmkv?.getNumber(key),
  // Add listeners for MMKV compatibility
  addOnValueChangedListener: (cb: (key: string) => void) => _mmkv?.addOnValueChangedListener(cb) ?? { remove: () => { } },
};

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  try {
    return value ? JSON.parse(value) ?? null : null;
  } catch {
    return null;
  }
}

export async function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  storage.delete(key);
}
