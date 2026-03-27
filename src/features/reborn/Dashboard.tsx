import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { Zap, Shield, TrendingUp, PieChart, ArrowUpRight, ArrowDownLeft, Wallet, HelpCircle } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn, FadeInRight } from 'react-native-reanimated';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { useAccount } from '@reown/appkit-react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Bell, ChevronRight, UserPlus, Clock, Briefcase, CreditCard, Activity, Pause, Play, Plus } from 'lucide-react-native';
import { Svg, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';


const WealthChart = ({ color }: { color: string }) => (
    <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
            <View>
                <Text style={styles.chartValue}>$1,240.20</Text>
                <Text style={styles.chartLabel}>+12.4% (7D)</Text>
            </View>
            <View style={styles.chartActions}>
                {['1W', '1M', '1Y', 'ALL'].map((p) => (
                    <Pressable key={p} style={[styles.timeBtn, p === '1W' && { backgroundColor: color + '20' }]}>
                        <Text style={[styles.timeBtnText, { color: p === '1W' ? color : 'rgba(0,0,0,0.4)' }]}>{p}</Text>
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
            {/* Minimal Grid lines */}
            <View style={[styles.gridLine, { top: '30%' }]} />
            <View style={[styles.gridLine, { top: '60%' }]} />
        </View>
    </View>
);

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

export default function RebornDashboard() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const { address, isConnected } = useAccount();
    const portfolio = useAgentStore.use.portfolio();
    const logs = useAgentStore.use.logs();
    const loadMemory = useAgentStore.use.loadMemory();
    const refreshPortfolio = useAgentStore.use.refreshPortfolio();

    React.useEffect(() => {
        loadMemory();
        if (address) refreshPortfolio(address);
    }, [address]);

    const balance = portfolio?.totalUSD ?? 0;
    const change = portfolio?.change24h ?? 0;

    const renderHeader = () => (
        <View style={styles.topHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Pressable
                    onPress={() => router.push('/portfolio')}
                    style={[styles.profileCircle, { backgroundColor: theme.surface }]}
                >
                    <View style={{ width: '100%', height: '100%', borderRadius: 20, backgroundColor: theme.primary + '20' }} />
                </Pressable>
                <Pressable
                    onPress={() => router.push('/faq')}
                    style={[styles.calendarIcon, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                    <HelpCircle size={20} color={theme.primary} />
                </Pressable>
            </View>
            <Pressable style={[styles.calendarIcon, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Calendar size={20} color={theme.textPrimary} />
            </Pressable>
        </View>
    );

    return (
        <View style={[styles.root, { backgroundColor: theme.bg }]}>
            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md }]}
                showsVerticalScrollIndicator={false}
            >
                {renderHeader()}

                {/* Hero Workspace Card */}
                <Animated.View entering={FadeInDown.duration(600)} style={[styles.heroCard, { backgroundColor: theme.isDark ? '#0A0A0B' : '#0D0E12' }]}>
                    <View style={styles.heroTopRow}>
                        <View style={styles.heroTextContent}>
                            <Text style={styles.heroGreeting}>Good morning KINDRED</Text>
                            <Text style={styles.heroTitle}>Your Portfolio</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: theme.positive + '20' }]}>
                            <View style={[styles.statusDot, { backgroundColor: theme.positive }]} />
                            <Text style={[styles.statusText, { color: theme.positive }]}>AI: OPTIMIZING</Text>
                        </View>
                    </View>

                    <LinearGradient
                        colors={[theme.primary, '#FF4D4D']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statsGradientCard}
                    >
                        <View style={styles.statsRow}>
                            <View style={styles.statCol}>
                                <Text style={styles.statLabel}>Total Net Worth</Text>
                                <Text style={styles.statValue}>${(balance / 1000).toFixed(1)}K</Text>
                                <Text style={styles.statSubText}>{change >= 0 ? '+' : ''}{change.toFixed(1)}% This week</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statCol}>
                                <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.7)' }]}>Smart Cash</Text>
                                <Text style={styles.statValue}>$1,240.20</Text>
                                <Text style={styles.statSubText}>+12.4% APR Active</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Quick Action Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitleLabel, { color: theme.textSecondary }]}>Quick Action</Text>
                </View>
                <View style={styles.actionGrid}>
                    <QuickActionButton icon={Plus} label="Add Cash" delay={100} />
                    <QuickActionButton icon={ArrowDownLeft} label="Exchange" delay={200} />
                    <QuickActionButton icon={ArrowUpRight} label="Withdraw" delay={300} />
                    <QuickActionButton icon={Pause} label="Pause AI" delay={400} hasBorder />
                </View>

                {/* Growth Chart Standalone Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitleLabel, { color: theme.textSecondary }]}>Historical Growth</Text>
                </View>
                <Animated.View entering={FadeInDown.delay(450).duration(600)}>
                    <Card style={[styles.chartCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <WealthChart color={theme.primary} />
                    </Card>
                </Animated.View>

                {/* Notification Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitleLabel, { color: theme.textPrimary }]}>Agent Insights</Text>
                    <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>3 new</Text>
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

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const QuickActionButton = ({ icon: Icon, label, delay, hasBorder }: any) => {
    const theme = useAppTheme();
    return (
        <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.actionContainer}>
            <Pressable
                style={[
                    styles.actionBtn,
                    {
                        backgroundColor: theme.surface,
                        borderColor: hasBorder ? theme.primary : 'transparent',
                        borderWidth: 2
                    }
                ]}
            >
                <Icon size={24} color={theme.textPrimary} />
            </Pressable>
            <Text style={[styles.actionBtnLabel, { color: theme.textSecondary }]}>{label}</Text>
        </Animated.View>
    );
};


const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { paddingHorizontal: Spacing.xl },

    topHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 24, paddingHorizontal: 4
    },
    profileCircle: { width: 44, height: 44, borderRadius: 22, padding: 2 },
    calendarIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },

    heroCard: {
        borderRadius: 32, padding: 24, marginBottom: 32,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20 },
            web: { boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }
        })
    },
    heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    heroTextContent: { flex: 1 },
    heroGreeting: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '500', marginBottom: 4 },
    heroTitle: { color: '#FFF', fontSize: 24, fontWeight: '700' },
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: 10, fontWeight: '800' },

    statsGradientCard: {
        borderRadius: 24, padding: 20,
    },
    statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    statCol: { flex: 1 },
    statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600', marginBottom: 4 },
    statValue: { color: '#FFF', fontSize: 22, fontWeight: '800' },
    statSubText: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '500', marginTop: 4 },
    statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 20 },

    chartCard: { padding: 0, borderRadius: 32, borderWidth: 1, overflow: 'hidden', marginBottom: 32 },
    chartContainer: { padding: 20 },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    chartValue: { fontSize: 24, fontWeight: '800' },
    chartLabel: { fontSize: 13, fontWeight: '600', color: '#10B981', marginTop: 2 },
    chartActions: { flexDirection: 'row', gap: 8, backgroundColor: 'rgba(0,0,0,0.03)', padding: 4, borderRadius: 12 },
    timeBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    timeBtnText: { fontSize: 11, fontWeight: '700' },
    gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(0,0,0,0.03)' },

    sectionHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, paddingHorizontal: 4
    },
    sectionTitleLabel: { fontSize: 16, fontWeight: '700' },

    actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
    actionContainer: { alignItems: 'center', gap: 8 },
    actionBtn: {
        width: 68, height: 68, borderRadius: 24,
        alignItems: 'center', justifyContent: 'center',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10 },
            web: { boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }
        })
    },
    actionBtnLabel: { fontSize: 13, fontWeight: '600', marginTop: 4 },

    notificationBadge: {
        backgroundColor: '#DCFCE7', // Light green
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12
    },
    notificationBadgeText: { color: '#166534', fontSize: 12, fontWeight: '700' },

    notifCard: { padding: Spacing.md, borderRadius: 28, borderWidth: 1 },
    notifDivider: { height: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 12 },
    notifItem: { gap: 8 },
    notifHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    notifIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    notifTitle: { fontSize: 13, fontWeight: '700' },
    notifTime: { fontSize: 10, marginTop: 1 },
    notifDesc: { fontSize: 12, lineHeight: 16, paddingLeft: 44 },
});

const Card = ({ children, style }: any) => {
    return (
        <View style={[style, { borderRadius: 24 }]}>
            {children}
        </View>
    );
};
