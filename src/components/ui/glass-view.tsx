import React from 'react';
import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassViewProps extends ViewProps {
    intensity?: number;
    borderRadius?: number;
}

const isWeb = Platform.OS === 'web';

export const GlassView: React.FC<GlassViewProps> = ({
    children,
    style,
    intensity = 30,
    borderRadius = 16,
    ...props
}) => {
    return (
        <View style={[styles.container, { borderRadius }, style]} {...props}>
            {!isWeb && (
                <BlurView
                    intensity={intensity}
                    style={[StyleSheet.absoluteFill, { borderRadius }]}
                    tint="dark"
                />
            )}

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
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
            web: {
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
        }),
    },
    content: {
        padding: 16,
    },
});
