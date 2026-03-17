import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui';
import { GlassView } from '@/components/ui/glass-view';
import { Brain, Terminal, ShieldCheck } from 'lucide-react-native';

export default function AgentScreen() {
    return (
        <ScrollView className="flex-1 bg-black p-4">
            <View className="mt-12">
                <View className="flex-row items-center mb-8">
                    <Brain size={32} color="#00F5FF" className="mr-4" />
                    <View>
                        <Text className="text-3xl font-bold text-white">Agent Brain</Text>
                        <Text className="text-gray-400">Autonomous Intelligence Feed</Text>
                    </View>
                </View>

                <View className="space-y-4">
                    <Text className="text-gray-500 font-bold uppercase tracking-wider mb-2">Live Logs</Text>

                    {[
                        { title: 'Market Sentiment Analysis', icon: <Terminal size={18} color="#00F5FF" />, status: 'Completed', time: '2m ago', color: '#00F5FF' },
                        { title: 'Zama FHE Computation', icon: <ShieldCheck size={18} color="#9E00FF" />, status: 'Encrypted', time: '5m ago', color: '#9E00FF' },
                        { title: 'Portfolio Rebalancing', icon: <Terminal size={18} color="#FFD700" />, status: 'Executing', time: 'Now', color: '#FFD700' }
                    ].map((log, i) => (
                        <GlassView key={i} borderRadius={20} className="p-4 mb-4">
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <View className="mr-3" style={{ opacity: 0.8 }}>{log.icon}</View>
                                    <Text className="text-white font-medium">{log.title}</Text>
                                </View>
                                <Text className="text-[10px] text-gray-500">{log.time}</Text>
                            </View>
                            <View className="mt-3 flex-row items-center justify-between">
                                <View className="h-1 flex-1 bg-gray-800 rounded-full mr-4">
                                    <View className="h-1 bg-primary-500 rounded-full" style={{ width: log.status === 'Executing' ? '65%' : '100%', backgroundColor: log.color }} />
                                </View>
                                <Text className="text-[10px] font-bold" style={{ color: log.color }}>{log.status}</Text>
                            </View>
                        </GlassView>
                    ))}
                </View>

                <GlassView intensity={40} className="mt-8 border-primary-500/30 p-6 bg-primary-500/5 items-center">
                    <Text className="text-primary-400 font-bold text-center">Self-Correction Mode Active</Text>
                    <Text className="text-gray-500 text-xs text-center mt-2">
                        Agent is automatically hedging against high-volatility events detected on-chain.
                    </Text>
                </GlassView>
            </View>
            <View className="h-20" />
        </ScrollView>
    );
}
