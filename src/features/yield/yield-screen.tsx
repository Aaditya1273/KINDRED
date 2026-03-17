import React, { useState } from 'react';
import { View, ScrollView, Switch } from 'react-native';
import { Text } from '@/components/ui';
import { GlassView } from '@/components/ui/glass-view';
import { InteractiveButton } from '@/components/ui/interactive-button';
import { TrendingUp, Shield, Zap, Lock, RefreshCw } from 'lucide-react-native';
import { useAgentStore } from '@/lib/agent/use-agent-store';
import { useAccount } from '@reown/appkit-react-native';

type Strategy = {
    id: string;
    name: string;
    description: string;
    apy: string;
    risk: 'Low' | 'Medium' | 'High';
    protocol: string;
    color: string;
    icon: React.ReactNode;
    enabled: boolean;
};

const INITIAL_STRATEGIES: Strategy[] = [
    {
        id: 'delta-neutral',
        name: 'Delta-Neutral Yield',
        description: 'Hedged USDC/FLOW LP with auto-rebalancing. Agent monitors slippage.',
        apy: '18.4%',
        risk: 'Low',
        protocol: 'Flow EVM',
        color: '#00F5FF',
        icon: <TrendingUp size={20} color="#00F5FF" />,
        enabled: true,
    },
    {
        id: 'fhe-alpha',
        name: 'Confidential Alpha',
        description: 'Zama FHE analyzes encrypted spending patterns to find yield opportunities.',
        apy: '24.1%',
        risk: 'Medium',
        protocol: 'Zama fhEVM',
        color: '#9E00FF',
        icon: <Lock size={20} color="#9E00FF" />,
        enabled: false,
    },
    {
        id: 'lit-auto',
        name: 'Lit Auto-Execute',
        description: 'PKP-signed trades execute only when oracle-verified conditions are met.',
        apy: '31.7%',
        risk: 'High',
        protocol: 'Lit Protocol',
        color: '#FFD700',
        icon: <Zap size={20} color="#FFD700" />,
        enabled: false,
    },
    {
        id: 'scheduled-savings',
        name: 'Scheduled Savings',
        description: 'Flow account abstraction auto-deposits on a weekly schedule.',
        apy: '8.2%',
        risk: 'Low',
        protocol: 'Flow Cadence',
        color: '#00FF88',
        icon: <Shield size={20} color="#00FF88" />,
        enabled: true,
    },
];

const RISK_COLORS = { Low: '#00FF88', Medium: '#FFD700', High: '#FF4444' };

export function YieldScreen() {
    const [strategies, setStrategies] = useState(INITIAL_STRATEGIES);
    const { address } = useAccount();
    const agentStatus = useAgentStore.use.status();
    const runCycle = useAgentStore.use.runCycle();

    const toggleStrategy = (id: string) => {
        setStrategies(prev =>
            prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
        );
    };

    const activeAPY = strategies
        .filter(s => s.enabled)
        .reduce((sum, s) => sum + parseFloat(s.apy), 0)
        .toFixed(1);

    return (
        <ScrollView className="flex-1 bg-black px-4">
            <View className="mt-12 mb-6">
                <Text className="text-2xl font-bold text-white">Yield Strategies</Text>
                <Text className="text-gray-400 text-sm mt-1">Managed by your autonomous agent</Text>
            </View>

            {/* Active APY summary */}
            <GlassView borderRadius={24} className="p-6 mb-6 items-center">
                <Text className="text-gray-400 text-xs uppercase tracking-widest mb-1">Combined Active APY</Text>
                <Text className="text-primary-400 text-5xl font-black">+{activeAPY}%</Text>
                <Text className="text-gray-500 text-xs mt-2">
                    {strategies.filter(s => s.enabled).length} of {strategies.length} strategies active
                </Text>
            </GlassView>

            {/* Strategy cards */}
            {strategies.map((strategy) => (
                <GlassView key={strategy.id} borderRadius={20} className="p-5 mb-4">
                    <View className="flex-row items-start justify-between">
                        <View className="flex-row items-center flex-1 mr-3">
                            <View
                                className="w-10 h-10 rounded-2xl items-center justify-center mr-3"
                                style={{ backgroundColor: strategy.color + '18' }}
                            >
                                {strategy.icon}
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold">{strategy.name}</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">{strategy.protocol}</Text>
                            </View>
                        </View>
                        <Switch
                            value={strategy.enabled}
                            onValueChange={() => toggleStrategy(strategy.id)}
                            trackColor={{ false: '#1F2937', true: strategy.color + '66' }}
                            thumbColor={strategy.enabled ? strategy.color : '#4B5563'}
                        />
                    </View>

                    <Text className="text-gray-400 text-xs mt-3 leading-4">{strategy.description}</Text>

                    <View className="flex-row items-center justify-between mt-4">
                        <View className="flex-row items-center">
                            <View
                                className="px-2 py-0.5 rounded-full mr-2"
                                style={{ backgroundColor: RISK_COLORS[strategy.risk] + '22' }}
                            >
                                <Text className="text-[10px] font-bold" style={{ color: RISK_COLORS[strategy.risk] }}>
                                    {strategy.risk} Risk
                                </Text>
                            </View>
                        </View>
                        <Text className="font-black text-lg" style={{ color: strategy.color }}>
                            {strategy.apy} APY
                        </Text>
                    </View>
                </GlassView>
            ))}

            {/* Run agent with current strategies */}
            <InteractiveButton
                className="bg-primary-500 py-5 rounded-3xl mt-2 mb-8 items-center flex-row justify-center"
                onPress={() => address && runCycle(address)}
                disabled={agentStatus === 'running' || !address}
            >
                {agentStatus === 'running'
                    ? <RefreshCw size={20} color="black" />
                    : <Zap size={20} color="black" />
                }
                <Text className="text-black font-bold text-lg ml-2">
                    {agentStatus === 'running' ? 'Executing...' : 'Apply Strategies'}
                </Text>
            </InteractiveButton>
            <View className="h-4" />
        </ScrollView>
    );
}
