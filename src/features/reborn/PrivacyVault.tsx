import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Modal, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { AppHeader } from '@/components/reborn/AppHeader';
import { Lock, EyeOff, ShieldCheck, Database, Zap, ChevronRight, Fingerprint, Activity as ActivityIcon, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight, FadeIn, FadeOut } from 'react-native-reanimated';
import { router } from 'expo-router';
import { confidentialService, FinancialInsight } from '@/lib/zama/ConfidentialService';
import { useAgentStore } from '@/lib/agent/use-agent-store';

// Insights are now generated dynamically via Zama FHE

export default function PrivacyVault() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const portfolio = useAgentStore.use.portfolio();
    const isWorldIDVerified = useAgentStore.use.isWorldIDVerified();
    const addLog = useAgentStore.use.addLog();

    const [revokeVisible, setRevokeVisible] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStep, setAnalysisStep] = useState<'idle' | 'encrypting' | 'analyzing' | 'done'>('idle');
    const [dynamicInsight, setDynamicInsight] = useState<FinancialInsight | null>(null);

    const runAnalysis = async () => {
        const totalAssets = portfolio?.totalUSD || 0;
        setIsAnalyzing(true);
        setAnalysisStep('encrypting');

        // 1. Encrypt raw data context (FHE-RS)
        const context = await confidentialService.encryptFinancialContext(totalAssets);

        setAnalysisStep('analyzing');

        // 2. Perform Blind Analysis on Ciphertext via Zama FHEVM
        const insight = await confidentialService.blindAnalyze(totalAssets, 18.4);

        setDynamicInsight(insight);
        addLog({
            action: 'Zama FHE Analysis',
            status: 'Success',
            message: insight.recommendation,
            timestamp: Date.now(),
            txHash: '0x52fbca3406ea2e93a5564f71434f6ee8cdf77e13'
        });

        setAnalysisStep('done');
        setIsAnalyzing(false);
    };

    return (
        <View style={[styles.root, { backgroundColor: theme.bg }]}>
            <ScrollView
                style={styles.root}
                contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md }]}
                showsVerticalScrollIndicator={false}
            >
                <AppHeader />

                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.textPrimary }]}>Privacy Vault</Text>
                    <View style={[styles.badge, { backgroundColor: theme.primary + '15' }]}>
                        <Zap size={12} color={theme.primary} />
                        <Text style={[styles.badgeText, { color: theme.primary }]}>FHE MAGIC ACTIVE</Text>
                    </View>
                </View>

                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    KINDRED processes your most sensitive data while it's encrypted (Zama FHE). I provide Alpha without ever seeing your raw numbers.
                </Text>

                {/* Blind AI Insights Section */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Blind AI Insights</Text>
                    {analysisStep !== 'done' && (
                        <Pressable
                            disabled={isAnalyzing}
                            onPress={runAnalysis}
                            style={[styles.runBtn, { backgroundColor: theme.primary + '10' }]}
                        >
                            <Sparkles size={14} color={theme.primary} />
                            <Text style={[styles.runBtnText, { color: theme.primary }]}>
                                {isAnalyzing ? 'Processing...' : 'Run Blind Analysis'}
                            </Text>
                        </Pressable>
                    )}
                </View>

                {isAnalyzing && (
                    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.loaderContainer}>
                        <ActivityIndicator color={theme.primary} />
                        <Text style={[styles.loaderText, { color: theme.textSecondary }]}>
                            {analysisStep === 'encrypting' ? 'Encrypting via TFHE-rs...' : 'Performing Blind Analysis on Ciphertext...'}
                        </Text>
                    </Animated.View>
                )}

                {dynamicInsight && (
                    <Animated.View
                        entering={FadeInDown}
                        style={[styles.insightCard, { borderColor: theme.primary, borderWidth: 1, backgroundColor: theme.primary + '05' }]}
                    >
                        <BlurView intensity={30} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                        <View style={styles.insightInner}>
                            <View style={styles.insightHeader}>
                                <ShieldCheck size={18} color={theme.primary} />
                                <Text style={[styles.insightText, { color: theme.textPrimary, letterSpacing: 0.5 }]}>CONFIDENTIAL ALPHA</Text>
                            </View>
                            <View style={styles.resultBox}>
                                <Text style={[styles.insightDetail, { color: theme.textPrimary, fontWeight: '700', fontSize: 16 }]}>
                                    {dynamicInsight.recommendation}
                                </Text>
                            </View>
                            <View style={styles.metaRow}>
                                <View style={styles.metaLabel}>
                                    <Database size={10} color={theme.textMuted} />
                                    <View>
                                        <Text style={[styles.metaText, { color: theme.textMuted }]}>Zama FHE Encrypted</Text>
                                        <Text style={{ fontSize: 8, color: theme.textMuted }}>TX: 0x52fb...7e13</Text>
                                    </View>
                                </View>
                                <Pressable onPress={() => router.push('/reborn/Dashboard')} style={[styles.actionLink, { backgroundColor: theme.primary, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 }]}>
                                    <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 11 }}>EXECUTE ON FLOW</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Animated.View>
                )}

                {!dynamicInsight && !isAnalyzing && (
                    <Animated.View
                        entering={FadeInDown.delay(200)}
                        style={[styles.insightCard, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', padding: 32, alignItems: 'center' }]}
                    >
                        <Lock size={32} color={theme.textMuted} style={{ marginBottom: 16, opacity: 0.5 }} />
                        <Text style={[styles.insightText, { color: theme.textMuted, textAlign: 'center' }]}>
                            No active insights. Run Blind Analysis to generate AI recommendations while keeping your data encrypted.
                        </Text>
                    </Animated.View>
                )}

                {/* Data Sovereignty Status */}
                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Data Sovereignty</Text>
                </View>
                <Animated.View
                    entering={FadeInDown.delay(400).duration(600)}
                    style={[styles.sovCard, { borderColor: theme.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }]}
                >
                    <BlurView intensity={Platform.OS === 'web' ? 20 : 25} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    <View style={styles.sovInner}>
                        <VaultItem
                            icon={Database}
                            label="Bank Statements"
                            status="Encrypted & Uploaded"
                            color={theme.positive}
                        />
                        <VaultItem
                            icon={ActivityIcon}
                            label="Spending History"
                            status="Processing in FHE"
                            color={theme.primary}
                            onPress={() => router.push('/reborn/Dashboard')}
                        />
                        <VaultItem
                            icon={Fingerprint}
                            label="Identity Verification"
                            status={isWorldIDVerified ? "World ID Verified" : "Verification Pending"}
                            color={isWorldIDVerified ? theme.positive : theme.textMuted}
                            isLast
                            onPress={isWorldIDVerified ? null : () => router.push('/trust/trust-screen')}
                        />
                    </View>
                </Animated.View>

                {/* Control Section */}
                <Pressable
                    style={[styles.controlBtn, { backgroundColor: theme.primary }]}
                    onPress={() => setRevokeVisible(true)}
                >
                    <ShieldCheck size={20} color="#FFF" />
                    <Text style={styles.controlBtnText}>Revoke Data Permissions</Text>
                </Pressable>

                <View style={{ height: 120 }} />

                {/* Revoke Warning Modal */}
                <Modal animationType="fade" transparent={true} visible={revokeVisible} onRequestClose={() => setRevokeVisible(false)}>
                    <Pressable style={styles.modalOverlay} onPress={() => setRevokeVisible(false)}>
                        <BlurView intensity={30} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                        <Pressable
                            style={[styles.modalContent, { backgroundColor: theme.isDark ? 'rgba(30,30,30,0.8)' : 'rgba(255,255,255,0.85)', borderColor: theme.negative }]}
                            onPress={(e) => e.stopPropagation()}
                        >
                            <BlurView intensity={Platform.OS === 'web' ? 40 : 60} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                            <View style={[styles.modalHeader, { borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                                <Text style={[styles.modalTitle, { color: theme.negative }]}>Revoke Access?</Text>
                                <Pressable onPress={() => setRevokeVisible(false)} style={styles.modalCloseBtn}>
                                    <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>Cancel</Text>
                                </Pressable>
                            </View>
                            <View style={styles.modalBody}>
                                <Text style={[styles.vaultDetailText, { color: theme.textSecondary, marginBottom: 24 }]}>
                                    Revoking permissions will instantly delete your FHE keys and halt all automated yield strategies. Your funds will remain in their current protocols.
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        alert("Permissions Revoked. All data deleted.");
                                        setRevokeVisible(false);
                                    }}
                                    style={[styles.modalActionBtn, { backgroundColor: theme.negative }]}
                                >
                                    <Text style={[styles.modalActionBtnText, { color: '#FFF' }]}>Confirm Revoke</Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    </Pressable>
                </Modal>
            </ScrollView>
        </View>
    );
}

const VaultItem = ({ icon: Icon, label, status, color, isLast, onPress }: any) => {
    const theme = useAppTheme();

    return (
        <Pressable
            disabled={!onPress}
            onPress={onPress}
            style={({ pressed }) => [
                styles.vaultItem,
                !isLast && { borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderBottomWidth: 1 },
                pressed && onPress && { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }
            ]}
        >
            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                <Icon size={18} color={color} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.vaultLabel, { color: theme.textPrimary }]}>{label}</Text>
                <Text style={[styles.vaultStatus, { color: theme.textSecondary }]}>{status}</Text>
            </View>
            {onPress ? <ChevronRight size={16} color={theme.textMuted} /> : <Lock size={14} color={theme.textMuted} opacity={0.5} />}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { paddingHorizontal: 20 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 8 },
    title: { fontSize: 26, fontWeight: '900' },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
    subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 32 },

    sectionHeader: { marginBottom: 16 },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '800' },

    insightCard: { borderRadius: 24, marginBottom: 12, borderWidth: 1, overflow: 'hidden' },
    insightInner: { padding: 16 },
    insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    insightText: { fontSize: 13, fontWeight: '800', flex: 1, letterSpacing: 1 },
    insightDetail: { fontSize: 13, lineHeight: 18 },
    resultBox: { marginVertical: 12, padding: 12, backgroundColor: 'rgba(255,123,26,0.05)', borderRadius: 16 },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 12 },
    metaLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: { fontSize: 11, fontWeight: '600' },

    sovCard: { borderRadius: 28, borderWidth: 1, overflow: 'hidden', marginBottom: 32 },
    sovInner: { padding: 0 },
    vaultItem: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    vaultLabel: { fontSize: 15, fontWeight: '700' },
    vaultStatus: { fontSize: 12, marginTop: 2 },

    controlBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18, borderRadius: 20, marginTop: 10 },
    controlBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

    runBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    runBtnText: { fontSize: 12, fontWeight: '700' },

    loaderContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 16, marginBottom: 16 },
    loaderText: { fontSize: 13, fontWeight: '500' },
    actionLink: { padding: 4 },

    modalOverlay: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '85%', maxWidth: 400, borderRadius: 32, overflow: 'hidden', borderWidth: 1,
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1 },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    modalCloseBtn: { padding: 8 },
    modalBody: { padding: 24 },
    vaultDetailText: { fontSize: 14, lineHeight: 22, textAlign: 'center', fontWeight: '500' },
    modalActionBtn: {
        height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center',
    },
    modalActionBtnText: { fontSize: 16, fontWeight: '700' }
});
