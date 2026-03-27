import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { HelpCircle, ChevronRight, MessageSquare, Zap, Shield, PieChart, Lock, Fingerprint, CheckCircle } from 'lucide-react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

const FAQ_DATA = [
    {
        icon: Zap,
        question: 'What is a KINDRED Agent?',
        answer: 'KINDRED (Kinetic Intelligence & Networked Decentralized REal-time Data) is the world’s first Autonomous Personal Hedge Fund and Data Sovereign. It manages your digital and financial life while you sleep.'
    },
    {
        icon: Lock,
        question: 'How does the Blind Wealth Manager work?',
        answer: 'KINDRED uses FHE (Fully Homomorphic Encryption) to analyze your private spending habits and bank statements to give you Alpha/DeFi advice without ever seeing your actual data.'
    },
    {
        icon: Shield,
        question: 'Are my assets secure?',
        answer: 'KINDRED is non-custodial and uses Lit Protocol for Programmable Signing. The agent trades on your behalf only when specific market conditions that you authorize are met.'
    },
    {
        icon: Fingerprint,
        question: 'What is the World ID tether?',
        answer: 'To prevent bot-farming, every KINDRED agent is tethered to a World ID. One human, one elite financial agent.'
    },
    {
        icon: Zap,
        question: 'What is Smart Cash?',
        answer: 'Smart Cash refers to automated yield loops and scheduled savings on Flow, managed autonomously by your agent to beat market inflation.'
    }
];

const REASONING_LOGS = [
    { action: 'Delta-Neutral Rebalance', reason: 'USDC/FLOW LP ratio drifted 3.2% from target. Rebalanced to protect capital.' },
    { action: 'Slippage Guard', reason: 'Attempted swap on Flow, but slippage was too high (>0.5%), so the task was rescheduled for a lower volatility window.' },
    { action: 'Optimized Savings', reason: 'Weekly auto-deposit of $200 USDC into Flow vault. Verified on-chain.' },
];

const FAQItem = ({ item, index }: any) => {
    const theme = useAppTheme();
    const [expanded, setExpanded] = React.useState(false);
    const Icon = item.icon;

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 100).duration(500)}
            layout={Layout.springify()}
            style={[styles.faqCard, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
        >
            <BlurView intensity={15} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            <Pressable onPress={() => setExpanded(!expanded)} style={styles.faqHeader}>
                <View style={[styles.iconBox, { backgroundColor: theme.primary + '15' }]}>
                    <Icon size={18} color={theme.primary} />
                </View>
                <Text style={[styles.question, { color: theme.textPrimary }]}>{item.question}</Text>
                <Animated.View style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}>
                    <ChevronRight size={18} color={theme.textMuted} />
                </Animated.View>
            </Pressable>
            {expanded && (
                <View style={styles.faqContent}>
                    <Text style={[styles.answer, { color: theme.textSecondary }]}>{item.answer}</Text>
                </View>
            )}
        </Animated.View>
    );
};

export default function RebornFAQ() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();

    return (
        <View style={[styles.root, { paddingTop: insets.top, backgroundColor: theme.bg }]}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.Text entering={FadeInDown.duration(400)} style={[styles.title, { color: theme.textPrimary }]}>FAQ</Animated.Text>
                <Animated.Text entering={FadeInDown.delay(50).duration(400)} style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Everything you need to know about your KINDRED Agent.
                </Animated.Text>

                <View style={styles.list}>
                    {FAQ_DATA.map((item, idx) => (
                        <FAQItem key={idx} item={item} index={idx} />
                    ))}
                </View>

                {/* Migrated Reasoning Logs */}
                <Animated.View entering={FadeInDown.delay(400).duration(500)} style={[styles.logSection, { marginTop: 40 }]}>
                    <Text style={[styles.sectionTitleHeader, { color: theme.textPrimary }]}>Agent Verification Logs</Text>
                    <View style={[styles.logCard, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                        <BlurView intensity={20} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                        <View style={styles.logInner}>
                            {REASONING_LOGS.map((log, i) => (
                                <View key={i} style={[styles.logItem, { borderBottomColor: i === REASONING_LOGS.length - 1 ? 'transparent' : 'rgba(0,0,0,0.05)' }]}>
                                    <View style={styles.logHeader}>
                                        <CheckCircle size={14} color={theme.positive} />
                                        <Text style={[styles.logAction, { color: theme.textPrimary }]}>{log.action}</Text>
                                    </View>
                                    <Text style={[styles.logReason, { color: theme.textSecondary }]}>{log.reason}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </Animated.View>

                <View style={[styles.supportCard, { borderColor: theme.primary + '30', overflow: 'hidden' }]}>
                    <BlurView intensity={20} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.primary + '03' }]} />
                    <View style={styles.supportInner}>
                        <Text style={[styles.supportTitle, { color: theme.primary }]}>Still have questions?</Text>
                        <Text style={[styles.supportText, { color: theme.textSecondary }]}>
                            Our team is available 24/7 to help you optimize your agent.
                        </Text>
                        <Pressable style={[styles.supportBtn, { backgroundColor: theme.primary }]}>
                            <Text style={styles.supportBtnText}>Contact Support</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { padding: Spacing.xl },
    title: { fontSize: 32, fontWeight: '900', letterSpacing: -1, marginBottom: 8 },
    subtitle: { fontSize: 16, fontWeight: '500', marginBottom: 32, lineHeight: 22 },
    list: { gap: 12 },
    faqCard: { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
    faqHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    question: { flex: 1, fontSize: 16, fontWeight: '700' },
    faqContent: { paddingHorizontal: 20, paddingBottom: 20, paddingLeft: 76 },
    answer: { fontSize: 14, lineHeight: 22, fontWeight: '500' },

    supportCard: { marginTop: 40, borderRadius: 28, borderWidth: 1, overflow: 'hidden' },
    supportInner: { padding: 24, alignItems: 'center', gap: 12 },
    supportTitle: { fontSize: 20, fontWeight: '800' },
    supportText: { fontSize: 14, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
    supportBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16, marginTop: 8 },
    supportBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

    logSection: { marginTop: 40 },
    sectionTitleHeader: { fontSize: 20, fontWeight: '800', marginBottom: 16 },
    logCard: { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
    logInner: { padding: 0 },
    logItem: { padding: 16, borderBottomWidth: 1 },
    logHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    logAction: { fontSize: 14, fontWeight: '700' },
    logReason: { fontSize: 13, lineHeight: 18 }
});
