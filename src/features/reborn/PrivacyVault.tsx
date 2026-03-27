import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { AppHeader } from '@/components/reborn/AppHeader';
import { Lock, EyeOff, ShieldCheck, Database, Zap, ChevronRight, Fingerprint, Activity } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const INSIGHTS = [
    { text: "You overspend on subscriptions (₹1,200/month)", detail: "Detected 4 active auto-renewals." },
    { text: "Unusual utility spike detected", detail: "Electricity bill +40% vs last month average." },
    { text: "Savings potential: ₹5,000", detail: "Unused balance in low-yield account." }
];

export default function PrivacyVault() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();

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
                    KINDRED processes your most sensitive data while it's encrypted. I provide insights without ever seeing the raw numbers.
                </Text>

                {/* Blind AI Insights */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Blind AI Insights</Text>
                </View>
                {INSIGHTS.map((item, idx) => (
                    <Animated.View
                        key={idx}
                        entering={FadeInRight.delay(idx * 100).duration(400)}
                        style={[styles.insightCard, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                    >
                        <BlurView intensity={Platform.OS === 'web' ? 10 : 15} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                        <View style={styles.insightInner}>
                            <View style={styles.insightHeader}>
                                <EyeOff size={18} color={theme.primary} />
                                <Text style={[styles.insightText, { color: theme.textPrimary }]}>{item.text}</Text>
                            </View>
                            <Text style={[styles.insightDetail, { color: theme.textMuted }]}>
                                {item.detail} (Actual data remains encrypted)
                            </Text>
                        </View>
                    </Animated.View>
                ))}

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
                            icon={Activity}
                            label="Spending History"
                            status="Processing in FHE"
                            color={theme.primary}
                        />
                        <VaultItem
                            icon={Fingerprint}
                            label="Identity Verification"
                            status="World ID Verified"
                            color={theme.positive}
                            isLast
                        />
                    </View>
                </Animated.View>

                {/* Control Section */}
                <Pressable style={[styles.controlBtn, { backgroundColor: theme.primary }]}>
                    <ShieldCheck size={20} color="#FFF" />
                    <Text style={styles.controlBtnText}>Revoke Data Permissions</Text>
                </Pressable>

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const VaultItem = ({ icon: Icon, label, status, color, isLast }: any) => {
    const theme = useAppTheme();
    return (
        <View style={[styles.vaultItem, !isLast && { borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderBottomWidth: 1 }]}>
            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                <Icon size={18} color={color} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.vaultLabel, { color: theme.textPrimary }]}>{label}</Text>
                <Text style={[styles.vaultStatus, { color: theme.textSecondary }]}>{status}</Text>
            </View>
            <ChevronRight size={16} color={theme.textMuted} />
        </View>
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
    sectionTitle: { fontSize: 18, fontWeight: '800' },

    insightCard: { borderRadius: 24, marginBottom: 12, borderWidth: 1, overflow: 'hidden' },
    insightInner: { padding: 16 },
    insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    insightText: { fontSize: 14, fontWeight: '700', flex: 1 },
    insightDetail: { fontSize: 13, lineHeight: 18, paddingLeft: 28 },

    sovCard: { borderRadius: 28, borderWidth: 1, overflow: 'hidden', marginBottom: 32 },
    sovInner: { padding: 0 },
    vaultItem: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    vaultLabel: { fontSize: 15, fontWeight: '700' },
    vaultStatus: { fontSize: 12, marginTop: 2 },

    controlBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18, borderRadius: 20, marginTop: 10 },
    controlBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' }
});
