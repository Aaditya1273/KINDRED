import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { GlassView } from '../components/GlassView';
import { RootStackParamList } from '../navigation/AppNavigator';

export const WelcomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <Layout>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Typography variant="h1" style={styles.title}>KINDRED</Typography>
                    <Typography variant="caption" style={styles.subtitle}>
                        Kinetic Intelligence & Networked Decentralized Real-time Data
                    </Typography>
                </View>

                <GlassView style={styles.visionContainer}>
                    <Typography variant="h3" style={styles.visionTitle}>The World’s First Autonomous Personal Hedge Fund</Typography>
                    <Typography variant="body" color={theme.colors.textSecondary}>
                        Elite financial stewardship through privacy-preserving AI. Managed by you, executed autonomously.
                    </Typography>
                </GlassView>

                <View style={styles.footer}>
                    <Button
                        title="Get Started"
                        variant="primary"
                        size="lg"
                        onPress={() => navigation.navigate('Dashboard')}
                    />
                    <Button
                        title="Learn More"
                        variant="glass"
                        style={{ marginTop: theme.spacing.md }}
                        onPress={() => { }}
                    />
                </View>
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
    logo: {
        width: 100,
        height: 100,
        marginBottom: theme.spacing.lg,
    },
    title: {
        color: theme.colors.primary,
    },
    subtitle: {
        textAlign: 'center',
        marginTop: theme.spacing.xs,
    },
    visionContainer: {
        marginVertical: theme.spacing.xl,
    },
    visionTitle: {
        marginBottom: theme.spacing.sm,
    },
    footer: {
        marginBottom: theme.spacing.xl,
    },
});
