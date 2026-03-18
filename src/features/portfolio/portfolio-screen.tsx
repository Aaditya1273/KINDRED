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
import { Colors, Spacing, Radius } from '@/theme/tokens';
import type { TokenBalance } from '@/lib/agent/portfolio';

const ASSET_ROLES: Record<string, string> = {
    ETH: 'Growth',
    BTC: 'Store of Value',
    USDC: 'Stability',
    FLOW: 'Yield Engine',
};

// Minimal donut chart using SVG
function DonutChart({ tokens, total }: { tokens: TokenBalance[]; total: number }) {
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
                    stroke={Colors.surface}
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
                <Text style={styles.donutLabel}>Allocated</Text>
                <Text style={styles.donutValue}>{tokens.length}</Text>
                <Text style={styles.donutSub}>assets</Text>
            </View>
        </View>
    );
}

function AssetRow({ token }: { token: TokenBalance }) {
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
                    <Text style={styles.assetName}>{token.name}</Text>
                    <Text style={styles.assetRole}>{role}</Text>
                </View>
                <View style={styles.assetValues}>
                    <Text style={styles.assetUSD}>${token.usdValue.toFixed(2)}</Text>
                    <Text style={[styles.assetChange, { color: isPositive ? Colors.positive : Colors.negative }]}>
                        {isPositive ? '+' : ''}{token.change24h.toFixed(2)}%
                    </Text>
                </View>
            </PressableCard>
        </Animated.View>
    );
}

export function PortfolioScreen() {
    const insets = useSafeAreaInsets();
    const { address } = useAccount();
    const portfolio = useAgentStore.use.portfolio();
    const refreshPortfolio = useAgentStore.use.refreshPortfolio();
    const [refreshing, setRefreshing] = React.useState(false);

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
            style={[styles.root, { paddingTop: insets.top }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.cyan} />}
        >
            <Text style={styles.title}>Portfolio</Text>

            {/* Allocation Chart */}
            {tokens.length > 0 && (
                <Card style={styles.chartCard}>
                    <DonutChart tokens={tokens} total={total} />
                    {/* Legend */}
                    <View style={styles.legend}>
                        {tokens.map(t => (
                            <View key={t.symbol} style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: t.color }]} />
                                <Text style={styles.legendText}>{t.symbol}</Text>
                                <Text style={styles.legendPct}>
                                    {total > 0 ? ((t.usdValue / total) * 100).toFixed(0) : 0}%
                                </Text>
                            </View>
                        ))}
                    </View>
                </Card>
            )}

            {/* Asset List */}
            <Text style={styles.sectionLabel}>Assets</Text>
            {tokens.length === 0 ? (
                <Card style={styles.emptyCard}>
                    <Text style={styles.emptyText}>Connect wallet to see your portfolio.</Text>
                </Card>
            ) : (
                <View style={styles.assetList}>
                    {tokens.map(token => <AssetRow key={token.symbol} token={token} />)}
                </View>
            )}

            <View style={{ height: Spacing.xxl }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.bg },
    content: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl },
    title: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, marginTop: Spacing.xl, marginBottom: Spacing.lg },

    chartCard: { padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.lg },
    donutContainer: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center' },
    donutCenter: { position: 'absolute', alignItems: 'center' },
    donutLabel: { fontSize: 10, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
    donutValue: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
    donutSub: { fontSize: 10, color: Colors.textSecondary },

    legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.md, marginTop: Spacing.md },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
    legendPct: { fontSize: 12, color: Colors.textMuted },

    sectionLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.sm },
    assetList: { gap: Spacing.sm },
    assetRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, gap: Spacing.md },
    assetIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    assetIconText: { fontSize: 13, fontWeight: '800' },
    assetInfo: { flex: 1 },
    assetName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
    assetRole: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
    assetValues: { alignItems: 'flex-end' },
    assetUSD: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
    assetChange: { fontSize: 11, fontWeight: '600', marginTop: 2 },

    emptyCard: { padding: Spacing.xl, alignItems: 'center' },
    emptyText: { fontSize: 13, color: Colors.textMuted, textAlign: 'center' },
});
