import React, { useEffect } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Text } from '@/components/ui';
import { WealthOrb } from '@/components/ui/wealth-orb';
import { GlassView } from '@/components/ui/glass-view';
import { InteractiveButton } from '@/components/ui/interactive-button';
import { AppKitButton, useAccount } from '@reown/appkit-react-native';
import { TrendingUp, Shield, Zap, TrendingDown, RefreshCw } from 'lucide-react-native';
import { useAgentStore } from '@/lib/agent/use-agent-store';

export default function WealthScreen() {
    const { isConnected, address } = useAccount();
    const portfolio = useAgentStore.use.portfolio();
    const agentStatus = useAgentStore.use.status();
    const refreshPortfolio = useAgentStore.use.refreshPortfolio();
    const runCycle = useAgentStore.use.runCycle();
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        if (isConnected && address) {
            refreshPortfolio(address);
        }
    }, [isConnected, address]);

    const onRefresh = async () => {
        if (!address) return;
        setRefreshing(true);
        await refreshPortfolio(address);
        setRefreshing(false);
    };

    const handleHyperScale = async () => {
        if (!address) return;
        await runCycle(address);
    };

    const totalUSD = portfolio?.totalUSD ?? 0;
    const change24h = portfolio?.change24h ?? 0;
    const isPositive = change24h >= 0;

    return (
        <ScrollView
            className="flex-1 bg-black p-4"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00F5FF" />}
        >
            <View className="mt-12 items-center">
                <Text className="text-4xl font-bold text-white mb-2">Wealth</Text>
                <Text className="text-gray-400 mb-8">Sovereign AI Hedge Fund</Text>

                <AppKitButton />

                <WealthOrb balance={totalUSD} />

                {isConnected && (
                    <View className="w-full space-y-4">
                        {/* Total Balance */}
                        <GlassView borderRadius={24} className="items-center p-6 mb-4">
                            <Text className="text-gray-400 text-xs uppercase tracking-widest mb-1">Total Portfolio</Text>
                            <Text className="text-white text-4xl font-black">
                                ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                            <View className="flex-row items-center mt-2">
                                {isPositive
                                    ? <TrendingUp size={14} color="#00FF88" />
                                    : <TrendingDown size={14} color="#FF4444" />
                                }
                                <Text className="ml-1 text-sm font-bold" style={{ color: isPositive ? '#00FF88' : '#FF4444' }}>
                                    {isPositive ? '+' : ''}{change24h.toFixed(2)}% (24h)
                                </Text>
                            </View>
                        </GlassView>

                        {/* Token Breakdown */}
                        {portfolio?.tokens.map((token) => (
                            <GlassView key={token.symbol} borderRadius={20} className="flex-row items-center justify-between p-4 mb-2">
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 rounded-full mr-3 items-center justify-center" style={{ backgroundColor: token.color + '22' }}>
                                        <Text className="text-xs font-bold" style={{ color: token.color }}>{token.symbol.slice(0, 3)}</Text>
                                    </View>
                                    <View>
                                        <Text className="text-white font-semibold">{token.name}</Text>
                                        <Text className="text-gray-500 text-xs">{token.balance} {token.symbol}</Text>
                                    </View>
                                </View>
                                <View className="items-end">
                                    <Text className="text-white font-bold">${token.usdValue.toFixed(2)}</Text>
                                    <Text className="text-xs" style={{ color: token.change24h >= 0 ? '#00FF88' : '#FF4444' }}>
                                        {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                                    </Text>
                                </View>
                            </GlassView>
                        ))}

                        {/* Yield Strategy */}
                        <GlassView borderRadius={24} className="flex-row items-center justify-between p-6 mt-2">
                            <View className="flex-row items-center">
                                <View className="bg-primary-500/20 p-3 rounded-2xl mr-4">
                                    <TrendingUp size={24} color="#00F5FF" />
                                </View>
                                <View>
                                    <Text className="text-white font-semibold">Yield Strategy</Text>
                                    <Text className="text-gray-400 text-xs">Active • Delta-Neutral</Text>
                                </View>
                            </View>
                            <Text className="text-primary-400 font-bold">+{portfolio?.yieldAPY ?? 18.4}% APY</Text>
                        </GlassView>

                        {/* Security */}
                        <GlassView borderRadius={24} className="flex-row items-center justify-between p-6">
                            <View className="flex-row items-center">
                                <View className="bg-secondary-500/20 p-3 rounded-2xl mr-4">
                                    <Shield size={24} color="#9E00FF" />
                                </View>
                                <View>
                                    <Text className="text-white font-semibold">Security Level</Text>
                                    <Text className="text-gray-400 text-xs">Zama FHE • Maximum Protection</Text>
                                </View>
                            </View>
                            <Text className="text-secondary-400 font-bold">Elite</Text>
                        </GlassView>

                        {/* Hyper-Scale CTA */}
                        <InteractiveButton
                            className="bg-primary-500 py-5 rounded-3xl mt-4 items-center flex-row justify-center"
                            onPress={handleHyperScale}
                            disabled={agentStatus === 'running'}
                        >
                            {agentStatus === 'running'
                                ? <RefreshCw size={20} color="black" className="mr-2" />
                                : <Zap size={20} color="black" className="mr-2" />
                            }
                            <Text className="text-black font-bold text-lg ml-2">
                                {agentStatus === 'running' ? 'Agent Running...' : 'Hyper-Scale Yield'}
                            </Text>
                        </InteractiveButton>
                    </View>
                )}

                {!isConnected && (
                    <Text className="text-gray-500 text-center mt-12 px-8">
                        Connect your wallet via AppKit to begin interacting with the Sovereign AI Hedge Fund.
                    </Text>
                )}
            </View>
            <View className="h-20" />
        </ScrollView>
    );
}
