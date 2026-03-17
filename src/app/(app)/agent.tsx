import React, { useEffect } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui';
import { GlassView } from '@/components/ui/glass-view';
import { InteractiveButton } from '@/components/ui/interactive-button';
import { Brain, Terminal, ShieldCheck, Play, Database, Zap } from 'lucide-react-native';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { useAccount } from '@reown/appkit-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const TYPE_ICON: Record<string, React.ReactNode> = {
    DEPOSIT: <Terminal size={16} color="#00F5FF" />,
    WITHDRAW: <Terminal size={16} color="#FF4444" />,
    REBALANCE: <Zap size={16} color="#FFD700" />,
    HEDGE: <ShieldCheck size={16} color="#9E00FF" />,
    AGENT: <Brain size={16} color="#00FF88" />,
};

function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    if (diff < 60_000) return 'Just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return `${Math.floor(diff / 86_400_000)}d ago`;
}

export default function AgentScreen() {
    const { address } = useAccount();
    const logs = useAgentStore.use.logs();
    const status = useAgentStore.use.status();
    const latestCID = useAgentStore.use.latestCID();
    const lastRun = useAgentStore.use.lastRun();
    const loadMemory = useAgentStore.use.loadMemory();
    const runCycle = useAgentStore.use.runCycle();
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        loadMemory();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        loadMemory();
        setRefreshing(false);
    };

    const handleRunCycle = async () => {
        if (!address) return;
        await runCycle(address);
    };

    return (
        <ScrollView
            className="flex-1 bg-black p-4"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00F5FF" />}
        >
            <View className="mt-12">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                    <View className="flex-row items-center">
                        <Brain size={28} color="#00F5FF" />
                        <View className="ml-3">
                            <Text className="text-2xl font-bold text-white">Agent Brain</Text>
                            <Text className="text-gray-400 text-xs">Lit Protocol • PKP Signing</Text>
                        </View>
                    </View>
                    <InteractiveButton
                        className="bg-primary-500/20 border border-primary-500/40 px-4 py-2 rounded-2xl flex-row items-center"
                        onPress={handleRunCycle}
                        disabled={status === 'running' || !address}
                    >
                        <Play size={14} color="#00F5FF" />
                        <Text className="text-primary-400 text-xs font-bold ml-1">
                            {status === 'running' ? 'Running...' : 'Run Cycle'}
                        </Text>
                    </InteractiveButton>
                </View>

                {/* Status Banner */}
                <GlassView borderRadius={16} className="p-4 mb-6 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className={`w-2 h-2 rounded-full mr-2 ${status === 'running' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                        <Text className="text-white text-sm font-medium">
                            {status === 'running' ? 'Cycle Executing...' : 'Self-Correction Mode Active'}
                        </Text>
                    </View>
                    {lastRun && (
                        <Text className="text-gray-500 text-xs">{timeAgo(lastRun)}</Text>
                    )}
                </GlassView>

                {/* Storacha CID */}
                {latestCID !== '' && (
                    <GlassView borderRadius={16} className="p-4 mb-6 flex-row items-center">
                        <Database size={16} color="#9E00FF" />
                        <View className="ml-3 flex-1">
                            <Text className="text-gray-400 text-xs uppercase tracking-wider">Storacha Memory CID</Text>
                            <Text className="text-secondary-400 text-xs font-mono mt-1" numberOfLines={1}>
                                {latestCID}
                            </Text>
                        </View>
                    </GlassView>
                )}

                {/* Execution Logs */}
                <Text className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-3">
                    Execution Logs ({logs.length})
                </Text>

                {logs.length === 0 && (
                    <GlassView borderRadius={20} className="p-8 items-center">
                        <Brain size={40} color="#374151" />
                        <Text className="text-gray-600 text-center mt-4">
                            No logs yet. Connect wallet and run a cycle.
                        </Text>
                    </GlassView>
                )}

                {logs.map((log, i) => (
                    <Animated.View key={log.id} entering={FadeInDown.delay(i * 60).duration(400)}>
                        <GlassView borderRadius={20} className="p-4 mb-3">
                            <View className="flex-row justify-between items-start">
                                <View className="flex-row items-center flex-1 mr-2">
                                    <View className="mr-3">
                                        {TYPE_ICON[log.title.split(' — ')[0]] ?? <Terminal size={16} color="#00F5FF" />}
                                    </View>
                                    <Text className="text-white font-medium flex-1" numberOfLines={1}>{log.title}</Text>
                                </View>
                                <Text className="text-gray-500 text-[10px]">{timeAgo(log.timestamp)}</Text>
                            </View>
                            <Text className="text-gray-400 text-xs mt-2 ml-7 leading-4">{log.detail}</Text>
                            <View className="mt-3 ml-7 flex-row items-center">
                                <View className="h-1 flex-1 bg-gray-800 rounded-full mr-3">
                                    <View
                                        className="h-1 rounded-full"
                                        style={{
                                            width: log.status === 'COMPLETED' ? '100%' : log.status === 'EXECUTING' ? '65%' : '30%',
                                            backgroundColor: log.color,
                                        }}
                                    />
                                </View>
                                <Text className="text-[10px] font-bold" style={{ color: log.color }}>
                                    {log.status}
                                </Text>
                            </View>
                        </GlassView>
                    </Animated.View>
                ))}

                {/* Agent Manifest note */}
                <GlassView borderRadius={16} className="mt-4 p-4 border-primary-500/20">
                    <Text className="text-gray-500 text-xs text-center">
                        Agent decisions are signed via Lit Protocol PKP and logged to Storacha/Filecoin.
                        Flow vault executes only when conditions are cryptographically verified.
                    </Text>
                </GlassView>
            </View>
            <View className="h-20" />
        </ScrollView>
    );
}
