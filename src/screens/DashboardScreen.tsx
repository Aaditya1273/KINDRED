import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import { GlassView } from '../components/GlassView';
import { WealthOrb } from '../components/WealthOrb';
import { Activity, Shield, TrendingUp, Cpu, Layout as LayoutIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAgent } from '../hooks/useAgent';
import Animated, {
    FadeInUp,
    FadeInRight,
    FadeIn
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export const DashboardScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { logs, isProcessing, runAnalysis } = useAgent();
    const [balance] = useState(124800.00);

    const handleAction = (callback: () => void) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        callback();
    };

    return (
        <Layout>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
                    <View>
                        <Typography variant="label">Sovereign Identity</Typography>
                        <Typography variant="h2" style={{ color: theme.colors.primary }}>KINDRED</Typography>
                    </View>
                    <View style={styles.statusBadge}>
                        <View style={styles.pulse} />
                        <Typography variant="caption" style={{ color: theme.colors.primary, marginLeft: 6 }}>Live on Flow</Typography>
                    </View>
                </Animated.View>

                {/* The Wealth Orb - Central Piece */}
                <Animated.View entering={FadeIn.duration(1500)}>
                    <WealthOrb balance={balance} isProcessing={isProcessing} />
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.balanceInfo}>
                    <Typography variant="label" style={styles.centerText}>Managed Capital Potential</Typography>
                    <Typography variant="h1" style={[styles.centerText, styles.balanceText]}>
                        ${balance.toLocaleString()}
                    </Typography>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.sectionHeader}>
                    <Typography variant="h3">ERC-8004 Agent Hub</Typography>
                    <Typography variant="caption" family="JetBrainsMono">Autonomous Thinking Log</Typography>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(700).duration(600)}>
                    <GlassView style={styles.thinkingLog}>
                        {logs.slice(0, 3).map((log, i) => (
                            <Typography
                                key={i}
                                variant="caption"
                                family="JetBrainsMono"
                                color={i === 0 ? theme.colors.primary : theme.colors.textSecondary}
                                style={styles.logLine}
                            >
                                [{log.status.toUpperCase()}] {log.decision}
                            </Typography>
                        ))}
                        <TouchableOpacity
                            style={styles.manifestBtn}
                            onPress={() => handleAction(() => navigation.navigate('AgentLogs'))}
                        >
                            <Typography variant="caption" color={theme.colors.secondary}>View Full Manifest & CID</Typography>
                        </TouchableOpacity>
                    </GlassView>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(800).duration(600)} style={styles.sectionHeader}>
                    <Typography variant="h3">DeFi Autopilot Loops</Typography>
                </Animated.View>

                <TouchableOpacity onPress={() => handleAction(() => navigation.navigate('Portfolio'))}>
                    <GlassView style={styles.loopCard}>
                        <View style={styles.loopRow}>
                            <Activity size={20} color={theme.colors.primary} />
                            <View style={styles.loopText}>
                                <Typography variant="body" weight="600">Flow-USDC Yield Aggregator</Typography>
                                <Typography variant="caption">Next Execution: 12m 45s</Typography>
                            </View>
                            <Typography variant="body" color={theme.colors.success}>+8.4% APR</Typography>
                        </View>
                    </GlassView>
                </TouchableOpacity>

            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    scroll: {
        paddingVertical: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 255, 163, 0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 163, 0.2)',
    },
    pulse: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.primary,
    },
    centerText: {
        textAlign: 'center',
    },
    balanceInfo: {
        marginVertical: theme.spacing.lg,
    },
    balanceText: {
        fontSize: 42,
        fontWeight: '900',
        letterSpacing: -1,
    },
    sectionHeader: {
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.md,
    },
    thinkingLog: {
        padding: theme.spacing.md,
        backgroundColor: '#0D0D0D',
    },
    logLine: {
        lineHeight: 18,
        marginBottom: 4,
    },
    manifestBtn: {
        marginTop: theme.spacing.md,
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
    },
    loopCard: {
        padding: theme.spacing.md,
    },
    loopRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loopText: {
        flex: 1,
        marginLeft: theme.spacing.md,
    },
});
