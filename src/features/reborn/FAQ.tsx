import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { format } from 'date-fns';
import { AppHeader } from '@/components/reborn/AppHeader';
import { HelpCircle, ChevronRight, MessageSquare, Search, BookOpen, ShieldCheck, CheckCircle } from 'lucide-react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

const FAQ_DATA = [
    {
        icon: Search,
        question: 'What is a KINDRED Agent?',
        answer: 'KINDRED (Kinetic Intelligence & Networked Decentralized REal-time Data) is the world’s first Autonomous Personal Hedge Fund and Data Sovereign. It manages your digital and financial life while you sleep.'
    },
    {
        icon: BookOpen,
        question: 'How does the Blind Wealth Manager work?',
        answer: 'KINDRED uses FHE (Fully Homomorphic Encryption) to analyze your private spending habits and bank statements to give you Alpha/DeFi advice without ever seeing your actual data.'
    },
    {
        icon: ShieldCheck,
        question: 'Are my assets secure?',
        answer: 'KINDRED is non-custodial and uses Lit Protocol for Programmable Signing. The agent trades on your behalf only when specific market conditions that you authorize are met.'
    },
    {
        icon: HelpCircle,
        question: 'What is the World ID tether?',
        answer: 'To prevent bot-farming, every KINDRED agent is tethered to a World ID. One human, one elite financial agent.'
    },
    {
        icon: MessageSquare,
        question: 'What is Smart Cash?',
        answer: 'Smart Cash refers to automated yield loops and scheduled savings on Flow, managed autonomously by your agent to beat market inflation.'
    }
];

const FAQItem = ({ item, index }: any) => {
    const theme = useAppTheme();
    const [expanded, setExpanded] = React.useState(false);
    const Icon = item.icon;

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 100).duration(500)}
            layout={Layout.springify()}
            style={[styles.faqCard, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}
        >
            <BlurView intensity={Platform.OS === 'web' ? 10 : 15} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
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
    const logs = useAgentStore.use.logs();

    const displayLogs = logs.length > 0 ? logs.slice(0, 5).map(log => ({
        timestamp: format(log.timestamp, 'yyyy-MM-dd HH:mm:ss'),
        action: log.action.toUpperCase(),
        reasoning: log.message,
        status: log.status
    })) : [
        {
            timestamp: 'System Ready',
            action: 'INITIALIZATION',
            reasoning: 'Agent standing by for autonomous Flow/Zama cycles. No actions taken yet.',
            status: 'Idle'
        }
    ];

    return (
        <ScrollView
            style={[styles.root, { backgroundColor: theme.bg }]}
            contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md }]}
            showsVerticalScrollIndicator={false}
        >
            <AppHeader />

            <View style={styles.header}>
                <Animated.Text entering={FadeInDown.duration(400)} style={[styles.title, { color: theme.textPrimary }]}>FAQ</Animated.Text>
                <Animated.Text entering={FadeInDown.delay(50).duration(400)} style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Everything you need to know about your KINDRED Agent.
                </Animated.Text>
            </View>

            <View style={styles.list}>
                {FAQ_DATA.map((item, idx) => (
                    <FAQItem key={idx} item={item} index={idx} />
                ))}
            </View>

            <Animated.View entering={FadeInDown.delay(400).duration(500)} style={[styles.logSection, { marginTop: 40 }]}>
                <Text style={[styles.sectionTitleHeader, { color: theme.textPrimary }]}>Agent Verification Logs</Text>
                <View style={[styles.logCard, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                    <BlurView intensity={20} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    <View style={styles.logInner}>
                        {displayLogs.map((log, idx) => (
                            <View key={idx} style={[styles.logRow, { borderLeftColor: log.status === 'Success' ? theme.positive : theme.primary }]}>
                                <View style={styles.logHeader}>
                                    <Text style={[styles.logAction, { color: theme.textPrimary }]}>{log.action}</Text>
                                    <Text style={[styles.logTime, { color: theme.textMuted }]}>{log.timestamp}</Text>
                                </View>
                                <Text style={[styles.logReason, { color: theme.textSecondary }]}>{log.reasoning}</Text>
                                <View style={[styles.statusTag, { backgroundColor: (log.status === 'Success' || log.status === 'Verified') ? theme.positive + '15' : theme.primary + '15' }]}>
                                    <Text style={[styles.statusTagText, { color: (log.status === 'Success' || log.status === 'Verified') ? theme.positive : theme.primary }]}>{log.status}</Text>
                                </View>
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
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { padding: Spacing.xl },
    header: { marginBottom: 32 },
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
    logRow: { padding: 16, borderLeftWidth: 3, marginBottom: 12, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 12 },
    logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    logAction: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
    logTime: { fontSize: 11, fontWeight: '500' },
    logReason: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
    statusTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    statusTagText: { fontSize: 10, fontWeight: '800' }
});
