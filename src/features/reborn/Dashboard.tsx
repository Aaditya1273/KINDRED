import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { Zap, Shield, TrendingUp, PieChart, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn, FadeInRight } from 'react-native-reanimated';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { useAccount } from '@reown/appkit-react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Bell, ChevronRight, UserPlus, Clock, Briefcase, CreditCard } from 'lucide-react-native';


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
            <Pressable
                onPress={() => router.push('/portfolio')}
                style={[styles.profileCircle, { backgroundColor: theme.surface }]}
            >
                {/* Imagine a user avatar here */}
                <View style={{ width: '100%', height: '100%', borderRadius: 20, backgroundColor: theme.primary + '20' }} />
            </Pressable>
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
                    <View style={styles.heroTextContent}>
                        <Text style={styles.heroGreeting}>Good morning KINDRED</Text>
                        <Text style={styles.heroTitle}>Your Portfolio</Text>
                    </View>

                    <LinearGradient
                        colors={[theme.primary, '#FF4D4D']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.statsGradientCard}
                    >
                        <View style={styles.statsRow}>
                            <View style={styles.statCol}>
                                <Text style={styles.statLabel}>Total Assets</Text>
                                <Text style={styles.statValue}>${(balance / 1000).toFixed(0)}K</Text>
                                <Text style={styles.statSubText}>{change >= 0 ? '+' : ''}{change.toFixed(1)}% This week</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statCol}>
                                <Text style={styles.statLabel}>Agent Yield</Text>
                                <Text style={styles.statValue}>94%</Text>
                                <Text style={styles.statSubText}>+ 1.2%</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statCol}>
                                <Text style={styles.statLabel}>Pending</Text>
                                <Text style={styles.statValue}>12</Text>
                                <Text style={styles.statSubText}>3 Urgent</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Quick Action Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitleLabel, { color: theme.textSecondary }]}>Quick Action</Text>
                </View>
                <View style={styles.actionGrid}>
                    <QuickActionButton icon={Zap} label="Swap" delay={100} />
                    <QuickActionButton icon={ArrowDownLeft} label="Deposit" delay={200} />
                    <QuickActionButton icon={ArrowUpRight} label="Withdraw" delay={300} />
                    <QuickActionButton icon={PieChart} label="Stake" delay={400} hasBorder />
                </View>

                {/* Notification Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitleLabel, { color: theme.textSecondary }]}>Notification</Text>
                    <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>3 new</Text>
                    </View>
                </View>

                <Animated.View entering={FadeInRight.delay(500).duration(600)} style={[styles.notifCard, { backgroundColor: theme.surface }]}>
                    <View style={styles.notifHeader}>
                        <View style={styles.notifUser}>
                            <View style={[styles.notifAvatar, { backgroundColor: theme.primary + '15' }]}>
                                <Zap size={20} color={theme.primary} style={{ alignSelf: 'center', marginTop: 10 }} />
                            </View>
                            <View>
                                <Text style={[styles.notifUserName, { color: theme.textPrimary }]}>Agent Insight</Text>
                                <Text style={[styles.notifTime, { color: theme.textMuted }]}>Just now</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={[styles.notifMsg, { color: theme.textSecondary }]}>
                        Kindred has detected a high-yield opportunity in the SOL/USDC pool. Rebalancing initiated.
                    </Text>
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
    heroTextContent: { marginBottom: 24 },
    heroGreeting: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '500', marginBottom: 4 },
    heroTitle: { color: '#FFF', fontSize: 24, fontWeight: '700' },

    statsGradientCard: {
        borderRadius: 24, padding: 20,
    },
    statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    statCol: { flex: 1 },
    statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600', marginBottom: 4 },
    statValue: { color: '#FFF', fontSize: 20, fontWeight: '800', marginBottom: 2 },
    statSubText: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '500' },
    statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 12 },

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

    notifCard: {
        padding: 16, borderRadius: 24,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 15 },
            web: { boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }
        })
    },
    notifHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    notifUser: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    notifAvatar: { width: 40, height: 40, borderRadius: 12 },
    notifUserName: { fontSize: 15, fontWeight: '700' },
    notifTime: { fontSize: 12, fontWeight: '500' },
    notifMsg: { fontSize: 14, lineHeight: 20, fontWeight: '500' }
});
