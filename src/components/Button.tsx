import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { theme } from '../theme';
import { Typography } from './Typography';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'glass';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'md',
    style,
    ...props
}) => {
    const isGlass = variant === 'glass';

    const content = (
        <View style={[
            styles.base,
            styles[variant],
            styles[size],
            style
        ]}>
            <Typography
                variant={size === 'lg' ? 'h3' : 'body'}
                weight="600"
                color={variant === 'primary' ? '#000000' : theme.colors.text}
            >
                {title}
            </Typography>
        </View>
    );

    if (variant === 'primary') {
        return (
            <TouchableOpacity activeOpacity={0.8} {...props}>
                <LinearGradient
                    colors={['#00EF8B', '#00BA6C']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.base, styles[size], style]}
                >
                    <Typography variant="body" weight="700" color="#000000">
                        {title}
                    </Typography>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity activeOpacity={0.7} {...props}>
            {content}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        // Handled by LinearGradient
    },
    secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    glass: {
        backgroundColor: theme.colors.glassBackground,
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
    },
    sm: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    md: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    lg: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
});
