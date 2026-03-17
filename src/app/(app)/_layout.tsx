import { Redirect, SplashScreen, Tabs } from 'expo-router';
import * as React from 'react';
import { useCallback, useEffect } from 'react';

import {
    TrendingUp as WealthIcon,
    Brain as AgentIcon,
    Settings as SettingsIcon,
    History as HistoryIcon,
    Zap as YieldIcon,
} from 'lucide-react-native';
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store';
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time';

export default function TabLayout() {
    const status = useAuth.use.status();
    const [isFirstTime] = useIsFirstTime();
    const hideSplash = useCallback(async () => {
        await SplashScreen.hideAsync();
    }, []);

    useEffect(() => {
        if (status !== 'idle') {
            const timer = setTimeout(() => { hideSplash(); }, 1000);
            return () => clearTimeout(timer);
        }
    }, [hideSplash, status]);

    if (isFirstTime) {
        return <Redirect href="/onboarding" />;
    }

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#00F5FF',
            tabBarInactiveTintColor: '#4B5563',
            tabBarStyle: {
                backgroundColor: '#000000',
                borderTopWidth: 0,
                height: 85,
                paddingBottom: 25,
            },
            headerShown: false,
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Wealth',
                    tabBarIcon: ({ color, size }) => <WealthIcon color={color} size={size} />,
                    tabBarButtonTestID: 'wealth-tab',
                }}
            />
            <Tabs.Screen
                name="yield"
                options={{
                    title: 'Yield',
                    tabBarIcon: ({ color, size }) => <YieldIcon color={color} size={size} />,
                    tabBarButtonTestID: 'yield-tab',
                }}
            />
            <Tabs.Screen
                name="agent"
                options={{
                    title: 'Brain',
                    tabBarIcon: ({ color, size }) => <AgentIcon color={color} size={size} />,
                    tabBarButtonTestID: 'agent-tab',
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color, size }) => <HistoryIcon color={color} size={size} />,
                    tabBarButtonTestID: 'history-tab',
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />,
                    tabBarButtonTestID: 'settings-tab',
                }}
            />
            {/* Hide style demo tab from nav */}
            <Tabs.Screen name="style" options={{ href: null }} />
        </Tabs>
    );
}
