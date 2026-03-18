import { Platform } from 'react-native';
import { type Storage } from '@reown/appkit-react-native';

// Memory fallback — used on web always, and as emergency fallback
const memoryStorage = new Map<string, string>();

// ── Web: polyfill localStorage BEFORE anything else tries to access it ──
if (Platform.OS === 'web') {
    try {
        // Test if real localStorage works
        window.localStorage.setItem('__k__', '1');
        window.localStorage.removeItem('__k__');
    } catch {
        // Blocked (SES sandbox, iframe, etc.) — install memory polyfill
        try {
            Object.defineProperty(window, 'localStorage', {
                value: {
                    getItem: (key: string) => memoryStorage.get(key) ?? null,
                    setItem: (key: string, value: string) => { memoryStorage.set(key, value); },
                    removeItem: (key: string) => { memoryStorage.delete(key); },
                    clear: () => { memoryStorage.clear(); },
                    key: (i: number) => Array.from(memoryStorage.keys())[i] ?? null,
                    get length() { return memoryStorage.size; },
                },
                writable: true,
                configurable: true,
            });
        } catch {
            // defineProperty also blocked — memoryStorage will be used directly below
        }
    }
}

// ── Native: use MMKV. Web: use localStorage / memory ──
let mmkv: import('react-native-mmkv').MMKV | null = null;

if (Platform.OS !== 'web') {
    // Lazy import so web bundle never touches MMKV
    const { createMMKV } = require('react-native-mmkv');
    mmkv = createMMKV();
}

function webGet(key: string): string | null {
    try { return window.localStorage.getItem(key); } catch { return memoryStorage.get(key) ?? null; }
}
function webSet(key: string, value: string): void {
    try { window.localStorage.setItem(key, value); } catch { memoryStorage.set(key, value); }
}
function webRemove(key: string): void {
    try { window.localStorage.removeItem(key); } catch { memoryStorage.delete(key); }
}
function webKeys(): string[] {
    try { return Object.keys(window.localStorage); } catch { return Array.from(memoryStorage.keys()); }
}

export const storage: Storage = {
    getKeys: async () => {
        if (mmkv) return mmkv.getAllKeys();
        return webKeys();
    },

    getEntries: async <T = any>(): Promise<[string, T][]> => {
        if (mmkv) {
            return mmkv.getAllKeys().map(key => {
                const val = mmkv!.getString(key);
                return [key, val ? JSON.parse(val) : undefined] as [string, T];
            });
        }
        return webKeys().map(key => {
            const val = webGet(key);
            return [key, val ? JSON.parse(val) : undefined] as [string, T];
        });
    },

    setItem: async <T = any>(key: string, value: T) => {
        const str = JSON.stringify(value);
        if (mmkv) { mmkv.set(key, str); } else { webSet(key, str); }
    },

    getItem: async <T = any>(key: string): Promise<T | undefined> => {
        const raw = mmkv ? mmkv.getString(key) : webGet(key);
        return raw ? JSON.parse(raw) : undefined;
    },

    removeItem: async (key: string) => {
        if (mmkv) { mmkv.delete(key); } else { webRemove(key); }
    },
};
