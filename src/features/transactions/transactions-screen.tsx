import React, { useEffect } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text } from '@/components/ui';
import { GlassView } from '@/components/ui/glass-view';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { useAccount } from '@reown/appkit-react-native';
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Zap, Brain, Clock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { Transaction } from '@/lib/agent/transactions';

const TX_ICONS: Record<Transaction['type'], React.ReactNode> = {
    DEPOSIT: <ArrowDownLeft size={16} color="#00FF88" />,
    WITHDRAW: <ArrowUpRight size={16} color="#FF4444" />,
    SWAP: <RefreshCw size={16} color="#FFD700" />,
    YIELD: <Zap size={16} color="#00F5FF" />,
    AGENT: <Brain size={16} color="#9E00FF" />,
};

const TX_COLORS: Record<Transaction['type'], string> = {
    DEPOSIT: '#00FF88',
    WITHDRAW: '#FF4444',
    SWAP: '#FFD700',
    YIELD: '#00F5FF',
    AGENT: '#9E00FF',
};

function formatTime(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function TransactionsScreen() {
    const { address } = useAccount();
    const transactions = useAgentStore.use.transactions();
    const refreshTransactions = useAgentStore.use.refreshTransactions();
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        if (address) refreshTransactions(address);
    }, [address]);

    const onRefresh = async () => {
        if (!address) return;
        setRefreshing(true);
        await refreshTransactions(address);
        setRefreshing(false);
    };

    return (
        <ScrollView
            className="flex-1 bg-black px-4"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00F5FF" />}
        >
            <View className="mt-12 mb-4">
                <Text className="text-2xl font-bold text-white">History</Text>
                <Text className="text-gray-400 text-sm mt-1">On-chain activity • Flow EVM</Text>
            </View>

            {transactions.length === 0 && (
                <GlassView borderRadius={20} className="p-8 items-center mt-8">
                    <Clock size={40} color="#374151" />
                    <Text className="text-gray-600 text-center mt-4">
                        Connect wallet to see transaction history.
                    </Text>
                </GlassView>
            )}

            {transactions.map((tx, i) => (
                <Animated.View key={tx.hash} entering={FadeInDown.delay(i * 40).duration(350)}>
                    <GlassView borderRadius={18} className="p-4 mb-3 flex-row items-center">
                        {/* Icon */}
                        <View
                            className="w-10 h-10 rounded-2xl items-center justify-center mr-3"
                            style={{ backgroundColor: TX_COLORS[tx.type] + '18' }}
                        >
                            {TX_ICONS[tx.type]}
                        </View>

                        {/* Details */}
                        <View className="flex-1">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-white font-semibold">{tx.type}</Text>
                                <Text className="text-white font-bold">
                                    {tx.type === 'WITHDRAW' ? '-' : '+'}{tx.amount} {tx.asset}
                                </Text>
                            </View>
                            <View className="flex-row items-center justify-between mt-1">
                                <Text className="text-gray-500 text-xs">{formatTime(tx.timestamp)}</Text>
                                <View className="flex-row items-center">
                                    <View
                                        className="w-1.5 h-1.5 rounded-full mr-1"
                                        style={{ backgroundColor: tx.status === 'confirmed' ? '#00FF88' : tx.status === 'pending' ? '#FFD700' : '#FF4444' }}
                                    />
                                    <Text className="text-gray-500 text-xs capitalize">{tx.status}</Text>
                                </View>
                            </View>
                            <Text className="text-gray-600 text-[10px] font-mono mt-1" numberOfLines={1}>
                                {tx.hash.slice(0, 20)}...
                            </Text>
                        </View>
                    </GlassView>
                </Animated.View>
            ))}
            <View className="h-20" />
        </ScrollView>
    );
}
