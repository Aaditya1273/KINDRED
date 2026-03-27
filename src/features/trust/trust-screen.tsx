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
import { Shield, Lock, Eye, EyeOff, ChevronRight, CheckCircle, Database, Fingerprint, Settings, Zap, History } from 'lucide-react-native';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { router } from 'expo-router';

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
    const latestCID = useAgentStore.use.latestCID();

    return (
        <ScrollView
            style={[styles.root, { paddingTop: insets.top, backgroundColor: theme.bg }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>The Blind Wealth Manager</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Automated financial growth with absolute data sovereignty.
                </Text>
            </View>

            {/* Zama FHE / Blind Data */}
            <Animated.View entering={FadeInDown.duration(400)}>
                <Card style={[styles.mainCard, { backgroundColor: theme.isDark ? '#111' : '#F9F9F9' }]}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBox, { backgroundColor: theme.primary + '15' }]}>
                            <Lock size={20} color={theme.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Confidential Finance</Text>
                            <Text style={[styles.cardTag, { color: theme.primary }]}>ZAMA FHE ACTIVE</Text>
                        </View>
                    </View>
                    <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>
                        KINDRED analyzes your spending while encrypted. I optimize your wealth without ever seeing your raw data.
                    </Text>
                    <View style={styles.fheStatusRow}>
                        <CheckCircle size={14} color={theme.positive} />
                        <Text style={[styles.fheStatusText, { color: theme.textPrimary }]}>Private history uploaded</Text>
                    </View>
                    <Pressable style={[styles.actionBtn, { borderColor: theme.border }]}>
                        <Text style={[styles.actionBtnText, { color: theme.textPrimary }]}>Upload Data for Audit</Text>
                        <ChevronRight size={16} color={theme.textMuted} />
                    </Pressable>
                </Card>
            </Animated.View>

            {/* Consumer DeFi Features */}
            <View style={styles.grid}>
                <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.gridHalf}>
                    <Card style={styles.smallCard}>
                        <Zap size={20} color={theme.primary} />
                        <Text style={[styles.smallTitle, { color: theme.textPrimary }]}>Smart Cash</Text>
                        <Text style={[styles.smallDesc, { color: theme.textSecondary }]}>Automated yield loops on Flow.</Text>
                    </Card>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.gridHalf}>
                    <Card style={styles.smallCard}>
                        <History size={20} color={theme.positive} />
                        <Text style={[styles.smallTitle, { color: theme.textPrimary }]}>Scheduled</Text>
                        <Text style={[styles.smallDesc, { color: theme.textSecondary }]}>Systematic savings executed weekly.</Text>
                    </Card>
                </Animated.View>
            </View>

            {/* Identity & Sovereignty */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Security Protocols</Text>
                <View style={[styles.protoList, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <ProtoItem
                        icon={Fingerprint}
                        label="World ID"
                        status="Orb Verified"
                        desc="One human, one elite financial agent."
                    />
                    <ProtoItem
                        icon={Shield}
                        label="Lit Protocol"
                        status="Active"
                        desc="Programmable signing via PKP."
                    />
                    <ProtoItem
                        icon={Database}
                        label="Storacha"
                        status="Immutable"
                        desc="Long-term memory stored on Filecoin."
                        isLast
                    />
                </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.footer}>
                <Pressable onPress={() => router.push('/faq')} style={styles.auditLink}>
                    <Text style={[styles.auditLinkText, { color: theme.textMuted }]}>View Verification Logs in FAQ</Text>
                    <ChevronRight size={14} color={theme.textMuted} />
                </Pressable>
            </Animated.View>

            <View style={{ height: Spacing.xxl }} />
        </ScrollView>
    );
}

const ProtoItem = ({ icon: Icon, label, status, desc, isLast }: any) => {
    const theme = useAppTheme();
    return (
        <View style={[styles.protoItem, { borderBottomColor: isLast ? 'transparent' : theme.border }]}>
            <View style={styles.protoHeader}>
                <Icon size={18} color={theme.primary} />
                <Text style={[styles.protoLabel, { color: theme.textPrimary }]}>{label}</Text>
                <View style={[styles.protoBadge, { backgroundColor: theme.positive + '15' }]}>
                    <Text style={[styles.protoBadgeText, { color: theme.positive }]}>{status}</Text>
                </View>
            </View>
            <Text style={[styles.protoDesc, { color: theme.textSecondary }]}>{desc}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },
    header: { marginTop: Spacing.xl, marginBottom: Spacing.lg },
    title: { fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
    subtitle: { fontSize: 16, fontWeight: '500', marginTop: 4, lineHeight: 22 },

    mainCard: { padding: Spacing.lg, borderRadius: 28, borderWidth: 1, marginBottom: Spacing.md },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    cardTitle: { fontSize: 18, fontWeight: '800' },
    cardTag: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    cardDesc: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
    fheStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    fheStatusText: { fontSize: 13, fontWeight: '600' },
    actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 16, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.02)' },
    actionBtnText: { fontSize: 14, fontWeight: '700' },

    grid: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
    gridHalf: { flex: 1 },
    smallCard: { padding: Spacing.md, borderRadius: 24, gap: 8 },
    smallTitle: { fontSize: 15, fontWeight: '700' },
    smallDesc: { fontSize: 12, lineHeight: 16 },

    sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
    protoList: { borderRadius: 28, borderWidth: 1, overflow: 'hidden' },
    protoItem: { padding: 20, borderBottomWidth: 1 },
    protoHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
    protoLabel: { fontSize: 15, fontWeight: '700', flex: 1 },
    protoBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
    protoBadgeText: { fontSize: 10, fontWeight: '800' },
    protoDesc: { fontSize: 13, lineHeight: 18, paddingLeft: 28 },

    footer: { marginTop: Spacing.xl, alignItems: 'center' },
    auditLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    auditLinkText: { fontSize: 13, fontWeight: '600' }
});
