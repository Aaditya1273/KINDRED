import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import { GlassView } from '../components/GlassView';
import { ChevronLeft, Wallet, PieChart, ShieldCheck, Lock, Unlock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
    FadeInUp,
    FadeInDown,
    FadeInRight,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export const PortfolioScreen = () => {
    const navigation = useNavigation();
    const [isRevealed, setIsRevealed] = useState(false);
    const revealProgress = useSharedValue(0);

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        revealProgress.value = withTiming(1, { duration: 1500 });
        // Simulating the "Hold to Reveal" logic
        setTimeout(() => {
            if (revealProgress.value > 0.9) {
                setIsRevealed(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        }, 1500);
    };

    const handlePressOut = () => {
        if (!isRevealed) {
            revealProgress.value = withTiming(0, { duration: 300 });
        }
    };

    const maskValue = (value: string) => isRevealed ? value : '****';

    const barStyle = useAnimatedStyle(() => ({
        width: `${revealProgress.value * 100}%`,
        backgroundColor: theme.colors.primary,
    }));

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Typography variant="h2" style={styles.title}>Privacy Vault</Typography>
                <View style={styles.shieldBadge}>
                    <ShieldCheck size={16} color={theme.colors.primary} />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Animated.View entering={FadeInUp.duration(600)}>
                    <GlassView style={styles.summaryCard}>
                        <Typography variant="label">Shielded Net Worth</Typography>
                        <View style={styles.balanceRow}>
                            <Typography variant="h1">{maskValue('$124,800.00')}</Typography>
                            {!isRevealed && (
                                <Pressable
                                    onPressIn={handlePressIn}
                                    onPressOut={handlePressOut}
                                    style={styles.revealBtn}
                                >
                                    <View style={styles.revealTrack}>
                                        <Animated.View style={[styles.revealBar, barStyle]} />
                                    </View>
                                    <View style={styles.revealTextRow}>
                                        <Lock size={12} color={theme.colors.textMuted} />
                                        <Typography variant="caption" style={{ marginLeft: 4 }}>Hold to Reveal (Haptic)</Typography>
                                    </View>
                                </Pressable>
                            )}
                            {isRevealed && (
                                <TouchableOpacity onPress={() => setIsRevealed(false)} style={styles.lockBtn}>
                                    <Unlock size={16} color={theme.colors.primary} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Typography variant="caption" family="JetBrainsMono" color={theme.colors.textMuted}>
                            ENCRYPTED_VIA_ZAMA_PHE_v2.0
                        </Typography>
                    </GlassView>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.sectionHeader}>
                    <Typography variant="h3">Confidential Assets</Typography>
                </Animated.View>

                <View style={styles.assetList}>
                    {[
                        { id: 'F', name: 'Flow', type: 'Network Token', val: '42,000 FLOW', usd: '$84,000' },
                        { id: 'S', name: 'Storacha', type: 'Persistence', val: 'Agent Logs', usd: 'Managed' },
                        { id: 'Z', name: 'Zama Pool', type: 'fhEVM Vault', val: 'Encrypted', usd: '$40,800' }
                    ].map((asset, i) => (
                        <Animated.View key={asset.id} entering={FadeInRight.delay(300 + i * 100).duration(600)}>
                            <GlassView style={[styles.assetItem, i > 0 && { marginTop: theme.spacing.md }]}>
                                <View style={[styles.assetIcon, i === 2 && { backgroundColor: theme.colors.secondary }]}>
                                    <Typography variant="body" weight="bold">{asset.id}</Typography>
                                </View>
                                <View style={styles.assetDetails}>
                                    <Typography variant="body" weight="600">{asset.name}</Typography>
                                    <Typography variant="caption">{asset.type}</Typography>
                                </View>
                                <View style={styles.assetValue}>
                                    <Typography variant="body" weight="600">{maskValue(asset.val)}</Typography>
                                    <Typography variant="caption">{maskValue(asset.usd)}</Typography>
                                </View>
                            </GlassView>
                        </Animated.View>
                    ))}
                </View>

                <Animated.View entering={FadeInUp.delay(800).duration(600)}>
                    <GlassView style={styles.creditCard}>
                        <Typography variant="h3">Blind Credit Computation</Typography>
                        <Typography variant="caption" style={{ marginBottom: theme.spacing.md }}>
                            Run FHE logic on your encrypted spending data without revealing your history.
                        </Typography>
                        <TouchableOpacity style={styles.computeBtn} onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}>
                            <Typography variant="body" weight="bold" color="#000">Compute Privacy Score</Typography>
                        </TouchableOpacity>
                    </GlassView>
                </Animated.View>
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    title: {
        color: theme.colors.primary,
    },
    shieldBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 255, 163, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scroll: {
        paddingBottom: theme.spacing.xxl,
    },
    summaryCard: {
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    balanceRow: {
        marginVertical: theme.spacing.sm,
    },
    revealBtn: {
        marginTop: theme.spacing.md,
    },
    revealTrack: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 8,
    },
    revealBar: {
        height: '100%',
    },
    revealTextRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lockBtn: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    sectionHeader: {
        marginBottom: theme.spacing.md,
    },
    assetList: {
        marginBottom: theme.spacing.xl,
    },
    assetItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    assetIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    assetDetails: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    assetValue: {
        alignItems: 'flex-end',
    },
    creditCard: {
        padding: theme.spacing.lg,
        backgroundColor: '#0D0D0D',
    },
    computeBtn: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    }
});
