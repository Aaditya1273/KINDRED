import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { View, Platform, StyleSheet, Pressable, Text, Image, Dimensions } from 'react-native';
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store';
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time';
import { Home, Sparkle, PieChart, HelpCircle, User2, Shield, ScrollText } from 'lucide-react-native';
import { useAppTheme } from '@/theme/tokens';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VISIBLE_TABS = ['index', 'data-control', 'agent', 'activity', 'privacy-vault'];

function CustomTabBar({ state, descriptors, navigation }: any) {
    const theme = useAppTheme();
    const insets = useSafeAreaInsets();
    const [barWidth, setBarWidth] = React.useState(0);

    // Aesthetic Constants
    const BAR_HEIGHT = 76;
    const PILL_MARGIN = 16;
    const NAVEL_DEPTH = 36;

    const getPath = (width: number) => {
        const radius = 38;
        return `
            M ${radius} 0 
            L ${width - radius} 0 
            Q ${width} 0, ${width} ${radius}
            L ${width} ${BAR_HEIGHT - radius}
            Q ${width} ${BAR_HEIGHT}, ${width - radius} ${BAR_HEIGHT}
            L ${radius} ${BAR_HEIGHT}
            Q 0 ${BAR_HEIGHT}, 0 ${BAR_HEIGHT - radius}
            L 0 ${radius}
            Q 0 0, ${radius} 0
            Z
        `;
    };

    const isDark = theme.isDark;
    const barBgColor = isDark ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.98)';
    const strokeColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)';

    const visibleRoutes = VISIBLE_TABS.map(tabName =>
        state.routes.find((r: any) => r.name === tabName)
    ).filter(Boolean);

    const itemWidth = barWidth / 5;

    return (
        <View
            style={[styles.tabContainer, { bottom: insets.bottom + 12 }]}
            onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        >
            {barWidth > 0 && (
                <View style={{ width: barWidth, height: BAR_HEIGHT }}>
                    {/* Layer 1: The Floating Pill with Navel */}
                    <View style={styles.svgWrapper}>
                        <Svg width={barWidth} height={BAR_HEIGHT + 20} viewBox={`0 0 ${barWidth} ${BAR_HEIGHT}`}>
                            <Path
                                d={getPath(barWidth)}
                                fill={barBgColor}
                                stroke={strokeColor}
                                strokeWidth="1.5"
                            />
                        </Svg>
                    </View>

                    {/* Layer 2: Icons */}
                    <View style={styles.tabItems}>
                        {visibleRoutes.map((route: any, index: number) => {
                            const { options } = descriptors[route.key];
                            const isFocused = state.routes[state.index].name === route.name;

                            const onPress = () => {
                                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                                if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            };

                            const Icon = options.tabBarIcon;

                            return (
                                <Pressable
                                    key={route.key}
                                    onPress={onPress}
                                    style={[styles.tabItem, { width: itemWidth }]}
                                >
                                    {route.name === 'agent' ? (
                                        <View style={[styles.sparkBall, { backgroundColor: isDark ? '#000' : theme.primary }]}>
                                            <Sparkle color={isDark ? theme.primary : '#fff'} size={32} />
                                            <View style={styles.ballShine} />
                                        </View>
                                    ) : (
                                        <View style={styles.iconContainer}>
                                            {Icon && Icon({ color: isFocused ? theme.primary : isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.3)', size: 26 })}
                                            <Text style={[styles.tabLabel, { color: isFocused ? theme.primary : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }]}>
                                                {options.title}
                                            </Text>
                                        </View>
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} strokeWidth={2.5} /> }} />
            <Tabs.Screen name="data-control" options={{ title: 'Vault', tabBarIcon: ({ color, size }) => <PieChart color={color} size={size} strokeWidth={2.5} /> }} />
            <Tabs.Screen name="agent" options={{ title: 'Spark' }} />
            <Tabs.Screen name="activity" options={{ title: 'History', tabBarIcon: ({ color, size }) => <ScrollText color={color} size={size} strokeWidth={2.5} /> }} />
            <Tabs.Screen name="privacy-vault" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <User2 color={color} size={size} strokeWidth={2.5} /> }} />

            {/* Hidden routes */}
            <Tabs.Screen name="trust" options={{ href: null }} />
            <Tabs.Screen name="portfolio" options={{ href: null }} />
            <Tabs.Screen name="faq" options={{ href: null }} />
            <Tabs.Screen name="history" options={{ href: null }} />
            <Tabs.Screen name="settings" options={{ href: null }} />
            <Tabs.Screen name="style" options={{ href: null }} />
            <Tabs.Screen name="yield" options={{ href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        position: 'absolute',
        left: 20,
        right: 20,
        zIndex: 10000,
        alignItems: 'center',
    },
    svgWrapper: {
        ...StyleSheet.absoluteFillObject,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 24 },
            web: { filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.15))' }
        })
    },
    tabItems: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
    },
    tabItem: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '700',
        marginTop: 2,
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginTop: 4,
    },
    sparkBall: {
        width: 68,
        height: 68,
        borderRadius: 34,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        marginTop: -34, // Centered on the top edge
        ...Platform.select({
            ios: { shadowColor: '#FF7B1A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 12 },
            web: {
                boxShadow: '0 8px 30px rgba(255,123,26,0.5)',
                outline: 'none'
            }
        })
    },
    ballShine: {
        position: 'absolute',
        top: 8,
        left: 14,
        width: 14,
        height: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.35)',
        transform: [{ rotate: '-30deg' }]
    }
});
