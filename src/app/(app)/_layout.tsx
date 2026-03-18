import { Redirect, SplashScreen, Tabs } from 'expo-router';
import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store';
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time';
import { Home, MessageCircle, PieChart, Shield, Settings } from 'lucide-react-native';
import { Colors } from '@/theme/tokens';

export default function TabLayout() {
    const status = useAuth.use.status();
    const [isFirstTime] = useIsFirstTime();
    const hideSplash = useCallback(async () => { await SplashScreen.hideAsync(); }, []);

    useEffect(() => {
        if (status !== 'idle') {
            const timer = setTimeout(() => { hideSplash(); }, 1000);
            return () => clearTimeout(timer);
        }
    }, [hideSplash, status]);

    if (isFirstTime) return <Redirect href="/onboarding" />;

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: Colors.cyan,
            tabBarInactiveTintColor: 'rgba(255,255,255,0.25)',
            tabBarStyle: {
                backgroundColor: Colors.surface,
                borderTopWidth: 1,
                borderTopColor: Colors.border,
                height: 85,
                paddingBottom: 25,
            },
            tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
            headerShown: false,
        }}>
            <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} />
            <Tabs.Screen name="agent" options={{ title: 'Agent', tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} /> }} />
            <Tabs.Screen name="portfolio" options={{ title: 'Portfolio', tabBarIcon: ({ color, size }) => <PieChart color={color} size={size} /> }} />
            <Tabs.Screen name="trust" options={{ title: 'Trust', tabBarIcon: ({ color, size }) => <Shield color={color} size={size} /> }} />
            <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Settings color={color} size={size} /> }} />
            {/* Hidden routes */}
            <Tabs.Screen name="style" options={{ href: null }} />
            <Tabs.Screen name="yield" options={{ href: null }} />
            <Tabs.Screen name="history" options={{ href: null }} />
        </Tabs>
    );
}
