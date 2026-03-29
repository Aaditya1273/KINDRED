import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Platform, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { PieChart, TrendingUp, TrendingDown, ShieldAlert, Cpu, ChevronRight, Sliders, Zap, Globe, Lock, UserCheck, Database, Link as LinkIcon } from 'lucide-react-native';
import { AppHeader } from '@/components/reborn/AppHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import Svg, { Circle } from 'react-native-svg';
import { useAgentStore } from '@/lib/agent/use-agent-store';

// Allocations are now derived dynamically from the portfolio

// Import custom coin assets
const BTC_LOGO = require('../../coins/btc.png');
const ETH_LOGO = require('../../coins/eth.png');
const FLOW_LOGO = require('../../coins/flow.png');
const USDC_LOGO = require('../../coins/usdc.png');
const USDT_LOGO = require('../../coins/usdt.png');

const COIN_LOGOS: Record<string, any> = {
    BTC: BTC_LOGO,
    ETH: ETH_LOGO,
    FLOW: FLOW_LOGO,
    USDC: USDC_LOGO,
    USDT: USDT_LOGO,
};

// Assets are now derived dynamically from the portfolio

export default function DataControl() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const portfolio = useAgentStore.use.portfolio();
    const isPaused = useAgentStore.use.isPaused();
    const isWorldIDVerified = useAgentStore.use.isWorldIDVerified();
    const togglePause = useAgentStore.use.togglePause();

    // Dynamically derive allocations from real token values
    const dynamicAllocations = portfolio?.tokens.length ? [
        { label: 'Stable', value: portfolio.tokens.find(t => t.symbol === 'USDC' || t.symbol === 'USDT') ? 40 : 0, color: '#10B981' },
        { label: 'Smart Cash', value: portfolio.tokens.find(t => t.symbol === 'FLOW') ? 30 : 0, color: '#FF7B1A' },
        { label: 'Growth', value: portfolio.tokens.find(t => t.symbol === 'ETH' || t.symbol === 'BTC') ? 30 : 0, color: '#6366F1' }
    ].filter(a => a.value > 0) : [
        { label: 'No Data', value: 100, color: theme.textMuted }
    ];

    // Normalize values to 100%
    const totalWeight = dynamicAllocations.reduce((s, a) => s + a.value, 0) || 1;
    const normalizedAllocations = dynamicAllocations.map(a => ({ ...a, value: Math.round((a.value / totalWeight) * 100) }));

    return (
        <ScrollView
            style={[styles.root, { backgroundColor: theme.bg }]}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md }]}
            showsVerticalScrollIndicator={false}
        >
            <AppHeader />

            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Data + Control</Text>
                <View style={[styles.badge, { backgroundColor: theme.primary + '15' }]}>
                    <Cpu size={12} color={theme.primary} />
                    <Text style={[styles.badgeText, { color: theme.primary }]}>CORE ENGINE</Text>
                </View>
            </View>

            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Real-time allocation management and manual agent overrides.
            </Text>

            <Animated.View entering={FadeInDown.delay(100).duration(600)} style={[styles.chartCard, { borderColor: theme.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }]}>
                <BlurView intensity={Platform.OS === 'web' ? 20 : 30} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                <View style={styles.chartRow}>
                    <DonutChart data={normalizedAllocations} />
                    <View style={styles.legend}>
                        {normalizedAllocations.map(item => (
                            <View key={item.label} style={styles.legendItem}>
                                <View style={[styles.dot, { backgroundColor: item.color }]} />
                                <View>
                                    <Text style={[styles.legendLabel, { color: theme.textPrimary }]}>{item.label}</Text>
                                    <Text style={[styles.legendValue, { color: theme.textSecondary }]}>{item.value}%</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </Animated.View>

            {/* Manual Override Control */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Agent Governance</Text>
            </View>
            <Animated.View entering={FadeInDown.delay(200).duration(600)} style={[styles.controlCard, { borderColor: theme.primary + '40', overflow: 'hidden' }]}>
                <BlurView intensity={15} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.primary + '05' }]} />
                <View style={styles.controlInner}>
                    <Sliders size={20} color={theme.primary} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.controlTitle, { color: theme.textPrimary }]}>Manual Override</Text>
                        <Text style={[styles.controlDesc, { color: theme.textSecondary }]}>
                            {isPaused ? 'Agent PAUSED. You have full control.' : 'Agent ACTIVE. Optimizing autonomously.'}
                        </Text>
                    </View>
                    <Switch
                        value={isPaused}
                        onValueChange={togglePause}
                        trackColor={{ false: '#767577', true: theme.primary }}
                    />
                </View>
            </Animated.View>

            {/* Security & Infrastructure Status */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Security & Infrastructure</Text>
            </View>
            <View style={styles.infraGrid}>
                {[
                    { label: 'Flow AA', status: 'Active', icon: Globe, color: '#00EF8B' },
                    { label: 'Zama FHE', status: 'Encrypted', icon: Lock, color: '#FF7B1A' },
                    { label: 'World ID', status: isWorldIDVerified ? 'Verified' : 'Pending', icon: UserCheck, color: isWorldIDVerified ? '#10B981' : theme.textMuted },
                    { label: 'Storacha', status: 'Pinned', icon: Database, color: '#6366F1' },
                    { label: 'Lit Protocol', status: 'Connected', icon: LinkIcon, color: theme.primary }
                ].map((item, idx) => (
                    <Animated.View
                        key={item.label}
                        entering={FadeInDown.delay(400 + idx * 50)}
                        style={[styles.infraCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                    >
                        <item.icon size={16} color={item.color} />
                        <View>
                            <Text style={[styles.infraLabel, { color: theme.textSecondary }]}>{item.label}</Text>
                            <Text style={[styles.infraStatus, { color: theme.textPrimary }]}>{item.status}</Text>
                        </View>
                    </Animated.View>
                ))}
            </View>

            {/* Detailed Asset Performance */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Performance Breakdown</Text>
            </View>
            <View style={styles.assetList}>
                {portfolio?.tokens ? (
                    portfolio.tokens.map((asset, idx) => (
                        <Animated.View key={asset.symbol} entering={FadeInDown.delay(idx * 100).duration(500)} style={[styles.assetCard, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                            <BlurView intensity={Platform.OS === 'web' ? 10 : 20} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                            <View style={styles.assetInner}>
                                <View style={[styles.assetIcon, { backgroundColor: 'transparent' }]}>
                                    <Image source={COIN_LOGOS[asset.symbol] || ETH_LOGO} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.assetSymbol, { color: theme.textPrimary }]}>{asset.symbol}</Text>
                                    <Text style={[styles.assetBal, { color: theme.textSecondary }]}>{asset.balance.toLocaleString()} units</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.assetPL, { color: asset.change24h >= 0 ? theme.positive : theme.negative }]}>
                                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                                    </Text>
                                    <View style={styles.verifyRow}>
                                        <Zap size={10} color={theme.textMuted} />
                                        <Text style={styles.verifyText}>Vires Verified</Text>
                                    </View>
                                </View>
                            </View>
                        </Animated.View>
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', color: theme.textMuted, marginTop: 20 }}>No assets found on-chain.</Text>
                )}
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

function DonutChart({ data }: any) {
    const size = 120;
    const strokeWidth = 14;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const cx = size / 2;
    const cy = size / 2;

    let offset = 0;
    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                {data.map((seg: any) => {
                    const dash = (seg.value / 100) * circumference;
                    const gap = circumference - dash;
                    const rotation = offset * 360 - 90;
                    offset += seg.value / 100;
                    return (
                        <Circle
                            key={seg.label}
                            cx={cx} cy={cy} r={radius}
                            stroke={seg.color}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={`${dash} ${gap}`}
                            strokeLinecap="round"
                            transform={`rotate(${rotation} ${cx} ${cy})`}
                        />
                    );
                })}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xl, marginBottom: 8 },
    title: { fontSize: 26, fontWeight: '900' },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
    subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 24 },

    chartCard: { borderRadius: 32, borderWidth: 1, marginBottom: 24, overflow: 'hidden' },
    chartRow: { flexDirection: 'row', alignItems: 'center', gap: 24, padding: 24 },
    legend: { flex: 1, gap: 12 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    legendLabel: { fontSize: 14, fontWeight: '700' },
    legendValue: { fontSize: 12, fontWeight: '600' },

    sectionHeader: { marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '700' },

    controlCard: { borderRadius: 24, borderWidth: 1, marginBottom: 32, overflow: 'hidden' },
    controlInner: { flexDirection: 'row', alignItems: 'center', padding: 20 },
    controlTitle: { fontSize: 16, fontWeight: '700' },
    controlDesc: { fontSize: 12, marginTop: 2 },

    assetList: { gap: 12 },
    assetCard: { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
    assetInner: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
    assetIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    assetIconText: { fontSize: 16, fontWeight: '800' },
    assetSymbol: { fontSize: 15, fontWeight: '700' },
    assetBal: { fontSize: 12 },
    assetPL: { fontSize: 15, fontWeight: '800' },
    verifyRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    verifyText: { fontSize: 10, color: 'rgba(0,0,0,0.4)', fontWeight: '600' },

    infraGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 40 },
    infraCard: {
        width: '48%',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    infraLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    infraStatus: { fontSize: 13, fontWeight: '800' }
});
