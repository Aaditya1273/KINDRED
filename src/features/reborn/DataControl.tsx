import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Platform, Modal, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { PieChart, TrendingUp, TrendingDown, ShieldAlert, Cpu, ChevronRight, Sliders, Zap } from 'lucide-react-native';
import { AppHeader } from '@/components/reborn/AppHeader';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/ui/card';
import Svg, { Circle } from 'react-native-svg';

const ALLOCATIONS = [
    { label: 'Stable', value: 40, color: '#10B981', desc: 'USDC/USDT Liquidity' },
    { label: 'Yield Vault', value: 30, color: '#FF7B1A', desc: 'Smart Cash Engine' },
    { label: 'Growth/Risky', value: 30, color: '#6366F1', desc: 'Managed Index' }
];

const ASSETS = [
    { symbol: 'USDC', balance: '5,200', pl: '+1.2%', color: '#2775CA' },
    { symbol: 'ETH', balance: '1.24', pl: '-2.4%', color: '#627EEA' },
    { symbol: 'FLOW', balance: '8,400', pl: '+8.5%', color: '#00EF8B' }
];

export default function DataControl() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const [isManual, setIsManual] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [amount, setAmount] = useState('');

    const openAssetModal = (asset: any) => {
        setSelectedAsset(asset);
        setAmount('');
        setModalVisible(true);
    };

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
                    <DonutChart data={ALLOCATIONS} />
                    <View style={styles.legend}>
                        {ALLOCATIONS.map(item => (
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
                            {isManual ? 'Agent PAUSED. You have full control.' : 'Agent ACTIVE. Optimizing autonomously.'}
                        </Text>
                    </View>
                    <Switch
                        value={isManual}
                        onValueChange={setIsManual}
                        trackColor={{ false: '#767577', true: theme.primary }}
                    />
                </View>
            </Animated.View>

            {/* Detailed Asset Performance */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Performance Breakdown</Text>
            </View>
            <View style={styles.assetList}>
                {ASSETS.map((asset, idx) => (
                    <Animated.View key={asset.symbol} entering={FadeInDown.delay(idx * 100).duration(500)} style={[styles.assetCard, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                        <Pressable onPress={() => openAssetModal(asset)} style={{ flex: 1 }}>
                            <BlurView intensity={Platform.OS === 'web' ? 10 : 20} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                            <View style={styles.assetInner}>
                                <View style={[styles.assetIcon, { backgroundColor: asset.color + '15' }]}>
                                    <Text style={[styles.assetIconText, { color: asset.color }]}>{asset.symbol[0]}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.assetSymbol, { color: theme.textPrimary }]}>{asset.symbol}</Text>
                                    <Text style={[styles.assetBal, { color: theme.textSecondary }]}>{asset.balance} units</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.assetPL, { color: asset.pl.startsWith('+') ? theme.positive : theme.negative }]}>
                                        {asset.pl}
                                    </Text>
                                    <View style={styles.verifyRow}>
                                        <Zap size={10} color={theme.textMuted} />
                                        <Text style={styles.verifyText}>Vires Verified</Text>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    </Animated.View>
                ))}
            </View>

            <View style={{ height: 100 }} />

            {/* Asset Management Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    <BlurView intensity={30} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    <Pressable
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: theme.isDark ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.85)',
                                borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                            }
                        ]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <BlurView intensity={Platform.OS === 'web' ? 40 : 60} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                        <View style={[styles.modalHeader, { borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Manage {selectedAsset?.symbol}</Text>
                            <Pressable onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                                <Text style={{ color: theme.primary, fontWeight: '700' }}>Done</Text>
                            </Pressable>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={[styles.inputLabel, { color: theme.textMuted }]}>Custom Rebalance Amount</Text>
                            <View style={[styles.glassInputContainer, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                                <TextInput
                                    style={[styles.glassInput, { color: theme.textPrimary }]}
                                    placeholder="0.00"
                                    placeholderTextColor={theme.textMuted}
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={setAmount}
                                />
                                <View style={styles.inputCurrency}>
                                    <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>{selectedAsset?.symbol}</Text>
                                </View>
                            </View>

                            <Pressable
                                onPress={() => {
                                    alert(`Transaction Sent: Rebalancing ${amount || 0} ${selectedAsset?.symbol}`);
                                    setModalVisible(false);
                                }}
                                style={[styles.modalActionBtn, { backgroundColor: theme.primary, marginTop: 24 }]}
                            >
                                <Text style={[styles.modalActionBtnText, { color: theme.bg }]}>
                                    Force Rebalance
                                </Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
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
    sectionTitle: { fontSize: 18, fontWeight: '800' },

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

    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        width: '85%',
        maxWidth: 400,
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.2, shadowRadius: 40 },
            web: { boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }
        })
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        zIndex: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
    },
    modalCloseBtn: {
        padding: 8,
    },
    modalBody: {
        padding: 24,
        zIndex: 10,
    },
    inputLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    glassInputContainer: {
        flexDirection: 'row', alignItems: 'center',
        height: 64, borderRadius: 20, borderWidth: 1, paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    glassInput: { flex: 1, fontSize: 24, fontWeight: '800' },
    inputCurrency: { paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: 'rgba(0,0,0,0.05)' },
    modalActionBtn: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
            web: { boxShadow: '0 4px 12px rgba(255, 123, 26, 0.3)' }
        })
    },
    modalActionBtnText: {
        fontSize: 16,
        fontWeight: '700',
    },
});
