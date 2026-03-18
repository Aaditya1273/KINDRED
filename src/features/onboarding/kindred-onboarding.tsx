import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, View, ScrollView } from '@/components/ui';
import { GlassView } from '@/components/ui/glass-view';
import { InteractiveButton } from '@/components/ui/interactive-button';
import Animated, {
    FadeIn,
    FadeInDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shield, PieChart, Brain, ArrowRight } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '@/theme/tokens';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time';

const ONBOARDING_STEPS = [
    {
        id: 1,
        title: "KINDRED",
        description: "The World’s First Autonomous Personal Hedge Fund. Managed by you, executed autonomously.",
        balance: 0,
    },
    {
        id: 2,
        title: "Privacy Shield",
        subtitle: "Zama FHE Technology",
        description: "Analyze your private financial history while it's still encrypted. Total data sovereignty.",
        balance: 5000,
        icon: Shield,
    },
    {
        id: 3,
        title: "Autonomous Yield",
        subtitle: "Flow Account Abstraction",
        description: "KINDRED automatically identifies and moves your capital to high-performing yield loops.",
        balance: 12500,
        icon: PieChart,
    }
];

export const KindredOnboarding = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState(0);
    const [_, setIsFirstTime] = useIsFirstTime();

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
        setIsFirstTime(false);
        router.replace('/(app)');
    };

    const currentStep = ONBOARDING_STEPS[step];
    const Icon = currentStep.icon;

    return (
        <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.header}>
                <Animated.View key={`header-${step}`} entering={FadeInDown.duration(400)}>
                    <View style={styles.iconContainer}>
                        {Icon && <Icon size={16} color={Colors.cyan} />}
                        {currentStep.subtitle && <Text style={styles.subtitle}>{currentStep.subtitle}</Text>}
                    </View>
                    <Text style={styles.title}>{currentStep.title}</Text>
                </Animated.View>
            </View>

            <View style={styles.center}>
                <Animated.View key={`k-logo-${step}`} entering={FadeIn.duration(1000)} style={styles.kContainer}>
                    <Text style={styles.kLogo}>K</Text>
                </Animated.View>

                <Animated.View
                    key={`desc-${step}`}
                    entering={FadeInDown.delay(300).duration(600)}
                    style={styles.descriptionContainer}
                >
                    <GlassView borderRadius={Radius.xl} style={styles.glass}>
                        <Text style={styles.description}>
                            {currentStep.description}
                        </Text>
                    </GlassView>
                </Animated.View>
            </View>

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {ONBOARDING_STEPS.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                { backgroundColor: i === step ? Colors.cyan : 'rgba(255,255,255,0.1)' }
                            ]}
                        />
                    ))}
                </View>

                <InteractiveButton
                    style={styles.primaryButton}
                    onPress={handleNext}
                >
                    <Text style={styles.buttonText}>
                        {step === ONBOARDING_STEPS.length - 1 ? "Enter KINDRED" : "Continue"}
                    </Text>
                    {step < ONBOARDING_STEPS.length - 1 && <ArrowRight size={18} color={Colors.bg} />}
                </InteractiveButton>

                <InteractiveButton
                    style={styles.skipButton}
                    onPress={handleComplete}
                >
                    <Text style={styles.skipText}>Skip Setup</Text>
                </InteractiveButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.bg,
        paddingHorizontal: Spacing.lg,
    },
    header: {
        marginTop: Spacing.xl,
        alignItems: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
        marginBottom: Spacing.xs,
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: Colors.textPrimary,
        letterSpacing: -1,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 11,
        color: Colors.cyan,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    kContainer: {
        width: 180,
        height: 180,
        borderRadius: Radius.xl,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        shadowColor: Colors.cyan,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        ...Platform.select({
            web: {
                boxShadow: `0 12px 24px ${Colors.cyan}4D`, // 4D is ~30% opacity
            }
        })
    },
    kLogo: {
        fontSize: 84,
        fontWeight: '900',
        color: Colors.cyan,
        letterSpacing: -2,
    },
    descriptionContainer: {
        width: '100%',
        marginTop: Spacing.lg,
    },
    glass: {
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    description: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        marginTop: 'auto',
        paddingBottom: Spacing.lg,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: Spacing.xl,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    primaryButton: {
        backgroundColor: Colors.cyan,
        height: 64,
        borderRadius: Radius.xl,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        color: Colors.bg,
        fontSize: 18,
        fontWeight: '800',
    },
    skipButton: {
        marginTop: Spacing.md,
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    skipText: {
        color: Colors.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
});
