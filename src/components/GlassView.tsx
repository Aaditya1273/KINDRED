import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassViewProps extends ViewProps {
    intensity?: number;
    borderRadius?: number;
}

export const GlassView: React.FC<GlassViewProps> = ({
    children,
    style,
    intensity = 30,
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
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius }]}
            />
            <View style={[styles.content, { borderRadius }]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1.5,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
    content: {
        padding: theme.spacing.md,
    },
});
