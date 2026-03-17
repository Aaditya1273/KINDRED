import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
    interpolateColor,
    withSpring
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Motion } from '@/theme/tokens';

interface WealthOrbProps {
    balance: number;
    isProcessing?: boolean;
}

export const WealthOrb: React.FC<WealthOrbProps> = ({ balance }) => {
    const scale = useSharedValue(1);
    const glow = useSharedValue(0.4);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    // Calculate size based on balance
    const baseSize = 200;
    const dynamicSize = Math.min(260, baseSize + (balance / 5000));

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

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX * 0.2;
            translateY.value = event.translationY * 0.2;
        })
        .onEnd(() => {
            translateX.value = withSpring(0, Motion.spring.gentle);
            translateY.value = withSpring(0, Motion.spring.gentle);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value },
            { translateY: translateY.value }
        ],
        opacity: glow.value,
    }));

    const innerPulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: 0.8 + (glow.value * 0.2) }],
        backgroundColor: interpolateColor(
            glow.value,
            [0.4, 0.8],
            ['#00F5FF', '#9E00FF'] // Neon Cyan to Plasma Purple
        )
    }));

    return (
        <GestureDetector gesture={gesture}>
            <View style={[styles.container, { width: dynamicSize, height: dynamicSize }]}>
                <Animated.View style={[styles.outerGlow, animatedStyle]} />
                <BlurView intensity={50} tint="dark" style={styles.blurContainer}>
                    <Animated.View style={[styles.orb, innerPulseStyle]} />
                </BlurView>
                <View style={styles.core} />
            </View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 40,
    },
    outerGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 150,
        backgroundColor: '#00F5FF',
        shadowColor: '#00F5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 50,
        opacity: 0.3,
    },
    blurContainer: {
        width: '85%',
        height: '85%',
        borderRadius: 125,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    orb: {
        width: '75%',
        height: '75%',
        borderRadius: 100,
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    core: {
        position: 'absolute',
        width: '25%',
        height: '25%',
        borderRadius: 30,
        backgroundColor: '#FFF',
        opacity: 0.2,
    }
});
