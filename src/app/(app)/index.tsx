/**
 * KINDRED Home Screen
 * Priority: Net Worth → AI Activity → Quick Actions
 * Max 3 sections, thumb-friendly, calm + alive
 */
import React, { useEffect, useRef } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    RefreshControl,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    FadeIn,
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSpring,
    Easing,
} from 'react-native-reanimated';
import { Text } from '@/components/ui';
import { Card, PressableCard } from '@/components/ui/card';
import { AppKitButton, useAccount } from '@reown/appkit-react-native';
import { TrendingUp, TrendingDown, Zap, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react-native';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { Colors, Spacing, Radius, Motion } from '@/theme/tokens';
import * as Haptics from 'expo-haptics';

// Pulsing dot — shows agent is alive
function LiveDot() {
    const opacity = useSharedValue(1);
    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
            -1, true
        );
    }, []);
    const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
    return (
        <Animated.View style={[styles.liveDot, style]} />
    );
}

// Single AI activity row
function ActivityRow({ title, detail, color }: { title: string; detail: string; color: string }) {
    return (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.activityRow}>
            <View style={[styles.activityDot, { backgroundColor: color }]} />
            <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>{title}</Text>
                <Text style={styles.activityDetail}>{detail}</Text>
            </View>
        </Animated.View>
    );
}

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { isConnected, address } = useAccount();
    const portfolio = useAgentStore.use.portfolio();
    const logs = useAgentStore.use.logs();
    const agentStatus = useAgentStore.use.status();
    const refreshPortfolio = useAgentStore.use.refreshPortfolio();
    const runCycle = useAgentStore.use.runCycle();
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        if (isConnected && address) refreshPortfolio(address);
    }, [isConnected, address]);

    const onRefresh = async () => {
        if (!address) return;
        setRefreshing(true);
        await refreshPortfolio(address);
        setRefreshing(false);
    };

    const totalUSD = portfolio?.totalUSD ?? 0;
    const change24h = portfolio?.change24h ?? 0;
    const isPositive = change24h >= 0;

    // Show last 3 agent logs as live activity
    const recentActivity = logs.slice(0, 3);

    return (
        <View style={[styles.root, { paddingTop: insets.top }]}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.cyan}
                    />
                }
            >
                {/* ── SECTION 1: Net Worth ── */}
                <Animated.View entering={FadeIn.duration(400)} style={styles.section}>
                    <View style={styles.netWorthHeader}>
                        <Text style={styles.label}>Net Worth</Text>
                        <View style={styles.liveRow}>
                            <LiveDot />
                            <Text style={styles.liveText}>
                                {agentStatus === 'running' ? 'Executing' : 'Live'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.netWorthValue}>
                        ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>

                    <View style={styles.changeRow}>
                        {isPositive
                            ? <TrendingUp size={14} color={Colors.positive} />
                            : <TrendingDown size={14} color={Colors.negative} />
                        }
                        <Text style={[styles.changeText, { color: isPositive ? Colors.positive : Colors.negative }]}>
                            {isPositive ? '+' : ''}{change24h.toFixed(2)}% today
                        </Text>
                    </View>

                    {!isConnected && (
                        <View style={styles.connectRow}>
                            <AppKitButton />
                        </View>
                    )}
                </Animated.View>

                {/* ── SECTION 2: AI Activity ── */}
                <Animated.View entering={FadeInDown.delay(100).duration(350)} style={styles.section}>
                    <Card style={styles.activityCard}>
                        <View style={styles.activityHeader}>
                            <Text style={styles.sectionLabel}>Agent Activity</Text>
                            {agentStatus === 'running' && (
                                <View style={styles.runningBadge}>
                                    <RefreshCw size={10} color={Colors.cyan} />
                                    <Text style={styles.runningText}>Running</Text>
                                </View>
                            )}
                        </View>

                        {recentActivity.length === 0 ? (
                            <View style={styles.emptyActivity}>
                                <Text style={styles.emptyText}>
                                    {isConnected ? 'Run a cycle to see agent activity.' : 'Connect wallet to activate agent.'}
                                </Text>
                            </View>
                        ) : (
                            recentActivity.map((log) => (
                                <ActivityRow
                                    key={log.id}
                                    title={log.title}
                                    detail={log.detail}
                                    color={log.color}
                                />
                            ))
                        )}
                    </Card>
                </Animated.View>

                {/* ── SECTION 3: Quick Actions ── */}
                <Animated.View entering={FadeInDown.delay(200).duration(350)} style={styles.section}>
                    <View style={styles.actionsRow}>
                        <PressableCard
                            style={styles.actionCard}
                            radius={Radius.lg}
                            onPress={async () => {
                                if (!address) return;
                                if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                await runCycle(address);
                            }}
                            disabled={agentStatus === 'running' || !isConnected}
                        >
                            <Zap size={20} color={Colors.emerald} />
                            <Text style={[styles.actionLabel, { color: Colors.emerald }]}>
                                {agentStatus === 'running' ? 'Running...' : 'Run Agent'}
                            </Text>
                        </PressableCard>

                        <PressableCard style={styles.actionCard} radius={Radius.lg}>
                            <ArrowDownLeft size={20} color={Colors.cyan} />
                            <Text style={[styles.actionLabel, { color: Colors.cyan }]}>Deposit</Text>
                        </PressableCard>

                        <PressableCard style={styles.actionCard} radius={Radius.lg}>
                            <ArrowUpRight size={20} color={Colors.textSecondary} />
                            <Text style={[styles.actionLabel, { color: Colors.textSecondary }]}>Withdraw</Text>
                        </PressableCard>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.bg },
    scroll: { flex: 1 },
    content: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },

    // Section 1 — Net Worth
    section: { marginTop: Spacing.xl },
    netWorthHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs },
    label: { fontSize: 13, color: Colors.textSecondary, letterSpacing: 0.5 },
    liveRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.emerald },
    liveText: { fontSize: 11, color: Colors.emerald, fontWeight: '600' },
    netWorthValue: { fontSize: 44, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -1, marginBottom: Spacing.xs },
    changeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    changeText: { fontSize: 13, fontWeight: '600' },
    connectRow: { marginTop: Spacing.md },

    // Section 2 — AI Activity
    activityCard: { padding: Spacing.md },
    activityHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
    sectionLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
    runningBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.cyan + '18', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
    runningText: { fontSize: 10, color: Colors.cyan, fontWeight: '700' },
    activityRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
    activityDot: { width: 6, height: 6, borderRadius: 3, marginTop: 5 },
    activityTitle: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600', marginBottom: 2 },
    activityDetail: { fontSize: 11, color: Colors.textSecondary, lineHeight: 16 },
    emptyActivity: { paddingVertical: Spacing.md },
    emptyText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },

    // Section 3 — Quick Actions
    actionsRow: { flexDirection: 'row', gap: Spacing.sm },
    actionCard: { flex: 1, padding: Spacing.md, alignItems: 'center', gap: Spacing.sm },
    actionLabel: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
});
