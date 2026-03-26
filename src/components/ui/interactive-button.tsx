import React from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Interaction, Motion } from '@/theme/tokens';
import { Platform } from 'react-native';

export interface InteractiveButtonProps extends PressableProps {
    haptic?: boolean;
    style?: ViewStyle | ViewStyle[];
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
    children,
    style,
    haptic = true,
    onPress,
    ...props
}) => {
    const pressed = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(pressed.value, [0, 1], [1, Interaction.pressScale]) }],
        opacity: interpolate(pressed.value, [0, 1], [1, Interaction.pressOpacity]),
    }));

    const handlePressIn = () => {
        pressed.value = withSpring(1, Motion.spring.stiff);
        if (haptic && Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const handlePressOut = () => {
        pressed.value = withSpring(0, Motion.spring.stiff);
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={({ pressed: isPressed }) => [
                style as any,
                Platform.OS === 'web' && isPressed && { opacity: Interaction.pressOpacity },
                { overflow: 'hidden' }
            ]}
            {...props}
        >
            <Animated.View
                style={[styles.content, animatedStyle, { pointerEvents: 'none' } as any]}
            >
                {typeof children === 'function' ? (children as any)({ pressed: pressed.value > 0.5 }) : children}
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
});
