import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { theme } from '../theme';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Typography variant="h2" style={styles.title}>Something went wrong.</Typography>
                    <Typography variant="body" style={styles.subtitle}>
                        KINDRED encountered an unexpected error. Your funds are safe—this is a UI issue.
                    </Typography>
                    <Button
                        title="Reload App"
                        variant="primary"
                        onPress={() => this.setState({ hasError: false })}
                    />
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    title: {
        color: theme.colors.error,
        marginBottom: theme.spacing.md,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        color: theme.colors.textSecondary,
    },
});
