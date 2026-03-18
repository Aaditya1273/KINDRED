import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Interaction, Motion } from '@/theme/tokens';
import { Platform } from 'react-native';

export interface InteractiveButtonProps extends TouchableOpacityProps {
    haptic?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({
    children,
    style,
    haptic = true,
    ...props
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(Interaction.pressScale, Motion.spring.stiff);
        if (haptic && Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, Motion.spring.stiff);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={style}
            {...props}
        >
            <Animated.View style={[animatedStyle, styles.content]}>
                {children}
            </Animated.View>
        </TouchableOpacity>
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
