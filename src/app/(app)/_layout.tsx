import { Redirect, SplashScreen, Tabs } from 'expo-router';
import * as React from 'react';
import { View, Platform } from 'react-native';
import { useCallback, useEffect } from 'react';
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store';
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time';
import { Home, Sparkle, PieChart, HelpCircle, User2, Shield, ScrollText } from 'lucide-react-native';
import { useAppTheme } from '@/theme/tokens';

export default function TabLayout() {
    const status = useAuth.use.status();
    const [isFirstTime] = useIsFirstTime();
    const theme = useAppTheme();

    const hideSplash = useCallback(async () => {
        try { await SplashScreen.hideAsync(); } catch (e) { }
    }, []);

    useEffect(() => {
        if (status !== 'idle') {
            const timer = setTimeout(() => { hideSplash(); }, 1000);
            return () => clearTimeout(timer);
        }
    }, [hideSplash, status]);

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.textSecondary,
            tabBarStyle: {
                backgroundColor: theme.isDark ? '#0A0A0A' : '#FFFFFF',
                borderTopWidth: 1,
                borderTopColor: theme.border,
                height: Platform.OS === 'ios' ? 88 : 70,
                paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                paddingTop: 10,
                elevation: 0,
                shadowOpacity: 0,
            },
            tabBarItemStyle: {
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
            },
            tabBarLabelStyle: { fontSize: 0, opacity: 0, display: 'none' }, // Completely hide labels
            headerShown: false,
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size + 4} strokeWidth={2.5} />
                }}
            />
            <Tabs.Screen
                name="trust"
                options={{
                    title: 'Agent',
                    tabBarIcon: ({ color, size }) => <User2 color={color} size={size + 4} strokeWidth={2.5} />
                }}
            />
            <Tabs.Screen
                name="agent"
                options={{
                    title: 'Spark',
                    tabBarIcon: ({ color, size }) => (
                        <View style={[styles.sparkContainer, { backgroundColor: '#0A0A0A' }]}>
                            <Sparkle color={theme.primary} size={28} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="activity"
                options={{
                    title: 'Logs',
                    tabBarIcon: ({ color, size }) => <ScrollText color={color} size={size + 4} strokeWidth={2.5} />
                }}
            />
            <Tabs.Screen
                name="privacy-vault"
                options={{
                    title: 'Vault',
                    tabBarIcon: ({ color, size }) => <Shield color={color} size={size + 4} strokeWidth={2.5} />
                }}
            />
            {/* Hidden routes */}
            <Tabs.Screen name="portfolio" options={{ href: null }} />
            <Tabs.Screen name="faq" options={{ href: null }} />
            <Tabs.Screen name="style" options={{ href: null }} />
            <Tabs.Screen name="yield" options={{ href: null }} />
            <Tabs.Screen name="history" options={{ href: null }} />
        </Tabs>
    );
}

const styles = {
    sparkContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Platform.OS === 'web' ? -10 : -25, // Float slightly above
        borderWidth: 2,
        borderColor: '#FF7B1A',
        // Shadow/Glow effect
        shadowColor: '#FF7B1A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    }
} as any;
