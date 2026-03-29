import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Modal, TextInput, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { Zap, Shield, TrendingUp, PieChart, ArrowUpRight, ArrowDownLeft, Wallet, HelpCircle, Bell, Sliders, Plus, Pause, Activity, TrendingDown, Globe, Lock } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn, FadeInRight } from 'react-native-reanimated';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { useAccount } from '@reown/appkit-react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { AppHeader } from '@/components/reborn/AppHeader';

// Import local coin assets
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

/**
 * Generates a smooth SVG path from a series of data points.
 */
const getCurvePath = (data: number[], width: number, height: number) => {
    if (!data.length) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((val - min) / range) * height * 0.8 - (height * 0.1),
    }));

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const cp1x = p0.x + (p1.x - p0.x) / 2;
        const cp1y = p0.y;
        const cp2x = p0.x + (p1.x - p0.x) / 2;
        const cp2y = p1.y;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }

    return d;
};

const WealthChart = ({ color, total, change, data, period, onPeriodChange }: {
    color: string,
    total: string,
    change: string,
    data: number[],
    period: string,
    onPeriodChange: (p: string) => void
}) => {
    const theme = useAppTheme();
    const path = React.useMemo(() => getCurvePath(data, 100, 40), [data]);
    const fillPath = React.useMemo(() => `${path} L 100 40 L 0 40 Z`, [path]);

    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <View>
                    <Text style={[styles.chartValue, { color: theme.textPrimary }]}>{total}</Text>
                    <Text style={[styles.chartLabel, { color: theme.positive }]}>{change} ({period})</Text>
                </View>
                <View style={styles.chartActions}>
                    {['1W', '1M', '1Y', 'ALL'].map((p) => (
                        <Pressable
                            key={p}
                            onPress={() => onPeriodChange(p)}
                            style={[styles.timeBtn, period === p && { backgroundColor: theme.primary + '20' }]}
                        >
                            <Text style={[styles.timeBtnText, { color: period === p ? theme.primary : theme.textMuted }]}>{p}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
            <View style={{ height: 160, width: '100%', marginTop: 20 }}>
                <Svg height="100%" width="100%" viewBox="0 0 100 40">
                    <Defs>
                        <SvgGradient id="gradWealth" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={color} stopOpacity="0.2" />
                            <Stop offset="1" stopColor={color} stopOpacity="0" />
                        </SvgGradient>
                    </Defs>
                    {data.length > 0 ? (
                        <>
                            <Path
                                d={fillPath}
                                fill="url(#gradWealth)"
                            />
                            <Path
                                d={path}
                                fill="none"
                                stroke={color}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </>
                    ) : null}
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

const QuickActionButton = ({ icon: Icon, label, delay, hasBorder, onPress }: any) => {
    const theme = useAppTheme();
    return (
        <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.actionContainer}>
            <Pressable
                onPress={onPress}
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
                    <Icon size={24} color={hasBorder ? theme.primary : theme.textPrimary} />
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

const AssetItem = ({ symbol, name, balance, value, change, isLast }: any) => {
    const theme = useAppTheme();
    const isPos = change.startsWith('+');
    return (
        <View style={[styles.assetItem, !isLast && { borderBottomColor: theme.border + '15', borderBottomWidth: 1 }]}>
            <View style={styles.assetIconBox}>
                <Image source={COIN_LOGOS[symbol] || ETH_LOGO} style={styles.assetImage} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.assetName, { color: theme.textPrimary }]}>{name}</Text>
                <Text style={[styles.assetFull, { color: theme.textMuted }]}>{symbol}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.assetVal, { color: theme.textPrimary }]}>{value}</Text>
                <Text style={[styles.assetChange, { color: isPos ? theme.positive : theme.negative }]}>{change}</Text>
            </View>
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
    const isPaused = useAgentStore.use.isPaused();
    const isWorldIDVerified = useAgentStore.use.isWorldIDVerified();
    const togglePause = useAgentStore.use.togglePause();

    const [selectedAction, setSelectedAction] = React.useState<string | null>(null);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [amount, setAmount] = React.useState('');
    const [selectedToken, setSelectedToken] = React.useState('USDC');
    const [selectedPeriod, setSelectedPeriod] = React.useState('1W');

    const chartData = React.useMemo(() => {
        if (!portfolio?.history) return [];
        const history = portfolio.history;
        if (selectedPeriod === '1W') return history.slice(-7).map(h => h.value);
        if (selectedPeriod === '1M') return history.slice(-30).map(h => h.value);
        return history.map(h => h.value);
    }, [portfolio?.history, selectedPeriod]);

    const displayTotal = portfolio ? `$${portfolio.totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '---';
    const displayChange = portfolio ? `${portfolio.change24h >= 0 ? '+' : ''}${portfolio.change24h.toFixed(1)}%` : '--';

    React.useEffect(() => {
        loadMemory();
        if (address) refreshPortfolio(address);
    }, [address]);

    const handleAction = (label: string) => {
        if (label === 'Pause AI' && isPaused) {
            togglePause();
            return;
        }
        setSelectedAction(label);
        setAmount('');
        setModalVisible(true);
    };

    const handleConfirmAction = async () => {
        setIsProcessing(true);
        // Simulate real on-chain/engine delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (selectedAction === 'Pause AI') {
            togglePause();
        } else if (selectedAction === 'Add Cash') {
            console.log('[DASHBOARD] Depositing', amount, selectedToken);
            // In production, trigger Flow Vault deposit here
        }

        setIsProcessing(false);
        setModalVisible(false);
    };

    const renderModalBody = () => {
        const tokens = ['USDC', 'USDT', 'FLOW', 'ETH', 'BTC'];

        if (selectedAction === 'Add Cash' || selectedAction === 'Withdraw') {
            return (
                <View style={styles.modalBodyInner}>
                    <Text style={[styles.inputLabel, { color: theme.textMuted }]}>Enter Amount</Text>
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
                            <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>USD</Text>
                        </View>
                    </View>

                    <Text style={[styles.inputLabel, { color: theme.textMuted, marginTop: 24, fontSize: 10, letterSpacing: 1.5 }]}>DEPOSIT SOURCE</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tokenRow}>
                        {tokens.map(t => (
                            <Pressable
                                key={t}
                                onPress={() => setSelectedToken(t)}
                                style={[
                                    styles.tokenChip,
                                    { borderColor: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
                                    selectedToken === t && { backgroundColor: theme.primary + '15', borderColor: theme.primary }
                                ]}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={COIN_LOGOS[t]} style={{ width: 18, height: 18, marginRight: 8, borderRadius: 9 }} />
                                    <Text style={[styles.tokenChipText, { color: selectedToken === t ? theme.primary : theme.textSecondary }]}>{t}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>

                    {selectedAction === 'Withdraw' && parseFloat(amount) > (portfolio?.totalUSD || 0) && (
                        <Animated.View entering={FadeIn.duration(400)} style={styles.errorContainer}>
                            <Text style={[styles.errorText, { color: theme.negative }]}>Insufficient balance. Limit: {displayTotal}</Text>
                        </Animated.View>
                    )}
                </View>
            );
        }

        if (selectedAction === 'Exchange') {
            return (
                <View style={styles.modalBodyInner}>
                    <View style={styles.swapRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.inputLabel, { color: theme.textMuted }]}>From</Text>
                            <View style={[styles.glassInputSmall, { borderColor: theme.border }]}>
                                <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>USDC</Text>
                            </View>
                        </View>
                        <View style={styles.swapIcon}>
                            <Sliders size={16} color={theme.textMuted} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.inputLabel, { color: theme.textMuted }]}>To</Text>
                            <View style={[styles.glassInputSmall, { backgroundColor: theme.primary + '10', borderColor: theme.primary }]}>
                                <Text style={{ color: theme.primary, fontWeight: '700' }}>FLOW</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.glassInputContainer, { marginTop: 16, borderColor: theme.border }]}>
                        <TextInput
                            style={[styles.glassInput, { color: theme.textPrimary }]}
                            placeholder="0.00"
                            placeholderTextColor={theme.textMuted}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>
                </View>
            );
        }

        if (selectedAction === 'Pause AI') {
            return (
                <View style={styles.modalBodyInner}>
                    <View style={[styles.warningBox, { backgroundColor: theme.negative + '10', borderColor: theme.negative + '30' }]}>
                        <Activity size={32} color={theme.negative} style={{ marginBottom: 12 }} />
                        <Text style={[styles.warningTitle, { color: theme.negative }]}>System Critical Warning</Text>
                        <Text style={[styles.warningDesc, { color: theme.textSecondary }]}>
                            Pausing the KINDRED Wealth Engine will disable active yields, real-time rebalancing, and FHE privacy guardrails.
                            Your projected loss over the next 30 days is <Text style={{ fontWeight: '700', color: theme.negative }}>$1,840.22</Text>.
                        </Text>
                    </View>
                    <Text style={[styles.confirmInstruction, { color: theme.textMuted }]}>
                        All active Smart Contracts will be placed in 'Self-Sovereign' cold state.
                    </Text>
                </View>
            );
        }

        return null;
    };

    return (
        <View style={[styles.root, { backgroundColor: theme.bg }]}>
            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md, paddingBottom: 100 }]}
                showsVerticalScrollIndicator={false}
            >
                <AppHeader />

                {/* Greeting */}
                <View style={{ marginBottom: 32 }}>
                    <Animated.Text entering={FadeInDown.delay(100)} style={[styles.heroGreeting, { color: theme.textSecondary }]}>SYNCED & SECURE</Animated.Text>
                    <Animated.Text entering={FadeInDown.delay(200)} style={[styles.heroTitle, { color: theme.textPrimary }]}>Kindred Alpha</Animated.Text>
                </View>

                {/* greeting content ends here, moving straight to hero card */}

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
                                <View style={styles.heroLabelRow}>
                                    <Text style={[styles.heroLabel, { color: theme.textSecondary, letterSpacing: 2 }]}>TOTAL ASSETS</Text>
                                    <Shield size={10} color={theme.positive} />
                                </View>
                                <Text style={[styles.heroValue, { color: theme.textPrimary }]}>{displayTotal}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: isWorldIDVerified ? theme.positive + '15' : theme.primary + '15' }]}>
                                <View style={[styles.statusDot, { backgroundColor: isWorldIDVerified ? theme.positive : theme.primary }]} />
                                <Text style={[styles.statusText, { color: isWorldIDVerified ? theme.positive : theme.primary }]}>
                                    {isWorldIDVerified ? 'WORLD ID VERIFIED' : 'IDENTITY PENDING'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.heroStats}>
                            <View style={styles.statItem}>
                                <View style={{ width: 22, height: 22, borderRadius: 11, overflow: 'hidden', backgroundColor: '#00EF8B20' }}>
                                    <Image source={FLOW_LOGO} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                </View>
                                <View>
                                    <Text style={[styles.statNum, { color: theme.textPrimary, fontSize: 13 }]}>FLOW</Text>
                                    <Text style={[styles.statDesc, { color: theme.textMuted, fontSize: 10 }]}>Mainnet Ready</Text>
                                </View>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Lock size={14} color={theme.textMuted} />
                                <View>
                                    <Text style={[styles.statNum, { color: theme.textPrimary, fontSize: 13 }]}>FHE</Text>
                                    <Text style={[styles.statDesc, { color: theme.textMuted, fontSize: 10 }]}>Private Alpha</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Quick Action Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Quick Action</Text>
                </View>
                <View style={styles.actionGrid}>
                    <QuickActionButton icon={Plus} label="Add Cash" delay={100} onPress={() => handleAction('Add Cash')} />
                    <QuickActionButton icon={ArrowDownLeft} label="Exchange" delay={200} onPress={() => handleAction('Exchange')} />
                    <QuickActionButton icon={ArrowUpRight} label="Withdraw" delay={300} onPress={() => handleAction('Withdraw')} />
                    <QuickActionButton icon={isPaused ? Activity : Pause} label={isPaused ? "Resume AI" : "Pause AI"} delay={400} onPress={() => handleAction('Pause AI')} hasBorder={isPaused} />
                </View>

                {/* Quick Action Modal */}
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
                        <Animated.View
                            entering={FadeIn.duration(300)}
                            style={[
                                styles.modalContent,
                                {
                                    backgroundColor: theme.isDark ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.85)',
                                    borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                                }
                            ]}
                        >
                            <BlurView intensity={Platform.OS === 'web' ? 40 : 60} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                            <View style={[styles.modalHeader, { borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{selectedAction}</Text>
                                <Pressable onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                                    <Text style={{ color: theme.primary, fontWeight: '700' }}>Done</Text>
                                </Pressable>
                            </View>
                            <View style={styles.modalBody}>
                                {renderModalBody()}

                                <Pressable
                                    onPress={handleConfirmAction}
                                    disabled={isProcessing}
                                    style={[
                                        styles.modalActionBtn,
                                        { backgroundColor: selectedAction === 'Pause AI' ? theme.negative : theme.primary },
                                        isProcessing && { opacity: 0.6 }
                                    ]}
                                >
                                    <Text style={[styles.modalActionBtnText, { color: '#fff' }]}>
                                        {isProcessing ? 'Verifying...' : selectedAction === 'Pause AI' ? 'Confirm System Halt' : `Confirm ${selectedAction}`}
                                    </Text>
                                </Pressable>
                            </View>
                        </Animated.View>
                    </Pressable>
                </Modal>

                {/* Historical Growth */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Historical Growth</Text>
                </View>
                <Animated.View entering={FadeInDown.delay(450).duration(600)}>
                    <Card style={styles.chartCard}>
                        <WealthChart
                            color={theme.primary}
                            total={displayTotal}
                            change={displayChange}
                            data={chartData}
                            period={selectedPeriod}
                            onPeriodChange={setSelectedPeriod}
                        />
                    </Card>
                </Animated.View>

                {/* Assets Section */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Portfolio Breakdown</Text>
                </View>
                <View style={[styles.assetCard, { backgroundColor: theme.surface, borderColor: theme.border, borderRadius: 28, borderWidth: 1, padding: 4 }]}>
                    {portfolio?.tokens && portfolio.tokens.length > 0 ? (
                        portfolio.tokens.map((token, idx) => (
                            <React.Fragment key={token.symbol}>
                                <AssetItem
                                    logo={COIN_LOGOS[token.symbol]}
                                    name={token.symbol}
                                    full={token.name}
                                    amount={token.balance.toFixed(token.symbol === 'FLOW' ? 2 : 4)}
                                    val={`$${token.usdValue.toFixed(2)}`}
                                    change={`${token.change24h >= 0 ? '+' : ''}${token.change24h.toFixed(2)}%`}
                                    isLast={idx === portfolio.tokens.length - 1}
                                />
                                {idx < portfolio.tokens.length - 1 && <View style={styles.assetDivider} />}
                            </React.Fragment>
                        ))
                    ) : (
                        <View style={{ padding: 24, alignItems: 'center' }}>
                            <Text style={{ color: theme.textMuted }}>No assets found in Flow EVM</Text>
                        </View>
                    )}
                </View>

                {/* Agent Insights */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Agent Insights</Text>
                    <Pressable onPress={() => router.push('/history')} style={[styles.badge, { backgroundColor: theme.primary + '15' }]}>
                        <Text style={[styles.badgeText, { color: theme.primary }]}>View History</Text>
                    </Pressable>
                </View>

                <Animated.View entering={FadeInRight.delay(500).duration(600)} style={[styles.notifCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    {useAgentStore.getState().logs.length > 0 ? (
                        useAgentStore.getState().logs.slice(0, 3).map((log, idx) => (
                            <React.Fragment key={idx}>
                                <NotificationItem
                                    icon={log.status === 'Success' ? TrendingUp : Shield}
                                    title={log.action.replace('_', ' ')}
                                    desc={log.message}
                                    time="Just now"
                                />
                                {idx < 2 && idx < useAgentStore.getState().logs.length - 1 && <View style={styles.notifDivider} />}
                            </React.Fragment>
                        ))
                    ) : (
                        <NotificationItem
                            icon={Lock}
                            title="Privacy Encrypted"
                            desc="Zama FHE initialized. Agent monitoring on-chain alpha."
                            time="Ready"
                        />
                    )}
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
    heroLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    heroLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
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
    placeholderBox: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginBottom: 24,
    },
    placeholderText: {
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
        fontWeight: '500',
    },
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

    // Detailed Modal Content Styles
    modalBodyInner: { marginBottom: 32 },
    inputLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    glassInputContainer: {
        flexDirection: 'row', alignItems: 'center',
        height: 64, borderRadius: 20, borderWidth: 1, paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    glassInput: { flex: 1, fontSize: 24, fontWeight: '800' },
    inputCurrency: { paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: 'rgba(0,0,0,0.05)' },
    tokenRow: { marginTop: 12 },
    tokenChip: {
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
        borderWidth: 1, marginRight: 8, height: 44, justifyContent: 'center'
    },
    tokenChipText: { fontSize: 13, fontWeight: '700' },
    errorContainer: { marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,0,0,0.05)' },
    errorText: { fontSize: 13, fontWeight: '600' },
    swapRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
    glassInputSmall: { height: 48, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
    swapIcon: { width: 40, height: 48, alignItems: 'center', justifyContent: 'center' },
    warningBox: { padding: 24, borderRadius: 24, borderWidth: 1, alignItems: 'center' },
    warningTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
    warningDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, fontWeight: '500' },
    confirmInstruction: { fontSize: 12, textAlign: 'center', marginTop: 24, fontWeight: '500' },
    assetCard: { borderRadius: 28, borderWidth: 1, marginBottom: 32, overflow: 'hidden' },
    assetItem: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
    assetIconBox: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.02)' },
    assetImage: { width: '100%', height: '100%', resizeMode: 'contain' },
    assetName: { fontSize: 16, fontWeight: '800' },
    assetFull: { fontSize: 12, fontWeight: '500', marginTop: 2 },
    assetVal: { fontSize: 16, fontWeight: '800' },
    assetChange: { fontSize: 12, fontWeight: '700', marginTop: 2 },
    assetDivider: { height: 1, width: '100%', backgroundColor: 'rgba(0,0,0,0.02)' },
});
