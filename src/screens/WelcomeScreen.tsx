import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { GlassView } from '../components/GlassView';
import { RootStackParamList } from '../navigation/AppNavigator';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withDelay,
    Easing,
    FadeInUp,
    FadeInDown
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export const WelcomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // Pulse animation for logo
    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1.15, {
                duration: 2000,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
            }),
            -1,
            true
        );
    }, []);

    const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        opacity: withTiming(1, { duration: 1000 })
    }));

    const handleGetStarted = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.navigate('Dashboard');
    };

    return (
        <Layout>
            <View style={styles.content}>
                <Animated.View
                    entering={FadeInUp.duration(1000).springify()}
                    style={styles.header}
                >
                    <Animated.View style={[styles.logoContainer, logoStyle]}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </Animated.View>
                    <Typography variant="h1" style={styles.title}>KINDRED</Typography>
                    <Typography variant="caption" style={styles.subtitle}>
                        Kinetic Intelligence & Networked Decentralized Real-time Data
                    </Typography>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.delay(400).duration(1000).springify()}
                    style={styles.visionWrapper}
                >
                    <GlassView style={styles.visionContainer}>
                        <Typography variant="h3" style={styles.visionTitle}>The World’s First Autonomous Personal Hedge Fund</Typography>
                        <Typography variant="body" color={theme.colors.textSecondary}>
                            Elite financial stewardship through privacy-preserving AI. Managed by you, executed autonomously.
                        </Typography>
                    </GlassView>
                </Animated.View>

                <Animated.View
                    entering={FadeInDown.delay(800).duration(1000).springify()}
                    style={styles.footer}
                >
                    <Button
                        title="Get Started"
                        variant="primary"
                        size="lg"
                        onPress={handleGetStarted}
                    />
                    <Button
                        title="Learn More"
                        variant="glass"
                        style={{ marginTop: theme.spacing.md }}
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    />
                </Animated.View>
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginTop: theme.spacing.xl,
    },
    logoContainer: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        marginBottom: theme.spacing.lg,
    },
    logo: {
        width: 120,
        height: 120,
    },
    title: {
        color: theme.colors.primary,
        letterSpacing: 4,
        fontWeight: '900',
    },
    subtitle: {
        textAlign: 'center',
        marginTop: theme.spacing.xs,
        opacity: 0.7,
    },
    visionWrapper: {
        marginVertical: theme.spacing.xl,
    },
    visionContainer: {
        padding: theme.spacing.lg,
    },
    visionTitle: {
        marginBottom: theme.spacing.sm,
        lineHeight: 28,
    },
    footer: {
        marginBottom: theme.spacing.xl,
    },
});
