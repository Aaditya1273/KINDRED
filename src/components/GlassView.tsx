import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';

interface GlassViewProps extends ViewProps {
    intensity?: number;
    borderRadius?: number;
}

export const GlassView: React.FC<GlassViewProps> = ({
    children,
    style,
    intensity = 20,
    borderRadius = theme.borderRadius.lg,
    ...props
}) => {
    return (
        <View style={[styles.container, { borderRadius }, style]} {...props}>
            <BlurView
                intensity={intensity}
                style={[StyleSheet.absoluteFill, { borderRadius }]}
                tint="dark"
            />
            <View style={[styles.content, { borderRadius }]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.glassBackground,
        borderColor: theme.colors.glassBorder,
        borderWidth: 1,
        overflow: 'hidden',
    },
    content: {
        padding: theme.spacing.md,
    },
});
