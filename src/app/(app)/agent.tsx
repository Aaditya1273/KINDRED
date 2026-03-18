/**
 * KINDRED Agent Screen — AI Chat Control Center
 * Primary interaction = chat. Logs hidden behind "View Details".
 */
import React, { useState, useRef, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    FlatList,
    StyleSheet,
    type ScrollView as RNScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Text, View, ScrollView, Pressable, TextInput } from '@/components/ui';
import { Card } from '@/components/ui/card';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { useAccount } from '@reown/appkit-react-native';
import { Send, ChevronDown, ChevronUp, Brain } from 'lucide-react-native';
import { Colors, Spacing, Radius, Motion } from '@/theme/tokens';
import * as Haptics from 'expo-haptics';

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

const AGENT_RESPONSES: Record<string, string> = {
    'What are you doing?': 'Currently monitoring 3 yield strategies. Delta-neutral USDC/FLOW is active at 18.4% APY. I\'ll rebalance if slippage exceeds 0.5%.',
    'Show my yield': 'Your combined active APY is 26.6%. Delta-Neutral (18.4%) and Scheduled Savings (8.2%) are running. Confidential Alpha is paused pending FHE verification.',
    'Run a cycle': 'Initiating agent cycle now. I\'ll evaluate APR thresholds, check slippage, and sign any qualifying transactions via Lit Protocol PKP.',
    'Is my data private?': 'Yes. Your financial data is processed using Zama FHE — it\'s analyzed while still encrypted. I never see your raw balances or spending history.',
};

function AgentBubble({ text }: { text: string }) {
    return (
        <Animated.View entering={FadeInDown.duration(250)} style={styles.agentBubble}>
            <View style={styles.agentAvatar}>
                <Brain size={12} color={Colors.cyan} />
            </View>
            <View style={styles.agentBubbleInner}>
                <Text style={styles.bubbleText}>{text}</Text>
            </View>
        </Animated.View>
    );
}

function UserBubble({ text }: { text: string }) {
    return (
        <Animated.View entering={FadeInUp.duration(200)} style={styles.userBubble}>
            <View style={styles.userBubbleInner}>
                <Text style={styles.userBubbleText}>{text}</Text>
            </View>
        </Animated.View>
    );
}

