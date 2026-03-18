// appkit-storage MUST be first — installs localStorage polyfill before walletconnect touches it
import '@/lib/polyfill-storage';
import 'text-encoding';
import 'react-native-get-random-values';
import '@walletconnect/react-native-compat';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
global.process = require('process');
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';


import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useThemeConfig } from '@/components/ui/use-theme-config';
import { hydrateAuth } from '@/features/auth/use-auth-store';

import { APIProvider } from '@/lib/api';
import { loadSelectedTheme } from '@/lib/hooks/use-selected-theme';
import { wagmiAdapter, appkit } from '@/lib/appkit';
import { WagmiProvider } from 'wagmi';
import { AppKit, AppKitProvider } from '@reown/appkit-react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import  global CSS file
import '../global.css';

const queryClient = new QueryClient();

export { ErrorBoundary } from 'expo-router';

// eslint-disable-next-line react-refresh/only-export-components
export const unstable_settings = {
  initialRouteName: '(app)',
};

hydrateAuth();
loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

export default function RootLayout() {
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  return (
    <GestureHandlerRootView
      style={styles.container}
      // eslint-disable-next-line better-tailwindcss/no-unknown-classes
      className={theme.dark ? `dark` : undefined}
    >
      <KeyboardProvider>
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <AppKitProvider instance={appkit}>
              <ThemeProvider value={theme}>
                <APIProvider>
                  <BottomSheetModalProvider>
                    {children}
                    <FlashMessage position="top" />
                    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'box-none' as any }]}>
                      <AppKit />
                    </View>
                  </BottomSheetModalProvider>
                </APIProvider>
              </ThemeProvider>
            </AppKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
