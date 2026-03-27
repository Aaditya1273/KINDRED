import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { AppHeader } from '@/components/reborn/AppHeader';
import { Activity, ShieldCheck, Zap, ChevronRight, CheckCircle, Clock, Link, FileText } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from '@/components/ui/card';

const LOGS = [
    {
        id: '1',
        action: 'Yield Optimization',
        status: 'Success',
        time: '2 mins ago',
        proof: 'Flow Block #842,102',
        desc: 'Rebalanced $420.50 to Smart Cash Vault for +0.5% Alpha.',
        type: 'ON-CHAIN'
    },
    {
        id: '2',
        action: 'Slippage Guard',
        status: 'Skipped',
        time: '1 hour ago',
        proof: 'Local AI Decision',
        desc: 'Skipped ETH trade because slippage (1.2%) exceeded 0.5% limit.',
        type: 'AI'
    },
    {
        id: '3',
        action: 'Data Snapshot',
        status: 'Archived',
        time: '4 hours ago',
        proof: 'Storacha/IPFS: CID...4f2a',
        desc: 'Encrypted backup of spending insights stored on Filecoin.',
        type: 'FILECOIN'
    },
    {
        id: '4',
        action: 'Portfolio Sync',
        status: 'Success',
        time: '1 day ago',
        proof: 'Flow Block #841,005',
        desc: 'Verified balance change after $1,000 top-up.',
        type: 'ON-CHAIN'
    }
];

export default function ActivityLogs() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const [selectedLog, setSelectedLog] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openLog = (log: any) => {
        setSelectedLog(log);
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
                <Text style={[styles.title, { color: theme.textPrimary }]}>Receipts</Text>
                <View style={[styles.badge, { backgroundColor: theme.primary + '15' }]}>
                    <ShieldCheck size={12} color={theme.primary} />
                    <Text style={[styles.badgeText, { color: theme.primary }]}>AUDITABLE</Text>
                </View>
            </View>

            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Real-time activity logs and on-chain proofs for every action KINDRED takes.
            </Text>

            {LOGS.map((log, idx) => (
                <Animated.View key={log.id} entering={FadeInDown.delay(idx * 50).duration(400)} style={[styles.logCard, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                    <Pressable onPress={() => openLog(log)} style={{ flex: 1 }}>
                        <BlurView intensity={Platform.OS === 'web' ? 15 : 25} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                        <View style={styles.logInner}>
                            <View style={styles.logHeader}>
                                <View style={[styles.iconBox, { backgroundColor: theme.primary + '10' }]}>
                                    {log.type === 'ON-CHAIN' ? <Zap size={18} color={theme.primary} /> : <FileText size={18} color={theme.textMuted} />}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.actionRow}>
                                        <Text style={[styles.actionTitle, { color: theme.textPrimary }]}>{log.action}</Text>
                                        <Text style={[styles.statusTag, { color: log.status === 'Success' ? theme.positive : theme.textMuted }]}>{log.status}</Text>
                                    </View>
                                    <Text style={[styles.time, { color: theme.textMuted }]}>{log.time}</Text>
                                </View>
                            </View>

                            <Text style={[styles.desc, { color: theme.textSecondary }]}>{log.desc}</Text>

                            <View style={[styles.proofBadge, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
                                <Link size={12} color={theme.textMuted} />
                                <Text style={[styles.proofText, { color: theme.textMuted }]}>{log.proof}</Text>
                                <ChevronRight size={12} color={theme.textMuted} />
                            </View>
                        </View>
                    </Pressable>
                </Animated.View>
            ))}

            <View style={{ height: 100 }} />

            {/* Receipt Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <BlurView intensity={30} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    <Pressable
                        style={[styles.modalContent, { backgroundColor: theme.isDark ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.85)', borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <BlurView intensity={Platform.OS === 'web' ? 40 : 60} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                        <View style={[styles.modalHeader, { borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Receipt Details</Text>
                            <Pressable onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                                <Text style={{ color: theme.primary, fontWeight: '700' }}>Close</Text>
                            </Pressable>
                        </View>

                        {selectedLog && (
                            <View style={styles.modalBody}>
                                <View style={[styles.detailRow, { borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                                    <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Action</Text>
                                    <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{selectedLog.action}</Text>
                                </View>
                                <View style={[styles.detailRow, { borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                                    <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Status</Text>
                                    <Text style={[styles.detailValue, { color: selectedLog.status === 'Success' ? theme.positive : theme.textPrimary }]}>{selectedLog.status}</Text>
                                </View>
                                <View style={[styles.detailRow, { borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                                    <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Type</Text>
                                    <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{selectedLog.type}</Text>
                                </View>
                                <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                                    <Text style={[styles.detailLabel, { color: theme.textMuted }]}>Proof</Text>
                                    <Text style={[styles.detailValue, { color: theme.primary }]} selectable>{selectedLog.proof}</Text>
                                </View>

                                <Pressable
                                    onPress={() => {
                                        alert(`Opening Explorer for: ${selectedLog.proof}`);
                                    }}
                                    style={[styles.modalActionBtn, { backgroundColor: theme.primary, marginTop: 24 }]}
                                >
                                    <Text style={[styles.modalActionBtnText, { color: theme.bg }]}>View on Explorer</Text>
                                </Pressable>
                            </View>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xl, marginBottom: 8 },
    title: { fontSize: 26, fontWeight: '900' },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
    subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 32 },

    logCard: { borderRadius: 28, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
    logInner: { padding: 20 },
    logHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
    iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    actionTitle: { fontSize: 16, fontWeight: '700' },
    statusTag: { fontSize: 11, fontWeight: '800' },
    time: { fontSize: 12, marginTop: 2 },
    desc: { fontSize: 13, lineHeight: 18, marginBottom: 16 },

    proofBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 16 },
    proofText: { fontSize: 11, fontWeight: '600', flex: 1 },

    // Modal Styles
    modalOverlay: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        width: '85%', maxWidth: 400, borderRadius: 32, overflow: 'hidden', borderWidth: 1,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.2, shadowRadius: 40 },
            web: { boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }
        })
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, zIndex: 10 },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    modalCloseBtn: { padding: 8 },
    modalBody: { padding: 24, zIndex: 10 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1 },
    detailLabel: { fontSize: 13, fontWeight: '600' },
    detailValue: { fontSize: 13, fontWeight: '700' },
    modalActionBtn: {
        height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
            web: { boxShadow: '0 4px 12px rgba(255, 123, 26, 0.3)' }
        })
    },
    modalActionBtnText: { fontSize: 16, fontWeight: '700' },
});
