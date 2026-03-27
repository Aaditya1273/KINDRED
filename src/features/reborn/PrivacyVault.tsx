import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { Lock, EyeOff, ShieldCheck, Database, Zap, ChevronRight, Fingerprint, Activity } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Card } from '@/components/ui/card';

const INSIGHTS = [
    { text: "You overspend on subscriptions (₹1,200/month)", detail: "Detected 4 active auto-renewals." },
    { text: "Unusual utility spike detected", detail: "Electricity bill +40% vs last month average." },
    { text: "Savings potential: ₹5,000", detail: "Unused balance in low-yield account." }
];

export default function PrivacyVault() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();

    return (
        <ScrollView
            style={[styles.root, { backgroundColor: theme.bg, paddingTop: insets.top }]}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
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
                <Animated.View key={idx} entering={FadeInRight.delay(idx * 100).duration(400)}>
                    <Card style={[styles.insightCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.insightHeader}>
                            <EyeOff size={18} color={theme.primary} />
                            <Text style={[styles.insightText, { color: theme.textPrimary }]}>{item.text}</Text>
                        </View>
                        <Text style={[styles.insightDetail, { color: theme.textMuted }]}>
                            {item.detail} (Actual data remains encrypted)
                        </Text>
                    </Card>
                </Animated.View>
            ))}

            {/* Data Sovereignty Status */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Data Sovereignty</Text>
            </View>
            <Card style={[styles.sovCard, { backgroundColor: theme.isDark ? '#111' : '#F9F9F9' }]}>
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
            </Card>

            {/* Control Section */}
            <Pressable style={[styles.controlBtn, { backgroundColor: theme.primary }]}>
                <ShieldCheck size={20} color="#FFF" />
                <Text style={styles.controlBtnText}>Revoke Data Permissions</Text>
            </Pressable>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const VaultItem = ({ icon: Icon, label, status, color, isLast }: any) => {
    const theme = useAppTheme();
    return (
        <View style={[styles.vaultItem, !isLast && { borderBottomColor: theme.border, borderBottomWidth: 1 }]}>
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
    content: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.xl, marginBottom: 8 },
    title: { fontSize: 26, fontWeight: '900' },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
    subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 32 },

    sectionHeader: { marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '800' },

    insightCard: { padding: 16, borderRadius: 24, marginBottom: 12, borderWidth: 1 },
    insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    insightText: { fontSize: 14, fontWeight: '700', flex: 1 },
    insightDetail: { fontSize: 13, lineHeight: 18, paddingLeft: 28 },

    sovCard: { padding: 0, borderRadius: 28, borderWidth: 1, overflow: 'hidden', marginTop: 8, marginBottom: 32 },
    vaultItem: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    vaultLabel: { fontSize: 15, fontWeight: '700' },
    vaultStatus: { fontSize: 12, marginTop: 2 },

    controlBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18, borderRadius: 20 },
    controlBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' }
});
