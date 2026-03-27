import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

// Global memory storage to hold data if localStorage is blocked
const memoryStorage = new Map<string, string>();

const isLocalStorageAvailable = () => {
    if (!isWeb) return true;
    try {
        const storage = window.localStorage;
        if (!storage) return false;
        const testKey = '__storage_test__';
        storage.setItem(testKey, testKey);
        storage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
};

const hasStorage = isLocalStorageAvailable();

// 1. Global localStorage Polyfill
if (isWeb && !hasStorage) {
    console.log('[Polyfill] localStorage is restricted. Using memory fallback.');
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
        // Even defineProperty might throw in some tight SES environments
        (window as any).localStorage = {
            getItem: (key: string) => memoryStorage.get(key) || null,
            setItem: (key: string, value: string) => memoryStorage.set(key, value),
            removeItem: (key: string) => memoryStorage.delete(key),
            clear: () => memoryStorage.clear(),
        };
    }
}

// 2. Comprehensive MMKV Mock for Web
// This ensures that hooks like useMMKVBoolean don't crash with "getBoolean is not a function"
export class MMKVMock {
    private storage: Map<string, any>;

    constructor() {
        this.storage = new Map();
        // Sycn with localStorage if available
        if (hasStorage) {
            try {
                for (let i = 0; i < window.localStorage.length; i++) {
                    const key = window.localStorage.key(i);
                    if (key) this.storage.set(key, window.localStorage.getItem(key));
                }
            } catch (e) { }
        }
    }

    set(key: string, value: any) {
        this.storage.set(key, value);
        if (hasStorage) {
            try { window.localStorage.setItem(key, String(value)); } catch (e) { }
        }
    }

    getString(key: string) {
        const val = this.storage.get(key);
        return val !== undefined ? String(val) : undefined;
    }

    getBoolean(key: string) {
        const val = this.storage.get(key);
        if (typeof val === 'boolean') return val;
        if (val === 'true') return true;
        if (val === 'false') return false;
        return undefined;
    }

    getNumber(key: string) {
        const val = this.storage.get(key);
        return typeof val === 'number' ? val : (val ? Number(val) : undefined);
    }

    contains(key: string) { return this.storage.has(key); }

    remove(key: string) {
        this.storage.delete(key);
        if (hasStorage) {
            try { window.localStorage.removeItem(key); } catch (e) { }
        }
    }

    getAllKeys() { return Array.from(this.storage.keys()); }

    clearAll() {
        this.storage.clear();
        if (hasStorage) {
            try { window.localStorage.clear(); } catch (e) { }
        }
    }

    // Stub remaining MMKV methods
    getBuffer() { return undefined; }
    recrypt() { }
    trim() { }
    addOnValueChangedListener() { return { remove: () => { } }; }
    importAllFrom() { return 0; }
}

export const mmkvWebInstance = isWeb ? new MMKVMock() : null;
// 3. Web Polyfills for Native Modules (AppKit/WalletConnect support)
if (isWeb) {
    // Polyfill for Application module
    const applicationMock = {
        applicationId: 'finance.kindred.app',
        applicationName: 'KINDRED',
        packageId: 'finance.kindred.app',
        version: '1.0.0',
        buildNumber: '1',
        isAppInstalled: async () => false,
    };

    // Set on global for enhanced appkit compatibility
    (global as any).Application = applicationMock;

    // Polyfill for NativeModules
    try {
        const { NativeModules } = require('react-native');
        if (NativeModules && !NativeModules.Application) {
            NativeModules.Application = applicationMock;
        }
    } catch (e) {
        console.warn('[Polyfill] Failed to patch NativeModules.Application:', e);
    }

    // 4. NetInfo Polyfill for Web
    // This prevents "react-native-compat: @react-native-community/netinfo is not available"
    if (!(global as any).NetInfo) {
        (global as any).NetInfo = {
            addEventListener: () => () => { },
            fetch: async () => ({
                isConnected: true,
                isInternetReachable: true,
                type: 'wifi',
                details: { isConnectionExpensive: false }
            }),
            useNetInfo: () => ({
                isConnected: true,
                isInternetReachable: true,
                type: 'wifi',
                details: { isConnectionExpensive: false }
            })
        };
    }
}
