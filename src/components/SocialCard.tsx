import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image, Share } from 'react-native';
import { Typography } from './Typography';
import { theme } from '../theme';
import { GlassView } from './GlassView';
import { Share2, X, TrendingUp } from 'lucide-react-native';
import Animated, { FadeIn, ScaleIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface SocialCardProps {
    visible: boolean;
    onClose: () => void;
    growth: string;
    balance: string;
}

export const SocialCard: React.FC<SocialCardProps> = ({ visible, onClose, growth, balance }) => {
    const handleShare = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        try {
            await Share.share({
                message: `My wealth is pulse-growing autonomously with KINDRED. Total Managed: ${balance} (${growth} this month) #PLGenesis #KINDRED`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
                    <Animated.View entering={ScaleIn.duration(500)} style={styles.cardWrapper}>
                        <GlassView style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Typography variant="h2" style={{ color: theme.colors.primary }}>KINDRED</Typography>
                                <Typography variant="caption" family="JetBrainsMono">SOVEREIGN_REPORT</Typography>
                            </View>

                            <View style={styles.statBox}>
                                <Typography variant="label">Autonomous Growth</Typography>
                                <View style={styles.growthRow}>
                                    <TrendingUp size={32} color={theme.colors.success} />
                                    <Typography variant="h1" style={styles.growthText}>{growth}</Typography>
                                </View>
                            </View>

                            <View style={styles.footer}>
                                <View>
                                    <Typography variant="label">Net Worth</Typography>
                                    <Typography variant="h3">{balance}</Typography>
                                </View>
                                <View style={styles.qrPlaceholder}>
                                    <Typography variant="label" style={{ fontSize: 8 }}>KINDRED AI</Typography>
                                </View>
                            </View>
                        </GlassView>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                                <X size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                                <Share2 size={24} color="#000" />
                                <Typography variant="body" weight="bold" color="#000" style={{ marginLeft: 8 }}>
                                    Share to X
                                </Typography>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    container: {
        width: '100%',
    },
    cardWrapper: {
        width: '100%',
    },
    card: {
        padding: 32,
        height: 400,
        backgroundColor: '#0D0D0D',
        borderColor: theme.colors.primary,
        borderWidth: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 40,
    },
    statBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    growthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    growthText: {
        fontSize: 56,
        color: theme.colors.success,
        marginLeft: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 40,
    },
    qrPlaceholder: {
        width: 48,
        height: 48,
        borderWidth: 1,
        borderColor: theme.colors.textMuted,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    actionRow: {
        flexDirection: 'row',
        marginTop: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    shareBtn: {
        flex: 1,
        height: 56,
        backgroundColor: theme.colors.primary,
        borderRadius: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
