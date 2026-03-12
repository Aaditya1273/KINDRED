import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import { GlassView } from '../components/GlassView';
import { ChevronLeft, Shield, Zap, Key, UserCheck, Bell, LogOut } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export const SettingsScreen = () => {
    const navigation = useNavigation();
    const [spendingLimit, setSpendingLimit] = useState(100);
    const [autoLevel, setAutoLevel] = useState(0.8);

    const handleHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Typography variant="h2" style={styles.title}>Safety Guardrails</Typography>
                <Key size={20} color={theme.colors.secondary} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Animated.View entering={FadeInUp.duration(600)}>
                    <GlassView style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Shield size={20} color={theme.colors.primary} />
                            <Typography variant="body" weight="600" style={{ marginLeft: 10 }}>Permission Manager (Lit Protocol)</Typography>
                        </View>

                        <View style={styles.settingItem}>
                            <View>
                                <Typography variant="body">Max Swap Limit</Typography>
                                <Typography variant="caption">Autonomous spend per transaction</Typography>
                            </View>
                            <Typography variant="h3" color={theme.colors.primary}>${spendingLimit}</Typography>
                        </View>

                        <View style={styles.settingItem}>
                            <View>
                                <Typography variant="body">Autonomous Level</Typography>
                                <Typography variant="caption">0.0 (Manual) to 1.0 (Full Autopilot)</Typography>
                            </View>
                            <Typography variant="h3" color={theme.colors.secondary}>{autoLevel.toFixed(1)}</Typography>
                        </View>

                        <View style={styles.litBadge}>
                            <Zap size={12} color={theme.colors.secondary} />
                            <Typography variant="label" family="JetBrainsMono" color={theme.colors.secondary} style={{ marginLeft: 6 }}>
                                Decentralized Non-Custodial Key: ACTIVE
                            </Typography>
                        </View>
                    </GlassView>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(200).duration(600)}>
                    <GlassView style={[styles.section, { marginTop: theme.spacing.md }]}>
                        <Typography variant="h3" style={{ marginBottom: theme.spacing.md }}>Biometrics & ID</Typography>

                        <View style={styles.rowItem}>
                            <UserCheck size={20} color={theme.colors.textSecondary} />
                            <Typography variant="body" style={{ flex: 1, marginLeft: 12 }}>World ID Verification</Typography>
                            <View style={styles.statusVerified}>
                                <Typography variant="label" color="#000">Verified</Typography>
                            </View>
                        </View>

                        <View style={styles.rowItem}>
                            <Bell size={20} color={theme.colors.textSecondary} />
                            <Typography variant="body" style={{ flex: 1, marginLeft: 12 }}>Push Notifications</Typography>
                            <Switch value={true} onValueChange={handleHaptic} thumbColor={theme.colors.primary} />
                        </View>
                    </GlassView>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(400).duration(600)}>
                    <GlassView style={[styles.section, { marginTop: theme.spacing.md, backgroundColor: 'rgba(255, 75, 75, 0.05)' }]}>
                        <TouchableOpacity style={styles.logoutBtn} onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)}>
                            <LogOut size={20} color={theme.colors.error} />
                            <Typography variant="body" color={theme.colors.error} weight="bold" style={{ marginLeft: 12 }}>
                                Revoke Agent Manifest
                            </Typography>
                        </TouchableOpacity>
                    </GlassView>
                </Animated.View>

                <Typography variant="caption" family="JetBrainsMono" style={styles.version}>
                    KINDRED_v1.0.4_BUILD_2026
                </Typography>
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    title: {
        color: theme.colors.primary,
    },
    scroll: {
        paddingBottom: theme.spacing.xxl,
    },
    section: {
        padding: theme.spacing.lg,
        backgroundColor: '#0D0D0D',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    litBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 224, 255, 0.05)',
        padding: 8,
        borderRadius: 8,
        marginTop: theme.spacing.sm,
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    statusVerified: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    version: {
        textAlign: 'center',
        marginTop: theme.spacing.xxl,
        opacity: 0.3,
    },
});
