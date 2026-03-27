import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { HelpCircle, ChevronRight, MessageSquare, Zap, Shield, PieChart } from 'lucide-react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

const FAQ_DATA = [
    {
        icon: Zap,
        question: 'What is a KINDRED Agent?',
        answer: 'A KINDRED Agent is an AI-powered entity that automates yield generation and portfolio rebalancing based on your risk profile.'
    },
    {
        icon: Shield,
        question: 'Are my assets secure?',
        answer: 'Yes. KINDRED is non-custodial. Your assets remain on-chain, and the agent only has permission to execute authorized strategies.'
    },
    {
        icon: PieChart,
        question: 'How is yield calculated?',
        answer: 'Yield is calculated based on current market rates from integrated protocols like Aave, Uniswap, and Lido, optimized by our AI agents.'
    },
    {
        icon: MessageSquare,
        question: 'How do I talk to my agent?',
        answer: 'Navigate to the "Agent" tab (Spark icon) to interact with KINDRED directly using natural language.'
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
            style={[styles.faqCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
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

                <View style={[styles.supportCard, { backgroundColor: theme.primary + '08', borderColor: theme.primary + '20' }]}>
                    <Text style={[styles.supportTitle, { color: theme.primary }]}>Still have questions?</Text>
                    <Text style={[styles.supportText, { color: theme.textSecondary }]}>
                        Our team is available 24/7 to help you optimize your agent.
                    </Text>
                    <Pressable style={[styles.supportBtn, { backgroundColor: theme.primary }]}>
                        <Text style={styles.supportBtnText}>Contact Support</Text>
                    </Pressable>
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

    supportCard: { marginTop: 40, padding: 24, borderRadius: 28, borderWidth: 1, alignItems: 'center', gap: 12 },
    supportTitle: { fontSize: 20, fontWeight: '800' },
    supportText: { fontSize: 14, textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
    supportBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16, marginTop: 8 },
    supportBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' }
});
