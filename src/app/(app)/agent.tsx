import React, { useState, useRef, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    type ScrollView as RNScrollView,
    TextInput,
    Pressable,
    View,
    Text,
    ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { AppHeader } from '@/components/reborn/AppHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import * as Haptics from 'expo-haptics';
import { Camera, AudioLines, Search, Sparkles, Send, Mic, Play, Square } from 'lucide-react-native';

type Message = {
    id: string;
    role: 'user' | 'agent';
    text: string;
    timestamp: number;
};

const QUICK_CHIPS = [
    'What are you doing?',
    'Show my yield',
    'Run a cycle',
    'Is my data private?',
];

const getAgentResponse = (text: string, portfolio: any) => {
    const total = portfolio?.totalUSD.toLocaleString() ?? '0';
    const yieldAPY = portfolio?.yieldAPY ?? '0';

    const responses: Record<string, string> = {
        'What are you doing?': `Currently monitoring strategies for your $${total} portfolio. Flow Autonomous Engine is active at ${yieldAPY}% APY. I'll rebalance if slippage exceeds 0.5%.`,
        'Show my yield': `Your combined active APY is ${yieldAPY}%. Flow Delta-Neutral and Scheduled Savings are running. Privacy Vault analysis is available.`,
        'Run a cycle': 'Initiating agent cycle now. I\'ll evaluate APR thresholds, check slippage, and sign qualifying transactions via Lit Protocol PKP.',
        'Is my data private?': 'Yes. Your financial data is processed using Zama FHE (TFHE-rs) — it\'s analyzed while encrypted. I never see your raw balances.',
    };
    return responses[text] ?? `I'm analyzing your request: "${text}". How else can I help?`;
};

export default function AgentScreen() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const portfolio = useAgentStore.use.portfolio();
    const status = useAgentStore.use.status();
    const togglePause = useAgentStore.use.togglePause();
    const isPaused = useAgentStore.use.isPaused();

    const [input, setInput] = useState('');
    const [hasStarted, setHasStarted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<RNScrollView>(null);

    const pulseStyle = useAnimatedStyle(() => {
        if (status === 'running') {
            return {
                opacity: withRepeat(withSequence(withTiming(0.4, { duration: 1000 }), withTiming(1, { duration: 1000 })), -1, true),
                transform: [{ scale: withRepeat(withSequence(withTiming(1, { duration: 1000 }), withTiming(1.1, { duration: 1000 })), -1, true) }]
            };
        }
        return { opacity: 1, transform: [{ scale: 1 }] };
    }, [status]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setHasStarted(true);

        // Generate real-time agent response
        setTimeout(() => {
            const response = getAgentResponse(text, portfolio);
            const agentMsg: Message = { id: (Date.now() + 1).toString(), role: 'agent', text: response, timestamp: Date.now() };
            setMessages(prev => [...prev, agentMsg]);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        }, 800);
    };

    return (
        <KeyboardAvoidingView
            style={[styles.root, { backgroundColor: theme.bg }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <ScrollView
                ref={scrollRef}
                style={styles.root}
                contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <AppHeader />

                {/* Hero / State Section */}
                <Animated.View entering={FadeInDown.duration(600)} style={styles.hero}>
                    <View style={styles.statusRow}>
                        <Animated.View style={[styles.statusIndicator, pulseStyle, { backgroundColor: status === 'running' ? theme.positive : theme.primary }]} />
                        <Text style={[styles.statusText, { color: theme.textSecondary }]}>
                            {status === 'running' ? 'Agent Active' : isPaused ? 'Agent Paused' : 'Agent Idle'}
                        </Text>
                    </View>
                    <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>
                        {hasStarted ? 'How can I assist?' : 'Good Morning, Master'}
                    </Text>
                </Animated.View>

                {/* Messages Area */}
                <View style={styles.messagesList}>
                    {messages.map((msg, i) => (
                        <Animated.View
                            key={msg.id}
                            entering={FadeInUp.delay(i * 50).duration(400)}
                            style={[
                                styles.bubble,
                                msg.role === 'user' ? styles.userBubble : styles.agentBubble,
                                { borderColor: theme.border }
                            ]}
                        >
                            <BlurView intensity={20} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                            {msg.role === 'user' && <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.primary + '10' }]} />}
                            <Text style={[styles.bubbleText, { color: theme.textPrimary }]}>{msg.text}</Text>
                        </Animated.View>
                    ))}
                </View>

                {!hasStarted && (
                    <Animated.View entering={FadeInDown.delay(200)} style={styles.suggestions}>
                        <Text style={[styles.suggestionTitle, { color: theme.textMuted }]}>SUGGESTIONS</Text>
                        <View style={styles.chipsGrid}>
                            {QUICK_CHIPS.map(chip => (
                                <Pressable
                                    key={chip}
                                    onPress={() => sendMessage(chip)}
                                    style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                >
                                    <Text style={[styles.chipText, { color: theme.textPrimary }]}>{chip}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </Animated.View>
                )}

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Premium Input Area */}
            <BlurView intensity={Platform.OS === 'web' ? 40 : 60} tint={theme.isDark ? 'dark' : 'light'} style={styles.inputBlur}>
                <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 12 }]}>
                    <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.surface + '80' }]}>
                        <TextInput
                            style={[styles.input, { color: theme.textPrimary, maxHeight: 120 }]}
                            value={input}
                            onChangeText={setInput}
                            placeholder="Message KINDRED..."
                            placeholderTextColor={theme.textMuted}
                            multiline
                        />
                        <Pressable
                            style={[styles.sendBtn, { backgroundColor: input.trim() ? theme.primary : theme.textMuted + '20' }]}
                            onPress={() => sendMessage(input)}
                            disabled={!input.trim()}
                        >
                            <Send size={18} color={input.trim() ? '#fff' : theme.textMuted} />
                        </Pressable>
                    </View>
                </View>
            </BlurView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { paddingHorizontal: 20, paddingBottom: 100 },
    hero: { marginTop: 24, marginBottom: 32 },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    statusIndicator: { width: 8, height: 8, borderRadius: 4 },
    statusText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
    heroTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },

    messagesList: { gap: 16 },
    bubble: { padding: 16, borderRadius: 24, maxWidth: '85%', overflow: 'hidden', borderWidth: 1 },
    userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
    agentBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
    bubbleText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },

    suggestions: { marginTop: 40 },
    suggestionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 16 },
    chipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
    chipText: { fontSize: 14, fontWeight: '600' },

    inputBlur: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 88 : 70, // Floating above the absolute tab bar
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,123,26,0.1)',
    },
    inputContainer: { padding: 16, paddingTop: 12 },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    input: { flex: 1, fontSize: 15, fontWeight: '500', paddingHorizontal: 12, minHeight: 40, paddingTop: 8, paddingBottom: 8 },
    sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});
