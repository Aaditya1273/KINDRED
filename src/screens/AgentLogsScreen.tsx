import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import { GlassView } from '../components/GlassView';
import { agentService, AgentLog } from '../agents/agentService';
import { ChevronLeft, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
    FadeInUp,
    Layout as ReanimatedLayout,
    FadeIn
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export const AgentLogsScreen = () => {
    const [logs, setLogs] = useState<AgentLog[]>([]);
    const navigation = useNavigation();

    useEffect(() => {
        setLogs(agentService.getLatestLogs());
    }, []);

    const renderItem = ({ item, index }: { item: AgentLog, index: number }) => (
        <Animated.View entering={FadeInUp.delay(index * 100).duration(600)} layout={ReanimatedLayout.springify()}>
            <GlassView style={styles.logCard}>
                <View style={styles.logHeader}>
                    <View style={styles.statusRow}>
                        {item.status === 'executed' ? (
                            <CheckCircle size={16} color={theme.colors.success} />
                        ) : item.status === 'scheduled' ? (
                            <Clock size={16} color={theme.colors.warning} />
                        ) : (
                            <AlertCircle size={16} color={theme.colors.error} />
                        )}
                        <Typography variant="label" style={{ marginLeft: 6 }}>{item.status}</Typography>
                    </View>
                    <Typography variant="caption">{new Date(item.timestamp).toLocaleTimeString()}</Typography>
                </View>

                <Typography variant="body" weight="600" style={styles.actionTitle}>{item.action}</Typography>
                <Typography variant="caption" color={theme.colors.textSecondary}>{item.decision}</Typography>

                <View style={styles.hashContainer}>
                    <FileText size={12} color={theme.colors.textMuted} />
                    <Typography variant="label" style={styles.hashText}>{item.verification_hash}</Typography>
                </View>
            </GlassView>
        </Animated.View>
    );

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    navigation.goBack();
                }}>
                    <ChevronLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Typography variant="h2" style={styles.title}>Execution Logs</Typography>
                <View style={{ width: 24 }} />
            </View>

            <Typography variant="body" color={theme.colors.textSecondary} style={styles.subtitle}>
                Cryptographically signed receipts of every autonomous decision.
            </Typography>

            <FlatList
                data={logs}
                renderItem={renderItem}
                keyExtractor={(item) => item.verification_hash}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
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
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionTitle: {
        marginBottom: theme.spacing.xs,
    },
    hashContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.md,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: 6,
        borderRadius: 4,
    },
    hashText: {
        marginLeft: 6,
        fontSize: 10,
    },
});
