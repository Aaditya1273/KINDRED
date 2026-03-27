import React from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle, View } from 'react-native';
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
        if (Platform.OS !== 'web') {
            pressed.value = withSpring(1, Motion.spring.stiff);
            if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const handlePressOut = () => {
        if (Platform.OS !== 'web') {
            pressed.value = withSpring(0, Motion.spring.stiff);
        }
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={({ pressed: isPressed }) => [
                style as any,
                Platform.OS === 'web' && isPressed && { opacity: Interaction.pressOpacity, transform: [{ scale: 0.98 }] },
                { overflow: 'hidden' }
            ]}
            {...props}
        >
            <View
                style={[styles.content]}
            >
                {typeof children === 'function' ? (children as any)({ pressed: false }) : children}
            </View>
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
