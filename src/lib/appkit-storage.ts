import { createMMKV } from 'react-native-mmkv';
import { type Storage } from '@reown/appkit-react-native';
import { Platform } from 'react-native';
import { mmkvWebInstance } from './polyfill-storage';

const isWeb = Platform.OS === 'web';

// Use polyfilled MMKV instance on web, real MMKV on native
const mmkv = isWeb ? mmkvWebInstance : createMMKV();

export const storage: Storage = {
    getKeys: async () => {
        return mmkv?.getAllKeys() ?? [];
    },
    getEntries: async <T = any>(): Promise<[string, T][]> => {
        if (!mmkv) return [];
        const keys = mmkv.getAllKeys();
        return keys.map(key => {
            const val = mmkv.getString(key);
            try {
                return [key, val ? JSON.parse(val) : undefined] as [string, T];
            } catch {
                return [key, undefined] as [string, T];
            }
        });
    },
    setItem: async <T = any>(key: string, value: T) => {
        mmkv?.set(key, JSON.stringify(value));
    },
    getItem: async <T = any>(key: string): Promise<T | undefined> => {
        const item = mmkv?.getString(key);
        try {
            return item ? JSON.parse(item) : undefined;
        } catch {
            return undefined;
        }
    },
    removeItem: async (key: string) => {
        mmkv?.remove(key);
    }
};
