import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { Zap, Shield, TrendingUp, PieChart, ArrowUpRight, ArrowDownLeft, Wallet, HelpCircle, Bell, Sliders, Plus, Pause, Activity, TrendingDown } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn, FadeInRight } from 'react-native-reanimated';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { useAccount } from '@reown/appkit-react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { AppHeader } from '@/components/reborn/AppHeader';

const WealthChart = ({ color }: { color: string }) => {
    const theme = useAppTheme();
    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <View>
                    <Text style={[styles.chartValue, { color: theme.textPrimary }]}>$42,840.50</Text>
                    <Text style={[styles.chartLabel, { color: theme.positive }]}>+12.4% (7D)</Text>
                </View>
                <View style={styles.chartActions}>
                    {['1W', '1M', '1Y', 'ALL'].map((p) => (
                        <Pressable key={p} style={[styles.timeBtn, p === '1W' && { backgroundColor: theme.primary + '20' }]}>
                            <Text style={[styles.timeBtnText, { color: p === '1W' ? theme.primary : theme.textMuted }]}>{p}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
            <View style={{ height: 160, width: '100%', marginTop: 20 }}>
                <Svg height="100%" width="100%" viewBox="0 0 100 40">
                    <Defs>
                        <SvgGradient id="gradWealth" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={color} stopOpacity="0.15" />
                            <Stop offset="1" stopColor={color} stopOpacity="0" />
                        </SvgGradient>
                    </Defs>
                    <Path
                        d="M0 38 Q 15 35, 25 25 T 45 30 T 65 15 T 85 20 T 100 8 L 100 40 L 0 40 Z"
                        fill="url(#gradWealth)"
                    />
                    <Path
                        d="M0 38 Q 15 35, 25 25 T 45 30 T 65 15 T 85 20 T 100 8"
                        fill="none"
                        stroke={color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
                <View style={[styles.gridLine, { top: '30%', backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]} />
                <View style={[styles.gridLine, { top: '60%', backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]} />
            </View>
        </View>
    );
};

const NotificationItem = ({ icon: Icon, title, desc, time }: any) => {
    const theme = useAppTheme();
    return (
        <View style={styles.notifItem}>
            <View style={styles.notifHeader}>
                <View style={[styles.notifIcon, { backgroundColor: theme.primary + '15' }]}>
                    <Icon size={18} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.notifTitle, { color: theme.textPrimary }]}>{title}</Text>
                    <Text style={[styles.notifTime, { color: theme.textMuted }]}>{time}</Text>
                </View>
            </View>
            <Text style={[styles.notifDesc, { color: theme.textSecondary }]}>{desc}</Text>
        </View>
    );
};

const QuickActionButton = ({ icon: Icon, label, delay, hasBorder }: any) => {
    const theme = useAppTheme();
    return (
        <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.actionContainer}>
            <Pressable
                style={[
                    styles.actionBtn,
                    {
                        backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
                        borderColor: hasBorder ? theme.primary : theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        borderWidth: 1,
                        overflow: 'hidden',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }
                ]}
            >
                <BlurView
                    intensity={Platform.OS === 'web' ? 10 : 20}
                    tint={theme.isDark ? 'dark' : 'light'}
                    style={StyleSheet.absoluteFill}
                />
                <View style={{ zIndex: 10 }}>
                    <Icon size={24} color={theme.textPrimary} />
                </View>
            </Pressable>
            <Text style={[styles.actionBtnLabel, { color: theme.textSecondary }]}>{label}</Text>
        </Animated.View>
    );
};

const Card = ({ children, style }: any) => {
    const theme = useAppTheme();
    return (
        <View style={[styles.cardBase, { backgroundColor: theme.surface, borderColor: theme.border }, style]}>
            {children}
        </View>
    );
};

export default function RebornDashboard() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const { address, isConnected } = useAccount();
    const portfolio = useAgentStore.use.portfolio();
    const loadMemory = useAgentStore.use.loadMemory();
    const refreshPortfolio = useAgentStore.use.refreshPortfolio();

    React.useEffect(() => {
        loadMemory();
        if (address) refreshPortfolio(address);
    }, [address]);

    return (
        <View style={[styles.root, { backgroundColor: theme.bg }]}>
            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md, paddingBottom: 100 }]}
                showsVerticalScrollIndicator={false}
            >
                <AppHeader />

                {/* Greeting */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={[styles.heroGreeting, { color: theme.textSecondary }]}>Good morning KINDRED</Text>
                    <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>Your Workspace</Text>
                </View>

                {/* Hero Glass Card */}
                <Animated.View
                    entering={FadeInDown.delay(100).duration(800)}
                    style={[styles.heroCard, { borderColor: theme.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }]}
                >
                    <BlurView intensity={Platform.OS === 'web' ? 20 : 40} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    <LinearGradient
                        colors={theme.isDark ? ['rgba(255,123,26,0.15)', 'transparent'] : ['rgba(255,123,26,0.05)', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />

                    <View style={styles.heroInner}>
                        <View style={styles.heroHeader}>
                            <View>
                                <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>NET WORTH</Text>
                                <Text style={[styles.heroValue, { color: theme.textPrimary }]}>$42,840.50</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: theme.positive + '15' }]}>
                                <View style={[styles.statusDot, { backgroundColor: theme.positive }]} />
                                <Text style={[styles.statusText, { color: theme.positive }]}>AI: OPTIMIZING</Text>
                            </View>
                        </View>

                        <View style={styles.heroStats}>
                            <View style={styles.statItem}>
                                <TrendingUp size={16} color={theme.positive} />
                                <Text style={[styles.statNum, { color: theme.positive }]}>+12.4%</Text>
                                <Text style={[styles.statDesc, { color: theme.textMuted }]}>Weekly</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Shield size={16} color={theme.primary} />
                                <Text style={[styles.statNum, { color: theme.textPrimary }]}>98%</Text>
                                <Text style={[styles.statDesc, { color: theme.textMuted }]}>Security</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Quick Action Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Quick Action</Text>
                </View>
                <View style={styles.actionGrid}>
                    <QuickActionButton icon={Plus} label="Add Cash" delay={100} />
                    <QuickActionButton icon={ArrowDownLeft} label="Exchange" delay={200} />
                    <QuickActionButton icon={ArrowUpRight} label="Withdraw" delay={300} />
                    <QuickActionButton icon={Pause} label="Pause AI" delay={400} hasBorder />
                </View>

                {/* Historical Growth */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Historical Growth</Text>
                </View>
                <Animated.View entering={FadeInDown.delay(450).duration(600)}>
                    <Card style={styles.chartCard}>
                        <WealthChart color={theme.primary} />
                    </Card>
                </Animated.View>

                {/* Agent Insights */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Agent Insights</Text>
                    <View style={[styles.badge, { backgroundColor: theme.positive + '15' }]}>
                        <Text style={[styles.badgeText, { color: theme.positive }]}>3 new</Text>
                    </View>
                </View>

                <Animated.View entering={FadeInRight.delay(500).duration(600)} style={[styles.notifCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <NotificationItem
                        icon={TrendingUp}
                        title="Smart Cash Opportunity"
                        desc="KINDRED detected a +4.2% yield increase on FLOW. Autonomy protocol ready."
                        time="Now"
                    />
                    <View style={styles.notifDivider} />
                    <NotificationItem
                        icon={Activity}
                        title="Live Log"
                        desc="Shifted funds to vault via Flow AA."
                        time="1m ago"
                    />
                    <View style={styles.notifDivider} />
                    <NotificationItem
                        icon={Shield}
                        title="Risk Guard"
                        desc="Skipped trade due to high slippage risk."
                        time="5m ago"
                    />
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { paddingHorizontal: 20 },

    heroGreeting: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
    heroTitle: { fontSize: 28, fontWeight: '800' },

    heroCard: {
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        marginBottom: 32,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
            web: { boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }
        })
    },
    heroInner: { padding: 24 },
    heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
    heroLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
    heroValue: { fontSize: 36, fontWeight: '900' },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

    heroStats: { flexDirection: 'row', alignItems: 'center', gap: 24, marginTop: 8 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statNum: { fontSize: 16, fontWeight: '800' },
    statDesc: { fontSize: 12 },
    statDivider: { width: 1, height: 20, backgroundColor: 'rgba(0,0,0,0.1)' },

    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '700' },

    actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
    actionContainer: { alignItems: 'center', gap: 8 },
    actionBtn: {
        width: 68, height: 68, borderRadius: 24,
        alignItems: 'center', justifyContent: 'center',
    },
    actionBtnLabel: { fontSize: 12, fontWeight: '600' },

    chartCard: { padding: 0, overflow: 'hidden', marginBottom: 32 },
    chartContainer: { padding: 24 },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    chartValue: { fontSize: 24, fontWeight: '800' },
    chartLabel: { fontSize: 13, fontWeight: '600', marginTop: 2 },
    chartActions: { flexDirection: 'row', gap: 8, backgroundColor: 'rgba(0,0,0,0.03)', padding: 4, borderRadius: 12 },
    timeBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    timeBtnText: { fontSize: 11, fontWeight: '700' },
    gridLine: { position: 'absolute', left: 0, right: 0, height: 1 },

    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeText: { fontSize: 11, fontWeight: '700' },

    cardBase: { borderRadius: 28, borderWidth: 1 },
    notifCard: { padding: 16, borderRadius: 28, borderWidth: 1 },
    notifDivider: { height: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 12 },
    notifItem: { gap: 8 },
    notifHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    notifIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    notifTitle: { fontSize: 13, fontWeight: '700' },
    notifTime: { fontSize: 10, marginTop: 1 },
    notifDesc: { fontSize: 12, lineHeight: 16, paddingLeft: 44 },
});
