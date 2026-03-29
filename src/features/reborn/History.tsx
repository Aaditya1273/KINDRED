import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { Clock, ArrowDownLeft, ArrowUpRight, Zap, Shield, RefreshCw, ChevronRight, Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const TX_ICONS: any = {
    DEPOSIT: ArrowDownLeft,
    WITHDRAW: ArrowUpRight,
    SWAP: RefreshCw,
    YIELD: Zap,
    AGENT: Shield,
};

const TransactionItem = ({ tx, isLast }: { tx: any, isLast: boolean }) => {
    const theme = useAppTheme();
    const Icon = TX_ICONS[tx.type] || Clock;
    const color = tx.type === 'WITHDRAW' ? theme.negative : theme.positive;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.txItem,
                {
                    backgroundColor: pressed ? (theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)') : 'transparent',
                    borderBottomColor: isLast ? 'transparent' : theme.border
                }
            ]}
        >
            <View style={[styles.txIconBox, { backgroundColor: color + '15' }]}>
                <Icon size={18} color={color} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.txType, { color: theme.textPrimary }]}>{tx.type.replace('_', ' ')}</Text>
                <Text style={[styles.txTime, { color: theme.textMuted }]}>
                    {new Date(tx.timestamp).toLocaleDateString()} • {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.txAmount, { color: theme.textPrimary }]}>
                    {tx.type === 'WITHDRAW' ? '-' : '+'}{tx.amount} {tx.asset}
                </Text>
                <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: tx.status === 'confirmed' ? theme.positive : theme.primary }]} />
                    <Text style={[styles.txStatus, { color: theme.textMuted }]}>{tx.status}</Text>
                </View>
            </View>
        </Pressable>
    );
};

export default function RebornHistory() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const transactions = useAgentStore.use.transactions();

    return (
        <View style={[styles.root, { backgroundColor: theme.bg }]}>
            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md, paddingBottom: 100 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.textPrimary }]}>History</Text>
                    <Pressable style={[styles.searchBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Search size={18} color={theme.textMuted} />
                    </Pressable>
                </View>

                {/* Filter Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ gap: 10 }}>
                    {['All', 'Deposits', 'Withdrawals', 'Agent Logs', 'Yield'].map((filter, i) => (
                        <Pressable
                            key={filter}
                            style={[styles.filterChip, i === 0 && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                        >
                            <Text style={[styles.filterText, { color: i === 0 ? '#fff' : theme.textSecondary }]}>{filter}</Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Transactions Card */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                    <View style={[styles.historyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        {transactions.length > 0 ? (
                            transactions.map((tx, idx) => (
                                <TransactionItem
                                    key={tx.hash || idx}
                                    tx={tx}
                                    isLast={idx === transactions.length - 1}
                                />
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Clock size={48} color={theme.textMuted} strokeWidth={1} />
                                <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No transactions yet</Text>
                                <Text style={[styles.emptyDesc, { color: theme.textMuted }]}>
                                    Your autonomous on-chain activity will appear here.
                                </Text>
                            </View>
                        )}
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    searchBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },

    filterScroll: { marginBottom: 24 },
    filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    filterText: { fontSize: 13, fontWeight: '700' },

    historyCard: { borderRadius: 32, borderWidth: 1, overflow: 'hidden', padding: 4 },
    txItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14, borderBottomWidth: 1 },
    txIconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    txType: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
    txTime: { fontSize: 11, fontWeight: '500' },
    txAmount: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    txStatus: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },

    emptyState: { padding: 48, alignItems: 'center' },
    emptyTitle: { fontSize: 18, fontWeight: '800', marginTop: 16, marginBottom: 8 },
    emptyDesc: { fontSize: 14, fontWeight: '500', textAlign: 'center', lineHeight: 20 }
});
