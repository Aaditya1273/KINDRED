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
import { BlurView } from 'expo-blur';
import { AppHeader } from '@/components/reborn/AppHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Text, View, ScrollView, Pressable, TextInput } from '@/components/ui';
import { Card } from '@/components/ui/card';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { useAccount } from '@reown/appkit-react-native';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import * as Haptics from 'expo-haptics';
import { Camera, AudioLines, Search, ShoppingBag } from 'lucide-react-native';

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

// Removed AgentBubble and UserBubble as part of the Home-style redesign

export default function AgentScreen() {
    const insets = useSafeAreaInsets();
    const { address } = useAccount();
    const theme = useAppTheme();
    const [input, setInput] = useState('');
    const [hasStarted, setHasStarted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<RNScrollView>(null);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setHasStarted(true);

        // Simulate agent response
        setTimeout(() => {
            const response = AGENT_RESPONSES[text] ?? `I'm analyzing your request: "${text}". How else can I help?`;
            const agentMsg: Message = { id: (Date.now() + 1).toString(), role: 'agent', text: response, timestamp: Date.now() };
            setMessages(prev => [...prev, agentMsg]);
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
        }, 1000);
    };

    const renderHeader = () => (
        <View style={[styles.headerHost, { marginTop: insets.top }]}>
            <View style={styles.headerProfile}>
                <View style={[styles.avatar, { backgroundColor: theme.surface }]}>
                    <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary + '20' }]} />
                </View>
                <View>
                    <Text style={[styles.greetingLabel, { color: theme.textSecondary }]}>Good Morning,</Text>
                    <Text style={[styles.userName, { color: theme.textPrimary }]}>KINDRED Master</Text>
                </View>
            </View>
            <Pressable style={[styles.headerAction, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <ShoppingBag size={20} color={theme.textPrimary} />
            </Pressable>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={[styles.root, { backgroundColor: theme.bg }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            {!hasStarted ? (
                <ScrollView
                    ref={scrollRef}
                    style={styles.root}
                    contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md }]}
                    showsVerticalScrollIndicator={false}
                >
                    <AppHeader />

                    <View style={styles.centeredContent}>
                        {/* Hero Section */}
                        <Animated.View entering={FadeInDown.duration(600)} style={styles.hero}>
                            <Text style={[styles.heroTitle, { color: theme.textPrimary }]}>Need anything?</Text>
                            <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
                                Our smart AI assistant helps you find exactly what you need — faster and easier than ever.
                            </Text>
                        </Animated.View>

                        {/* Centered Input */}
                        <View style={[styles.searchControl, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
                            <BlurView intensity={Platform.OS === 'web' ? 15 : 25} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                            <Pressable style={styles.searchIconBtn}>
                                <Camera size={20} color={theme.textSecondary} />
                            </Pressable>
                            <TextInput
                                style={[styles.searchInput, { color: theme.textPrimary }]}
                                value={input}
                                onChangeText={setInput}
                                placeholder="Ask Anything..."
                                placeholderTextColor={theme.textMuted}
                                onSubmitEditing={() => sendMessage(input)}
                            />
                            <Pressable style={[styles.voiceBtn, { backgroundColor: theme.primary }]} onPress={() => sendMessage(input)}>
                                <AudioLines size={20} color={theme.bg} />
                            </Pressable>
                        </View>

                        {/* Suggestions */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.chipsRow}
                            contentContainerStyle={styles.chipsContent}
                        >
                            {QUICK_CHIPS.map((chip) => (
                                <Pressable
                                    key={chip}
                                    style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                    onPress={() => sendMessage(chip)}
                                >
                                    <Search size={14} color={theme.textSecondary} style={{ marginRight: 6 }} />
                                    <Text style={[styles.chipText, { color: theme.textSecondary }]}>{chip}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            ) : (
                <View style={[styles.chatRoot, { backgroundColor: theme.bg }]}>
                    {/* Compact Header for Chat Mode */}
                    <View style={[styles.compactHeader, { paddingTop: insets.top + Spacing.sm, borderBottomColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                        <AppHeader />
                    </View>

                    <ScrollView
                        ref={scrollRef}
                        style={styles.messagesContainer}
                        contentContainerStyle={styles.messagesContent}
                        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.map((msg, i) => (
                            <Animated.View
                                key={msg.id}
                                entering={FadeInUp.delay(i * 100).duration(400)}
                                style={[
                                    styles.bubble,
                                    msg.role === 'user' ? styles.userBubble : styles.agentBubble,
                                    { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                                ]}
                            >
                                <BlurView intensity={Platform.OS === 'web' ? 10 : 15} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                                {msg.role === 'user' && <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.primary + '10' }]} />}
                                <Text style={[styles.bubbleText, { color: theme.textPrimary }]}>{msg.text}</Text>
                            </Animated.View>
                        ))}
                    </ScrollView>

                    {/* Bottom-pinned Input */}
                    <View style={[styles.bottomInputArea, { paddingBottom: insets.bottom + Spacing.md, borderTopColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                        <View style={[styles.searchControl, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', marginBottom: 0 }]}>
                            <BlurView intensity={Platform.OS === 'web' ? 20 : 30} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                            <Pressable style={styles.searchIconBtn}>
                                <Camera size={20} color={theme.textSecondary} />
                            </Pressable>
                            <TextInput
                                style={[styles.searchInput, { color: theme.textPrimary }]}
                                value={input}
                                onChangeText={setInput}
                                placeholder="Message Assistant..."
                                placeholderTextColor={theme.textMuted}
                                onSubmitEditing={() => sendMessage(input)}
                            />
                            <Pressable style={[styles.voiceBtn, { backgroundColor: theme.primary }]} onPress={() => sendMessage(input)}>
                                <AudioLines size={20} color={theme.bg} />
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    container: { flex: 1 },
    content: { flexGrow: 1, paddingHorizontal: Spacing.xl, paddingBottom: 100 },
    centeredContent: { flex: 1, justifyContent: 'center', marginBottom: 120 }, // Offset for the heavy header but still centered

    headerHost: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 80,
    },
    headerProfile: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
    avatarPlaceholder: { width: '100%', height: '100%' },
    greetingLabel: { fontSize: 13, fontWeight: '500' },
    userName: { fontSize: 18, fontWeight: '700' },
    headerAction: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },

    hero: { marginBottom: 40, paddingHorizontal: 4 },
    heroTitle: { fontSize: 48, fontWeight: '800', letterSpacing: -1.5, marginBottom: 16 },
    heroSubtitle: { fontSize: 16, lineHeight: 24, fontWeight: '500', opacity: 0.8 },

    searchControl: {
        flexDirection: 'row', alignItems: 'center',
        height: 60, borderRadius: 30, borderWidth: 1,
        paddingLeft: 10, paddingRight: 6,
        marginBottom: 24,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
            web: { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
        })
    },
    searchIconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    searchInput: { flex: 1, fontSize: 16, fontWeight: '600', paddingHorizontal: 8, height: '100%', paddingVertical: 0 },
    voiceBtn: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },

    chipsRow: { maxHeight: 40 },
    chipsContent: { gap: 8, paddingHorizontal: 4 },
    chip: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, height: 38,
        borderRadius: 19, borderWidth: 1
    },
    chipText: { fontSize: 13, fontWeight: '600' },

    // Chat Styles
    chatRoot: { flex: 1 },
    compactHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
    },
    compactHeaderTitle: { fontSize: 16, fontWeight: '700' },
    resetBtn: { padding: 8 },
    messagesContainer: { flex: 1 },
    messagesContent: { padding: Spacing.xl, gap: 16 },
    bubble: { padding: 16, borderRadius: 20, maxWidth: '85%' },
    userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
    agentBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
    bubbleText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
    bottomInputArea: { paddingHorizontal: Spacing.xl, borderTopWidth: 1, paddingTop: 12 },
});
