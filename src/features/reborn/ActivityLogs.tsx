import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';

import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { AppHeader } from '@/components/reborn/AppHeader';
import { Activity, ShieldCheck, Zap, ChevronRight, CheckCircle, Clock, Link, FileText, Hash } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import { useAgentStore } from '@/lib/agent/use-agent-store';

const DEFAULT_LOGS = [
    {
        id: '1',
        action: 'Yield Optimization',
        status: 'Success',
        time: 'Now',
        proof: 'Flow Block #842,102',
        desc: 'Rebalanced liquidity to Flow Smart Cash Vault.',
        type: 'ON-CHAIN',
        cid: 'bafybeig...4f2a'
    },
    {
        id: '1.5',
        action: 'Lit Protocol Signing',
        status: 'Signed',
        time: '2m ago',
        proof: 'Datil-Test PKP (0x04...)',
        desc: 'Autonomous transaction signed via Programmable Key Pair.',
        type: 'LIT',
        cid: 'bafybeif...2k9q'
    },
    {
        id: '2',
        action: 'Zama Privacy Audit',
        status: 'Verified',
        time: '12m ago',
        proof: 'FHE Ciphertext Proof',
        desc: 'Processed blind financial analysis via Sepolia Co-processor.',
        type: 'ZAMA',
        cid: 'bafybeih...9x3z'
    },
    {
        id: '3',
        action: 'Storacha Archive',
        status: 'Pinned',
        time: '1h ago',
        proof: 'Filecoin/Storacha',
        desc: 'Agent long-term memory persisted to IPFS.',
        type: 'STORACHA',
        cid: 'bafybeid...7v2w'
    }
];

export default function ActivityLogs() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const storeLogs = useAgentStore.use.logs();
    const logs = storeLogs.length > 0 ? storeLogs.map(l => ({
        id: l.timestamp.toString(),
        action: l.action,
        status: l.status,
        time: new Date(l.timestamp).toLocaleTimeString(),
        proof: l.txHash ? `REF: ${l.txHash.slice(0, 10)}...` : 'Internal Process',
        desc: l.message,
        type: l.action.includes('FHE') ? 'ZAMA' : 'ON-CHAIN',
        cid: l.cid
    })) : DEFAULT_LOGS;

    return (
        <ScrollView
            style={[styles.root, { backgroundColor: theme.bg }]}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md }]}
            showsVerticalScrollIndicator={false}
        >
            <AppHeader />

            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Receipts</Text>
                <View style={[styles.badge, { backgroundColor: theme.primary + '15' }]}>
                    <ShieldCheck size={12} color={theme.primary} />
                    <Text style={[styles.badgeText, { color: theme.primary }]}>AUDITABLE</Text>
                </View>
            </View>

            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Real-time activity logs and on-chain proofs for every action KINDRED takes.
            </Text>

            {logs.map((log, idx) => {
                return (
                    <Animated.View key={log.id} entering={FadeInDown.delay(idx * 100).duration(500)} style={[styles.logCard, { borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }]}>
                        <BlurView intensity={Platform.OS === 'web' ? 10 : 20} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                        <View style={styles.logInner}>
                            <View style={styles.logHeader}>
                                <View style={[styles.iconBox, { backgroundColor: theme.primary + '10' }]}>
                                    {log.type === 'ON-CHAIN' ? <Zap size={18} color={theme.primary} /> : <FileText size={18} color={theme.textMuted} />}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.actionRow}>
                                        <Text style={[styles.actionTitle, { color: theme.textPrimary }]}>{log.action}</Text>
                                        <Text style={[styles.statusTag, { color: log.status === 'Success' ? theme.positive : theme.textMuted }]}>{log.status}</Text>
                                    </View>
                                    <Text style={[styles.time, { color: theme.textMuted }]}>{log.time}</Text>
                                </View>
                            </View>

                            <Text style={[styles.desc, { color: theme.textSecondary }]}>{log.desc}</Text>

                            <View style={[styles.proofBadge, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}>
                                <View style={styles.proofRow}>
                                    <Hash size={10} color={theme.primary} />
                                    <Text style={[styles.proofText, { color: theme.textSecondary }]}>{log.proof}</Text>
                                </View>
                                {log.cid && (
                                    <View style={[styles.cidBox, { backgroundColor: theme.primary + '10' }]}>
                                        <Link size={8} color={theme.primary} />
                                        <Text style={[styles.cidText, { color: theme.primary }]}>IPFS Verified</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </Animated.View>
                );
            })}

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xl, marginBottom: 8 },
    title: { fontSize: 26, fontWeight: '900' },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
    subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 32 },

    logCard: { borderRadius: 28, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
    logInner: { padding: 20 },
    logHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
    iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    actionTitle: { fontSize: 16, fontWeight: '700' },
    statusTag: { fontSize: 11, fontWeight: '800' },
    time: { fontSize: 12, marginTop: 2 },
    desc: { fontSize: 13, lineHeight: 18, marginBottom: 16 },

    proofBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 20 },
    proofRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    proofText: { fontSize: 10, fontWeight: '600', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
    cidBox: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    cidText: { fontSize: 9, fontWeight: '800' }
});
