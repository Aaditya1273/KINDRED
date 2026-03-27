/**
 * KINDRED Trust / Security Screen
 * Shows AI reasoning, FHE status, identity verification
 * "Hold to reveal" interactions, expandable logs
 */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Text } from '@/components/ui';
import { Card, PressableCard } from '@/components/ui/card';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { Shield, Lock, Eye, EyeOff, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react-native';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';

function HoldToReveal({ label, value }: { label: string; value: string }) {
    const [revealed, setRevealed] = useState(false);
    const theme = useAppTheme();
    return (
        <Pressable
            onLongPress={() => setRevealed(true)}
            onPressOut={() => setRevealed(false)}
            style={[styles.holdRow, { borderTopColor: theme.border }]}
        >
            <View style={{ flex: 1 }}>
                <Text style={[styles.holdLabel, { color: theme.textMuted }]}>{label}</Text>
                <Text style={[styles.holdValue, { color: theme.textPrimary }]} numberOfLines={1}>
                    {revealed ? value : '••••••••••••••••'}
                </Text>
            </View>
            {revealed ? <Eye size={16} color={theme.primary} /> : <EyeOff size={16} color={theme.textMuted} />}
        </Pressable>
    );
}

function ReasoningRow({ action, reason, expanded, onToggle }: {
    action: string; reason: string; expanded: boolean; onToggle: () => void;
}) {
    const theme = useAppTheme();
    return (
        <Pressable onPress={onToggle} style={[styles.reasonRow, { borderTopColor: theme.border }]}>
            <View style={styles.reasonHeader}>
                <CheckCircle size={14} color={theme.positive} />
                <Text style={[styles.reasonAction, { color: theme.textPrimary }]}>{action}</Text>
                {expanded ? <ChevronUp size={14} color={theme.textMuted} /> : <ChevronDown size={14} color={theme.textMuted} />}
            </View>
            {expanded && (
                <Animated.View entering={FadeInDown.duration(200)} style={styles.reasonDetail}>
                    <Text style={[styles.reasonText, { color: theme.textSecondary }]}>{reason}</Text>
                </Animated.View>
            )}
        </Pressable>
    );
}

const REASONING = [
    { action: 'Delta-Neutral Rebalance', reason: 'USDC/FLOW LP ratio drifted 3.2% from target. Rebalanced to maintain delta-neutral position and protect against directional risk.' },
    { action: 'Yield Deposit Skipped', reason: 'APR was 7.1% — below the 8% threshold. Rescheduled check for 2 hours. Slippage was also elevated at 0.8%.' },
    { action: 'Scheduled Savings Executed', reason: 'Weekly auto-deposit of $200 USDC into Flow vault. Signed via Lit Protocol PKP. Tx confirmed on Flow EVM block 18,042,110.' },
];

export function TrustScreen() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const logs = useAgentStore.use.logs();
    const latestCID = useAgentStore.use.latestCID();
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    return (
        <ScrollView
            style={[styles.root, { paddingTop: insets.top, backgroundColor: theme.bg }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <Text style={[styles.title, { color: theme.textPrimary }]}>Trust & Security</Text>

            {/* FHE Status */}
            <Animated.View entering={FadeInDown.duration(300)}>
                <Card style={styles.fheCard}>
                    <View style={styles.fheHeader}>
                        <Lock size={18} color={theme.primary} />
                        <Text style={[styles.fheTitle, { color: theme.textPrimary }]}>Zama FHE Active</Text>
                        <View style={[styles.activeBadge, { backgroundColor: theme.primary + '22' }]}>
                            <Text style={[styles.activeBadgeText, { color: theme.primary }]}>ON</Text>
                        </View>
                    </View>
                    <Text style={[styles.fheDesc, { color: theme.textSecondary }]}>
                        Your financial data is processed while encrypted. The agent never sees your raw balances or spending history.
                    </Text>
                    <HoldToReveal label="Encrypted spending goal" value="$4,200 / month" />
                    <HoldToReveal label="FHE computation result" value="Yield opportunity: +24.1% APY detected" />
                </Card>
            </Animated.View>

            {/* Identity */}
            <Animated.View entering={FadeInDown.delay(80).duration(300)}>
                <Card style={styles.section}>
                    <View style={styles.identityRow}>
                        <Shield size={18} color={theme.positive} />
                        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Identity Verified</Text>
                    </View>
                    <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
                        Your KINDRED agent is tethered to a World ID proof. One human, one agent. No bot farming.
                    </Text>
                    <View style={styles.verifiedRow}>
                        <CheckCircle size={14} color={theme.positive} />
                        <Text style={[styles.verifiedText, { color: theme.textSecondary }]}>World ID — Orb verified</Text>
                    </View>
                    <View style={styles.verifiedRow}>
                        <CheckCircle size={14} color={theme.positive} />
                        <Text style={[styles.verifiedText, { color: theme.textSecondary }]}>Lit Protocol PKP — Agent wallet bound</Text>
                    </View>
                    <View style={styles.verifiedRow}>
                        <CheckCircle size={14} color={theme.positive} />
                        <Text style={[styles.verifiedText, { color: theme.textSecondary }]}>Storacha CID — Memory immutable</Text>
                    </View>
                    {latestCID !== '' && (
                        <Text style={[styles.cidText, { color: theme.textMuted }]} numberOfLines={1}>Memory: {latestCID}</Text>
                    )}
                </Card>
            </Animated.View>

            {/* AI Reasoning */}
            <Animated.View entering={FadeInDown.delay(160).duration(300)}>
                <Card style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Why the agent acted</Text>
                    <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>Tap any action to see the reasoning.</Text>
                    {REASONING.map((r, i) => (
                        <ReasoningRow
                            key={r.action}
                            action={r.action}
                            reason={r.reason}
                            expanded={expandedIdx === i}
                            onToggle={() => setExpandedIdx(expandedIdx === i ? null : i)}
                        />
                    ))}
                </Card>
            </Animated.View>

            <View style={{ height: Spacing.xxl }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },
    title: { fontSize: 28, fontWeight: '800', marginTop: Spacing.xl, marginBottom: Spacing.lg },

    fheCard: { padding: Spacing.md, marginBottom: Spacing.md },
    fheHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.sm },
    fheTitle: { fontSize: 15, fontWeight: '700', flex: 1 },
    activeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
    activeBadgeText: { fontSize: 10, fontWeight: '800' },
    fheDesc: { fontSize: 13, lineHeight: 18, marginBottom: Spacing.md },

    holdRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1 },
    holdLabel: { fontSize: 11, marginBottom: 2 },
    holdValue: { fontSize: 13, fontWeight: '600' },

    section: { padding: Spacing.md, marginBottom: Spacing.md },
    identityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.sm },
    sectionTitle: { fontSize: 15, fontWeight: '700' },
    sectionDesc: { fontSize: 13, lineHeight: 18, marginBottom: Spacing.md },
    verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
    verifiedText: { fontSize: 13 },
    cidText: { fontSize: 10, marginTop: Spacing.sm },

    reasonRow: { borderTopWidth: 1, paddingVertical: Spacing.sm },
    reasonHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    reasonAction: { flex: 1, fontSize: 13, fontWeight: '600' },
    reasonDetail: { marginTop: Spacing.sm, paddingLeft: 22 },
    reasonText: { fontSize: 12, lineHeight: 18 },
});
