import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import { GlassView } from '../components/GlassView';
import { Activity, Shield, TrendingUp, Cpu } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAgent } from '../hooks/useAgent';
import Animated, {
    FadeInUp,
    FadeInRight,
    Layout as ReanimatedLayout,
    FadeIn
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedGlassView = Animated.createAnimatedComponent(GlassView);

export const DashboardScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { logs, isProcessing, runAnalysis } = useAgent();

    const handleAction = (callback: () => void) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        callback();
    };

    const handleRunAnalysis = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        runAnalysis();
    };

    return (
        <Layout>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
                    <View>
                        <Typography variant="label">Welcome back</Typography>
                        <Typography variant="h2">Sovereign User</Typography>
                    </View>
                    <TouchableOpacity
                        style={styles.profileBadge}
                        onPress={handleRunAnalysis}
                    >
                        <Shield size={20} color={isProcessing ? theme.colors.info : theme.colors.primary} />
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(200).duration(600)}>
                    <TouchableOpacity onPress={() => handleAction(() => navigation.navigate('Portfolio'))}>
                        <GlassView style={styles.balanceContainer}>
                            <Typography variant="label">Total Managed Assets</Typography>
                            <View style={styles.balanceRow}>
                                <Typography variant="h1">$124,800.00</Typography>
                                <View style={styles.trendRow}>
                                    <TrendingUp size={16} color={theme.colors.success} />
                                    <Typography variant="caption" color={theme.colors.success} style={{ marginLeft: 4 }}>+8.5%</Typography>
                                </View>
                            </View>
                        </GlassView>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.sectionHeader}>
                    <Typography variant="h3">Agent Activity</Typography>
                    <Typography variant="caption">Autonomous Logic Monitoring</Typography>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(500).duration(600)}>
                    <GlassView style={styles.agentStatus}>
                        <View style={styles.agentRow}>
                            <View style={styles.agentIconContainer}>
                                <Cpu size={24} color={isProcessing ? theme.colors.info : theme.colors.primary} />
                            </View>
                            <View style={styles.agentTextContainer}>
                                <Typography variant="body" weight="600">Blind Wealth Manager</Typography>
                                <Typography variant="caption">
                                    Status: {isProcessing ? 'Processing Logic...' : 'Analyzing Yield Ops'}
                                </Typography>
                            </View>
                            <View style={styles.pulseContainer}>
                                <View style={[styles.pulse, isProcessing && { backgroundColor: theme.colors.info }]} />
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <Animated.View entering={FadeIn.key(logs[0]?.timestamp || 'default')}>
                            <Typography variant="caption" color={theme.colors.textSecondary} style={styles.lastAction}>
                                "{logs[0]?.decision || 'Scanning Flow DeFi vaults for USDC yields > 8% APR. Slippage check passed.'}"
                            </Typography>
                        </Animated.View>
                    </GlassView>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(600).duration(600)} style={styles.sectionHeader}>
                    <Typography variant="h3">Strategic Assets</Typography>
                </Animated.View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.assetsScroll}>
                    <Animated.View entering={FadeInRight.delay(700).duration(600)}>
                        <GlassView style={styles.assetCard}>
                            <Typography variant="label">Flow USDC</Typography>
                            <Typography variant="h3">$84,000</Typography>
                            <Typography variant="caption" color={theme.colors.success}>+4.2% (7d)</Typography>
                        </GlassView>
                    </Animated.View>

                    <Animated.View entering={FadeInRight.delay(800).duration(600)}>
                        <GlassView style={[styles.assetCard, { marginLeft: theme.spacing.md }]}>
                            <Typography variant="label">fhEVM Pool</Typography>
                            <Typography variant="h3">$40,800</Typography>
                            <Typography variant="caption" color={theme.colors.info}>Confidential</Typography>
                        </GlassView>
                    </Animated.View>
                </ScrollView>

                <Animated.View entering={FadeInUp.delay(1000).duration(600)}>
                    <TouchableOpacity
                        style={styles.logsLink}
                        onPress={() => handleAction(() => navigation.navigate('AgentLogs'))}
                    >
                        <Activity size={18} color={theme.colors.primary} />
                        <Typography variant="body" weight="500" color={theme.colors.primary} style={{ marginLeft: 8 }}>
                            View Cryptographic Execution Logs
                        </Typography>
                    </TouchableOpacity>
                </Animated.View>
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
    profileBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 239, 139, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 239, 139, 0.2)',
    },
    balanceContainer: {
        marginBottom: theme.spacing.xl,
        padding: theme.spacing.lg,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: theme.spacing.xs,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: theme.spacing.md,
        backgroundColor: 'rgba(0, 239, 139, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    sectionHeader: {
        marginBottom: theme.spacing.md,
    },
    agentStatus: {
        marginBottom: theme.spacing.xl,
    },
    agentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    agentIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 239, 139, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    agentTextContainer: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    pulseContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulse: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.glassBorder,
        marginVertical: theme.spacing.md,
    },
    lastAction: {
        fontStyle: 'italic',
    },
    assetsScroll: {
        marginBottom: theme.spacing.xl,
    },
    assetCard: {
        width: 160,
        padding: theme.spacing.md,
    },
    logsLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.md,
        backgroundColor: 'rgba(0, 239, 139, 0.05)',
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(0, 239, 139, 0.1)',
        marginBottom: theme.spacing.xxl,
    },
});
