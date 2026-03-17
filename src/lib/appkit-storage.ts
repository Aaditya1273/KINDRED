import { createMMKV } from 'react-native-mmkv';
import { type Storage } from '@reown/appkit-react-native';
import { Platform } from 'react-native';

// Memory fallback for environments where localStorage is blocked (e.g. SES or restricted iframes)
const memoryStorage = new Map<string, string>();

const isLocalStorageAvailable = () => {
    if (Platform.OS !== 'web') return true;
    try {
        const testKey = '__storage_test__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
};

const hasStorage = isLocalStorageAvailable();

// Global polyfill for libraries that access localStorage directly (e.g. Wagmi, AppKit internals)
if (Platform.OS === 'web' && !hasStorage) {
    try {
        const mockStorage = {
            getItem: (key: string) => memoryStorage.get(key) || null,
            setItem: (key: string, value: string) => memoryStorage.set(key, value),
            removeItem: (key: string) => memoryStorage.delete(key),
            clear: () => memoryStorage.clear(),
            key: (i: number) => Array.from(memoryStorage.keys())[i] || null,
            get length() { return memoryStorage.size; }
        };
        Object.defineProperty(window, 'localStorage', {
            value: mockStorage,
            writable: true,
            configurable: true
        });
    } catch (e) {
        console.warn('Failed to polyfill localStorage:', e);
    }
}

const mmkv = hasStorage ? createMMKV() : null;

export const storage: Storage = {
    getKeys: async () => {
        if (mmkv) return mmkv.getAllKeys();
        return Array.from(memoryStorage.keys());
    },
    getEntries: async <T = any>(): Promise<[string, T][]> => {
        if (mmkv) {
            const keys = mmkv.getAllKeys();
            return keys.map(key => {
                const val = mmkv.getString(key);
                return [key, val ? JSON.parse(val) : undefined];
            });
        }
        return Array.from(memoryStorage.entries()).map(([key, val]) => [
            key,
            val ? JSON.parse(val) : undefined
        ]);
    },
    setItem: async <T = any>(key: string, value: T) => {
        const str = JSON.stringify(value);
        if (mmkv) {
            mmkv.set(key, str);
        } else {
            memoryStorage.set(key, str);
        }
    },
    getItem: async <T = any>(key: string): Promise<T | undefined> => {
        const item = mmkv ? mmkv.getString(key) : memoryStorage.get(key);
        return item ? JSON.parse(item) : undefined;
    },
    removeItem: async (key: string) => {
        if (mmkv) {
            mmkv.remove(key);
        } else {
            memoryStorage.delete(key);
        }
    }
};
