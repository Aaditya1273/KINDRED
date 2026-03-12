import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { theme } from '../theme';

interface TypographyProps extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
    color?: string;
    weight?: 'normal' | 'bold' | '600' | '500';
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    style,
    variant = 'body',
    color = theme.colors.text,
    weight,
    ...props
}) => {
    return (
        <Text
            style={[
                styles.base,
                styles[variant],
                { color },
                weight ? { fontWeight: weight } : null,
                style
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    base: {
        fontFamily: 'System', // Will use Google Fonts later if needed
    },
    h1: {
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: -1,
    },
    h2: {
        fontSize: 24,
        fontWeight: '600',
        letterSpacing: -0.5,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600',
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
    },
    caption: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    label: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: theme.colors.textMuted,
    },
});
