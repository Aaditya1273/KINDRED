import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    interpolateColor
} from 'react-native-reanimated';
import { theme } from '../theme';
import { BlurView } from 'expo-blur';

interface WealthOrbProps {
    balance: number;
    isProcessing?: boolean;
}

export const WealthOrb: React.FC<WealthOrbProps> = ({ balance, isProcessing }) => {
    const scale = useSharedValue(1);
    const glow = useSharedValue(0.4);

    // Calculate size based on balance (normalized for demo)
    const baseSize = 180;
    const dynamicSize = Math.min(240, baseSize + (balance / 1000));

    useEffect(() => {
        scale.value = withRepeat(
            withTiming(1.05, {
                duration: 3000,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
            }),
            -1,
            true
        );

        glow.value = withRepeat(
            withTiming(0.8, {
                duration: 2000,
                easing: Easing.inOut(Easing.ease),
            }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: glow.value,
        shadowOpacity: glow.value,
        shadowRadius: 30 * glow.value,
    }));

    const innerPulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: 0.8 + (glow.value * 0.2) }],
        backgroundColor: interpolateColor(
            glow.value,
            [0.4, 0.8],
            [theme.colors.primary, theme.colors.secondary]
        )
    }));

    return (
        <View style={[styles.container, { width: dynamicSize, height: dynamicSize }]}>
            <Animated.View style={[styles.outerGlow, animatedStyle]} />
            <BlurView intensity={40} tint="light" style={styles.blurContainer}>
                <Animated.View style={[styles.orb, innerPulseStyle]} />
            </BlurView>
            <View style={styles.core} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: theme.spacing.xl,
    },
    outerGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 120,
        backgroundColor: theme.colors.primary,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 40,
        opacity: 0.2,
    },
    blurContainer: {
        width: '80%',
        height: '80%',
        borderRadius: 100,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    orb: {
        width: '70%',
        height: '70%',
        borderRadius: 80,
        backgroundColor: theme.colors.primary,
    },
    core: {
        position: 'absolute',
        width: '20%',
        height: '20%',
        borderRadius: 20,
        backgroundColor: '#FFF',
        opacity: 0.1,
    }
});
