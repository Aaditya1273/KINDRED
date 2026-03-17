import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui';
import { GlassView } from '@/components/ui/glass-view';
import { InteractiveButton } from '@/components/ui/interactive-button';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    Easing,
    FadeIn,
    FadeInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
    {
        id: 1,
        title: "KINDRED",
        subtitle: "Kinetic Intelligence & Networked Decentralized Real-time Data",
        description: "The World’s First Autonomous Personal Hedge Fund. Managed by you, executed autonomously.",
        image: require('../../../assets/logo.png'),

    },
    {
        id: 2,
        title: "Privacy Shield",
        subtitle: "Zama FHE Technology",
        description: "Analyze your private financial history while it's still encrypted. Total data sovereignty.",
        icon: 'lock',
    },
    {
        id: 3,
        title: "Autonomous Yield",
        subtitle: "Flow Account Abstraction",
        description: "KINDRED automatically identifies and moves your capital to high-performing yield loops.",
        icon: 'trending-up',
    }
];

export const KindredOnboarding = () => {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1.1, {
                duration: 2500,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
            }),
            -1,
            true
        );
    }, []);

    const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
    }));

    const handleNext = () => {
        if (step < ONBOARDING_STEPS.length - 1) {
            setStep(step + 1);
            if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        router.replace('/(app)');
    };

    const currentStep = ONBOARDING_STEPS[step];

    return (
        <View className="flex-1 bg-black justify-between py-12 px-4">
            <View className="items-center">
                <Animated.View
                    key={step}
                    entering={FadeIn.duration(800)}
                    className="items-center w-full"
                >
                    <View className="items-center mt-12 mb-8">
                        <Animated.View style={logoStyle} className="mb-6 shadow-primary-500 shadow-2xl">
                            {currentStep.image ? (
                                <Image
                                    source={currentStep.image}
                                    style={{ width: 140, height: 140 }}
                                    resizeMode="contain"
                                />
                            ) : (
                                <View className="w-[140] h-[140] justify-center items-center">
                                    <View className="w-[100] h-[100] rounded-full border-2 border-primary-500 bg-primary-500/10" />
                                </View>
                            )}
                        </Animated.View>
                        <Text className="text-primary-500 text-4xl font-black tracking-widest text-center uppercase">
                            {currentStep.title}
                        </Text>
                        <Text className="text-white opacity-70 text-[10px] tracking-widest uppercase text-center mt-2 px-6">
                            {currentStep.subtitle}
                        </Text>
                    </View>

                    <Animated.View
                        entering={FadeInUp.delay(200).duration(800).springify()}
                        className="w-full px-4"
                    >
                        <GlassView borderRadius={24} className="p-6 border-white/5">
                            <Text className="text-gray-400 text-center leading-6 text-base">
                                {currentStep.description}
                            </Text>
                        </GlassView>
                    </Animated.View>
                </Animated.View>
            </View>

            <View className="w-full pb-8">
                <View className="flex-row justify-center mb-8">
                    {ONBOARDING_STEPS.map((_, i) => (
                        <View
                            key={i}
                            className={`w-2 h-2 rounded-full mx-1 ${i === step ? 'bg-primary-500' : 'bg-white/20'}`}
                        />
                    ))}
                </View>

                <InteractiveButton
                    className="bg-primary-500 py-5 rounded-3xl items-center"
                    onPress={handleNext}
                >
                    <Text className="text-black font-bold text-lg">
                        {step === ONBOARDING_STEPS.length - 1 ? "Enter KINDRED" : "Continue"}
                    </Text>
                </InteractiveButton>

                {step === 0 && (
                    <InteractiveButton
                        className="mt-4 py-2 items-center"
                        onPress={handleComplete}
                    >
                        <Text className="text-gray-500 font-medium">Skip</Text>
                    </InteractiveButton>
                )}
            </View>
        </View>
    );
};
