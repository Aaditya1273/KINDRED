import { useState, useCallback, useEffect } from 'react';
import { useMMKVBoolean } from 'react-native-mmkv';
import { Platform } from 'react-native';
import { storage } from '../storage';

const IS_FIRST_TIME = 'IS_FIRST_TIME';
const isWeb = Platform.OS === 'web';

export function useIsFirstTime() {
  if (isWeb) {
    const [val, setVal] = useState<boolean>(() => {
      const stored = storage.getBoolean(IS_FIRST_TIME);
      return stored === undefined ? true : stored;
    });

    const setValSafe = useCallback((newValue: boolean) => {
      storage.set(IS_FIRST_TIME, String(newValue));
      setVal(newValue);
    }, []);

    return [val, setValSafe] as const;
  }

  // Native continues using the real hook
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isFirstTime, setIsFirstTime] = useMMKVBoolean(IS_FIRST_TIME, storage as any);
  if (isFirstTime === undefined) {
    return [true, setIsFirstTime] as const;
  }
  return [isFirstTime, setIsFirstTime] as const;
}
