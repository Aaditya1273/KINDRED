/**
 * KINDRED Portfolio Screen
 * Simple allocation view + clean asset list with roles
 * No trading complexity — calm + clear
 */
import React, { useEffect } from 'react';
import {
    RefreshControl,
    StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Text, View, ScrollView } from '@/components/ui';
import { Card, PressableCard } from '@/components/ui/card';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { useAccount } from '@reown/appkit-react-native';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store';
import { useSelectedTheme } from '@/lib/hooks/use-selected-theme';
import { Shield, Moon, Sun, Globe, Heart, LogOut, ChevronRight } from 'lucide-react-native';
import type { TokenBalance } from '@/lib/agent/portfolio';

const ASSET_ROLES: Record<string, string> = {
    ETH: 'Growth',
    BTC: 'Store of Value',
    USDC: 'Stability',
    FLOW: 'Yield Engine',
};

// Minimal donut chart using SVG
function DonutChart({ tokens, total }: { tokens: TokenBalance[]; total: number }) {
    const theme = useAppTheme();
    const size = 160;
    const strokeWidth = 18;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const cx = size / 2;
    const cy = size / 2;

    let offset = 0;
    const segments = tokens.map(token => {
        const pct = total > 0 ? token.usdValue / total : 0;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const rotation = offset * 360 - 90;
        offset += pct;
        return { ...token, dash, gap, rotation };
    });

    return (
        <View style={styles.donutContainer}>
            <Svg width={size} height={size}>
                {/* Background ring */}
                <Circle
                    cx={cx} cy={cy} r={radius}
                    stroke={theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {segments.map((seg, i) => (
                    <Circle
                        key={seg.symbol}
                        cx={cx} cy={cy} r={radius}
                        stroke={seg.color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={`${seg.dash} ${seg.gap}`}
                        strokeLinecap="round"
                        transform={`rotate(${seg.rotation} ${cx} ${cy})`}
                        opacity={0.85}
                    />
                ))}
            </Svg>
            <View style={styles.donutCenter}>
                <Text style={[styles.donutLabel, { color: theme.textMuted }]}>Allocated</Text>
                <Text style={[styles.donutValue, { color: theme.textPrimary }]}>{tokens.length}</Text>
                <Text style={[styles.donutSub, { color: theme.textSecondary }]}>assets</Text>
            </View>
        </View>
    );
}

function AssetRow({ token }: { token: TokenBalance }) {
    const theme = useAppTheme();
    const role = ASSET_ROLES[token.symbol] ?? 'Asset';
    const isPositive = token.change24h >= 0;

    return (
        <Animated.View entering={FadeInDown.duration(300)}>
            <PressableCard style={styles.assetRow} radius={Radius.md}>
                <View style={[styles.assetIcon, { backgroundColor: token.color + '18' }]}>
                    <Text style={[styles.assetIconText, { color: token.color }]}>
                        {token.symbol.slice(0, 2)}
                    </Text>
                </View>
                <View style={styles.assetInfo}>
                    <Text style={[styles.assetName, { color: theme.textPrimary }]}>{token.name}</Text>
                    <Text style={[styles.assetRole, { color: theme.textSecondary }]}>{role}</Text>
                </View>
                <View style={styles.assetValues}>
                    <Text style={[styles.assetUSD, { color: theme.textPrimary }]}>${token.usdValue.toFixed(2)}</Text>
                    <Text style={[styles.assetChange, { color: isPositive ? theme.positive : theme.negative }]}>
                        {isPositive ? '+' : ''}{token.change24h.toFixed(2)}%
                    </Text>
                </View>
            </PressableCard>
        </Animated.View>
    );
}

export function PortfolioScreen() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const { address } = useAccount();
    const portfolio = useAgentStore.use.portfolio();
    const refreshPortfolio = useAgentStore.use.refreshPortfolio();
    const signOut = useAuth.use.signOut();
    const { selectedTheme, setSelectedTheme } = useSelectedTheme();
    const [refreshing, setRefreshing] = React.useState(false);

    const toggleTheme = () => {
        const next: any = selectedTheme === 'dark' ? 'light' : 'dark';
        setSelectedTheme(next);
    };

    useEffect(() => {
        if (address) refreshPortfolio(address);
    }, [address]);

    const onRefresh = async () => {
        if (!address) return;
        setRefreshing(true);
        await refreshPortfolio(address);
        setRefreshing(false);
    };

    const tokens = portfolio?.tokens ?? [];
    const total = portfolio?.totalUSD ?? 0;

    return (
        <ScrollView
            style={[styles.root, { paddingTop: insets.top, backgroundColor: theme.bg }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
        >
            <Text style={[styles.title, { color: theme.textPrimary }]}>Portfolio</Text>

            {/* Allocation Chart */}
            {tokens.length > 0 && (
                <Card style={styles.chartCard}>
                    <DonutChart tokens={tokens} total={total} />
                    {/* Legend */}
                    <View style={styles.legend}>
                        {tokens.map(t => (
                            <View key={t.symbol} style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: t.color }]} />
                                <Text style={[styles.legendText, { color: theme.textSecondary }]}>{t.symbol}</Text>
                                <Text style={[styles.legendPct, { color: theme.textMuted }]}>
                                    {total > 0 ? ((t.usdValue / total) * 100).toFixed(0) : 0}%
                                </Text>
                            </View>
                        ))}
                    </View>
                </Card>
            )}

            {/* Asset List */}
            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Assets</Text>
            {tokens.length === 0 ? (
                <Card style={styles.emptyCard}>
                    <Text style={[styles.emptyText, { color: theme.textMuted }]}>Connect wallet to see your portfolio.</Text>
                </Card>
            ) : (
                <View style={styles.assetList}>
                    {tokens.map(token => <AssetRow key={token.symbol} token={token} />)}
                </View>
            )}

            {/* Settings Integration */}
            <View style={styles.settingsHeader}>
                <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>Configuration</Text>
            </View>

            <View style={[styles.settingsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <SettingItem
                    icon={theme.isDark ? Sun : Moon}
                    label="Appearance"
                    value={selectedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    onPress={toggleTheme}
                />
                <SettingItem icon={Shield} label="Security & Privacy" />
                <SettingItem icon={Globe} label="Language" value="English" />
                <SettingItem
                    icon={LogOut}
                    label="Sign Out"
                    color={theme.negative}
                    isLast
                    onPress={signOut}
                />
            </View>

            <View style={{ height: Spacing.xxl }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },
    title: { fontSize: 28, fontWeight: '800', marginTop: Spacing.xl, marginBottom: Spacing.lg },

    chartCard: { padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.lg },
    donutContainer: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center' },
    donutCenter: { position: 'absolute', alignItems: 'center' },
    donutLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
    donutValue: { fontSize: 28, fontWeight: '800' },
    donutSub: { fontSize: 10 },

    legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.md, marginTop: Spacing.md },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { fontSize: 12, fontWeight: '600' },
    legendPct: { fontSize: 12 },

    sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.sm },
    assetList: { gap: Spacing.sm },
    assetRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
    assetIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    assetIconText: { fontSize: 13, fontWeight: '800' },
    assetInfo: { flex: 1 },
    assetName: { fontSize: 14, fontWeight: '600' },
    assetRole: { fontSize: 11, marginTop: 2 },
    assetValues: { alignItems: 'flex-end' },
    assetUSD: { fontSize: 14, fontWeight: '700' },
    assetChange: { fontSize: 11, fontWeight: '600', marginTop: 2 },

    emptyCard: { padding: Spacing.xl, alignItems: 'center' },
    emptyText: { fontSize: 13, textAlign: 'center' },

    settingsHeader: { marginTop: Spacing.xl, marginBottom: Spacing.sm },
    settingsCard: { borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden' },
    settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    settingMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconContainer: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    settingLabel: { fontSize: 14, fontWeight: '600' },
    settingValue: { fontSize: 13, fontWeight: '500' },
});

const SettingItem = ({ icon: Icon, label, value, onPress, isLast, color: customColor }: any) => {
    const theme = useAppTheme();
    const color = customColor || theme.textPrimary;
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.settingItem,
                {
                    backgroundColor: pressed ? (theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') : 'transparent',
                    borderBottomColor: isLast ? 'transparent' : theme.border
                }
            ]}
        >
            <View style={styles.settingMain}>
                <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                    <Icon size={16} color={color} />
                </View>
                <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>{label}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {value && <Text style={[styles.settingValue, { color: theme.textSecondary }]}>{value}</Text>}
                <ChevronRight size={14} color={theme.textMuted} />
            </View>
        </Pressable>
    );
};
