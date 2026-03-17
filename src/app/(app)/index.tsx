import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '@/components/ui';
import { WealthOrb } from '@/components/ui/wealth-orb';
import { GlassView } from '@/components/ui/glass-view';
import { InteractiveButton } from '@/components/ui/interactive-button';
import { AppKitButton, useAccount } from '@reown/appkit-react-native';
import { TrendingUp, Shield, Zap } from 'lucide-react-native';

export default function WealthScreen() {
    const { isConnected, address } = useAccount();

    return (
        <ScrollView className="flex-1 bg-black p-4">
            <View className="mt-12 items-center">
                <Text className="text-4xl font-bold text-white mb-2">Wealth</Text>
                <Text className="text-gray-400 mb-8">Sovereign AI Hedge Fund</Text>

                <AppKitButton />

                <WealthOrb balance={isConnected ? 12500.42 : 0} />

                {isConnected && (
                    <View className="w-full space-y-4">
                        <GlassView borderRadius={24} className="flex-row items-center justify-between p-6">
                            <View className="flex-row items-center">
                                <View className="bg-primary-500/20 p-3 rounded-2xl mr-4">
                                    <TrendingUp size={24} color="#00F5FF" />
                                </View>
                                <View>
                                    <Text className="text-white font-semibold">Yield Strategy</Text>
                                    <Text className="text-gray-400 text-xs">Active • Delta-Neutral</Text>
                                </View>
                            </View>
                            <Text className="text-primary-400 font-bold">+18.4% APY</Text>
                        </GlassView>

                        <GlassView borderRadius={24} className="flex-row items-center justify-between p-6">
                            <View className="flex-row items-center">
                                <View className="bg-secondary-500/20 p-3 rounded-2xl mr-4">
                                    <Shield size={24} color="#9E00FF" />
                                </View>
                                <View>
                                    <Text className="text-white font-semibold">Security Level</Text>
                                    <Text className="text-gray-400 text-xs">Maximum Protection</Text>
                                </View>
                            </View>
                            <Text className="text-secondary-400 font-bold">Elite</Text>
                        </GlassView>

                        <InteractiveButton className="bg-primary-500 py-5 rounded-3xl mt-6 items-center flex-row justify-center">
                            <Zap size={20} color="black" className="mr-2" />
                            <Text className="text-black font-bold text-lg">Hyper-Scale Yield</Text>
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