export default function AgentScreen() {
    const insets = useSafeAreaInsets();
    const { address } = useAccount();
    const logs = useAgentStore.use.logs();
    const agentStatus = useAgentStore.use.status();
    const runCycle = useAgentStore.use.runCycle();
    const loadMemory = useAgentStore.use.loadMemory();
    const latestCID = useAgentStore.use.latestCID();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '0',
            role: 'agent',
            text: 'Hello. I\'m your KINDRED agent. I\'m monitoring your portfolio and executing yield strategies autonomously. Ask me anything.',
            timestamp: Date.now(),
        },
    ]);
    const [input, setInput] = useState('');
    const [showLogs, setShowLogs] = useState(false);
    const scrollRef = useRef<RNScrollView>(null);

    useEffect(() => { loadMemory(); }, []);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate agent response
        setTimeout(async () => {
            let response = AGENT_RESPONSES[text] ?? `Processing: "${text}". I'll analyze this and update my strategy accordingly.`;

            if (text === 'Run a cycle' && address) {
                await runCycle(address);
                response = 'Cycle complete. Check the execution logs below for details on what was signed and submitted.';
            }

            const agentMsg: Message = { id: (Date.now() + 1).toString(), role: 'agent', text: response, timestamp: Date.now() };
            setMessages(prev => [...prev, agentMsg]);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        }, 600);

        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    };

    return (
        <KeyboardAvoidingView
            style={[styles.root, { paddingTop: insets.top }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.agentStatusDot} />
                    <Text style={styles.headerTitle}>KINDRED Agent</Text>
                </View>
                <Pressable
                    onPress={() => setShowLogs(v => !v)}
                    style={styles.logsToggle}
                >
                    <Text style={styles.logsToggleText}>Logs</Text>
                    {showLogs ? <ChevronUp size={14} color={Colors.textSecondary} /> : <ChevronDown size={14} color={Colors.textSecondary} />}
                </Pressable>
            </View>

            {/* Execution Logs (hidden by default) */}
            {showLogs && (
                <Animated.View entering={FadeInDown.duration(250)} style={styles.logsPanel}>
                    <Card style={styles.logsCard}>
                        <Text style={styles.logsTitle}>Execution Logs</Text>
                        {logs.length === 0 ? (
                            <Text style={styles.emptyText}>No logs yet. Run a cycle.</Text>
                        ) : (
                            logs.slice(0, 5).map(log => (
                                <View key={log.id} style={styles.logRow}>
                                    <View style={[styles.logDot, { backgroundColor: log.color }]} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.logTitle}>{log.title}</Text>
                                        <Text style={styles.logDetail} numberOfLines={2}>{log.detail}</Text>
                                    </View>
                                    <Text style={[styles.logStatus, { color: log.color }]}>{log.status}</Text>
                                </View>
                            ))
                        )}
                        {latestCID !== '' && (
                            <Text style={styles.cidText} numberOfLines={1}>CID: {latestCID}</Text>
                        )}
                    </Card>
                </Animated.View>
            )}

            {/* Chat Messages */}
            <ScrollView
                ref={scrollRef}
                style={styles.messages}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            >
                {messages.map(msg =>
                    msg.role === 'agent'
                        ? <AgentBubble key={msg.id} text={msg.text} />
                        : <UserBubble key={msg.id} text={msg.text} />
                )}
                {agentStatus === 'running' && (
                    <Animated.View entering={FadeInDown.duration(200)} style={styles.agentBubble}>
                        <View style={styles.agentAvatar}>
                            <Brain size={12} color={Colors.cyan} />
                        </View>
                        <View style={styles.agentBubbleInner}>
                            <Text style={[styles.bubbleText, { color: Colors.textMuted }]}>Thinking...</Text>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>

            {/* Quick Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chips}
                contentContainerStyle={styles.chipsContent}
            >
                {QUICK_CHIPS.map(chip => (
                    <Pressable
                        key={chip}
                        style={styles.chip}
                        onPress={() => sendMessage(chip)}
                    >
                        <Text style={styles.chipText}>{chip}</Text>
                    </Pressable>
                ))}
            </ScrollView>

            {/* Input */}
            <View style={[styles.inputRow, { paddingBottom: insets.bottom + Spacing.sm }]}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Ask your agent..."
                    placeholderTextColor={Colors.textMuted}
                    returnKeyType="send"
                    onSubmitEditing={() => sendMessage(input)}
                    multiline={false}
                />
                <Pressable
                    style={[styles.sendBtn, { opacity: input.trim() ? 1 : 0.4 }]}
                    onPress={() => sendMessage(input)}
                    disabled={!input.trim()}
                >
                    <Send size={18} color={Colors.bg} />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.bg },

    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
        borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    agentStatusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.emerald },
    headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
    logsToggle: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: Radius.full, backgroundColor: Colors.surface },
    logsToggleText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },

    logsPanel: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm },
    logsCard: { padding: Spacing.md },
    logsTitle: { fontSize: 11, color: Colors.textSecondary, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.sm },
    logRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.border },
    logDot: { width: 6, height: 6, borderRadius: 3, marginTop: 4 },
    logTitle: { fontSize: 12, color: Colors.textPrimary, fontWeight: '600' },
    logDetail: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, lineHeight: 15 },
    logStatus: { fontSize: 10, fontWeight: '700' },
    cidText: { fontSize: 10, color: Colors.textMuted, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginTop: Spacing.sm },
    emptyText: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', paddingVertical: Spacing.sm },

    messages: { flex: 1 },
    messagesContent: { padding: Spacing.md, gap: Spacing.sm },

    agentBubble: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, maxWidth: '85%' },
    agentAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.cyan + '22', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
    agentBubbleInner: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, borderTopLeftRadius: 4, padding: Spacing.md, flex: 1 },
    bubbleText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },

    userBubble: { alignSelf: 'flex-end', maxWidth: '80%' },
    userBubbleInner: { backgroundColor: Colors.cyan + '18', borderWidth: 1, borderColor: Colors.cyan + '33', borderRadius: Radius.lg, borderBottomRightRadius: 4, padding: Spacing.md },
    userBubbleText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },

    chips: { maxHeight: 44, borderTopWidth: 1, borderTopColor: Colors.border },
    chipsContent: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.sm },
    chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
    chipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },

    inputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.border },
    input: { flex: 1, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: 12, fontSize: 14, color: Colors.textPrimary },
    sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.cyan, alignItems: 'center', justifyContent: 'center' },
});
