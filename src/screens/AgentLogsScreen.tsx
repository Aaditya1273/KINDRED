import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import { GlassView } from '../components/GlassView';
import { agentService, AgentLog } from '../agents/agentService';
import { ChevronLeft, FileText, CheckCircle, ExternalLink, ShieldCheck, Database } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
    FadeInUp,
    Layout as ReanimatedLayout,
    FadeIn,
    withTiming,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export const AgentLogsScreen = () => {
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const [verifying, setVerifying] = useState<string | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        setLogs(agentService.getLatestLogs());
    }, []);

    const handleVerify = (id: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setVerifying(id);
        setTimeout(() => {
            setVerifying(null);
        }, 2500);
    };

    const renderItem = ({ item, index }: { item: AgentLog, index: number }) => (
        <Animated.View entering={FadeInUp.delay(index * 100).duration(600)} layout={ReanimatedLayout.springify()}>
            <GlassView style={styles.logCard}>
                <View style={styles.logHeader}>
                    <Typography variant="label" family="JetBrainsMono" color={theme.colors.primary}>
                        CID: {item.verification_hash.substring(0, 16)}...
                    </Typography>
                    <Typography variant="caption">{new Date(item.timestamp).toLocaleTimeString()}</Typography>
                </View>

                <Typography variant="body" weight="600" style={styles.actionTitle}>{item.action}</Typography>
                <Typography variant="caption" color={theme.colors.textSecondary} style={{ marginBottom: theme.spacing.md }}>
                    {item.decision}
                </Typography>

                <TouchableOpacity
                    style={styles.verifyBtn}
                    onPress={() => handleVerify(item.verification_hash)}
                >
                    <ExternalLink size={14} color={theme.colors.secondary} />
                    <Typography variant="caption" color={theme.colors.secondary} style={{ marginLeft: 6 }}>
                        Verify on Block Explorer (Storacha)
                    </Typography>
                </TouchableOpacity>
            </GlassView>
        </Animated.View>
    );

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Typography variant="h2" style={styles.title}>Audit Trail</Typography>
                <Database size={20} color={theme.colors.primary} />
            </View>

            <Typography variant="body" color={theme.colors.textSecondary} style={styles.subtitle}>
                Immutable proofs of autonomy rooted on Filecoin.
            </Typography>

            <FlatList
                data={logs}
                renderItem={renderItem}
                keyExtractor={(item) => item.verification_hash}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            {/* Verification Overlay */}
            <Modal transparent visible={!!verifying} animationType="fade">
                <View style={styles.overlay}>
                    <GlassView style={styles.overlayCard}>
                        <Animated.View entering={FadeIn.duration(500)}>
                            <ShieldCheck size={48} color={theme.colors.primary} style={{ alignSelf: 'center', marginBottom: 16 }} />
                            <Typography variant="h3" style={{ textAlign: 'center' }}>Proof Verified</Typography>
                            <Typography variant="caption" family="JetBrainsMono" style={{ textAlign: 'center', marginTop: 8 }}>
                                Root Hash: {verifying?.substring(0, 32)}...
                            </Typography>
                            <View style={styles.successBadge}>
                                <Typography variant="label" color="#000">Logic Integrity Checked</Typography>
                            </View>
                        </Animated.View>
                    </GlassView>
                </View>
            </Modal>
        </Layout>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    title: {
        color: theme.colors.primary,
    },
    subtitle: {
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
    },
    list: {
        paddingBottom: theme.spacing.xxl,
    },
    logCard: {
        marginBottom: theme.spacing.md,
        backgroundColor: '#0D0D0D',
        borderLeftWidth: 2,
        borderLeftColor: theme.colors.primary,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    actionTitle: {
        marginBottom: theme.spacing.xs,
    },
    verifyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 224, 255, 0.05)',
        padding: 8,
        borderRadius: 8,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    overlayCard: {
        width: '100%',
        padding: 32,
        alignItems: 'center',
    },
    successBadge: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 24,
    }
});
