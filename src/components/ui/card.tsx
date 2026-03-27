/**
 * KINDRED Card — native-feeling elevated surface
 * Replaces GlassView for most use cases per read.md spec
 */
import React from 'react';
import {
    View,
    StyleSheet,
    Platform,
    type ViewProps,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Spacing, Radius, Motion, Interaction, useAppTheme } from '@/theme/tokens';

interface CardProps extends ViewProps {
    radius?: number;
    elevated?: boolean;
}

export function Card({ children, style, radius = Radius.lg, elevated = false, ...props }: CardProps) {
    const theme = useAppTheme();
    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: elevated ? theme.surfaceElevated : theme.surface,
                    borderColor: theme.border,
                    borderRadius: radius,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
}

interface PressableCardProps extends CardProps {
    onPress?: () => void;
    disabled?: boolean;
}

export function PressableCard({ children, style, radius = Radius.lg, elevated = false, onPress, disabled }: PressableCardProps) {
    const theme = useAppTheme();
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const handlePressIn = () => {
        scale.value = withSpring(Interaction.pressScale, Motion.spring.stiff);
        opacity.value = withTiming(Interaction.pressOpacity, { duration: Motion.timing.fast });
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, Motion.spring.stiff);
        opacity.value = withTiming(1, { duration: Motion.timing.fast });
    };

    return (
        <Animated.View style={[animStyle, { borderRadius: radius }]}>
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                style={[
                    styles.card,
                    {
                        backgroundColor: elevated ? theme.surfaceElevated : theme.surface,
                        borderColor: theme.border,
                        borderRadius: radius,
                    },
                    style
                ]}
            >
                {children}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
            },
            android: { elevation: 6 },
            web: { boxShadow: '0 4px 12px rgba(0,0,0,0.4)' },
        }),
    },
});
