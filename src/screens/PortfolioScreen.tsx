import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { theme } from '../theme';
import { GlassView } from '../components/GlassView';
import { ChevronLeft, Wallet, PieChart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export const PortfolioScreen = () => {
    const navigation = useNavigation();

    return (
        <Layout>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ChevronLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Typography variant="h2" style={styles.title}>Portfolio</Typography>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <GlassView style={styles.summaryCard}>
                    <Typography variant="label">Net Worth</Typography>
                    <Typography variant="h1">$124,800.00</Typography>
                    <Typography variant="caption" color={theme.colors.success}>+8.5% this month</Typography>
                </GlassView>

                <View style={styles.sectionHeader}>
                    <Typography variant="h3">Asset Allocation</Typography>
                    <PieChart size={20} color={theme.colors.textSecondary} />
                </View>

                <View style={styles.assetList}>
                    <GlassView style={styles.assetItem}>
                        <View style={styles.assetIcon}>
                            <Typography variant="body" weight="bold">F</Typography>
                        </View>
                        <View style={styles.assetDetails}>
                            <Typography variant="body" weight="600">Flow</Typography>
                            <Typography variant="caption">Network Token</Typography>
                        </View>
                        <View style={styles.assetValue}>
                            <Typography variant="body" weight="600">42,000 FLOW</Typography>
                            <Typography variant="caption">$84,000</Typography>
                        </View>
                    </GlassView>

                    <GlassView style={[styles.assetItem, { marginTop: theme.spacing.md }]}>
                        <View style={[styles.assetIcon, { backgroundColor: theme.colors.info }]}>
                            <Typography variant="body" weight="bold">S</Typography>
                        </View>
                        <View style={styles.assetDetails}>
                            <Typography variant="body" weight="600">Storacha</Typography>
                            <Typography variant="caption">Strategy Data</Typography>
                        </View>
                        <View style={styles.assetValue}>
                            <Typography variant="body" weight="600">Persistence</Typography>
                            <Typography variant="caption">Managed</Typography>
                        </View>
                    </GlassView>

                    <GlassView style={[styles.assetItem, { marginTop: theme.spacing.md }]}>
                        <View style={[styles.assetIcon, { backgroundColor: theme.colors.secondary }]}>
                            <Typography variant="body" weight="bold">Z</Typography>
                        </View>
                        <View style={styles.assetDetails}>
                            <Typography variant="body" weight="600">Zama Vault</Typography>
                            <Typography variant="caption">Confidential Pool</Typography>
                        </View>
                        <View style={styles.assetValue}>
                            <Typography variant="body" weight="600">Encrypted</Typography>
                            <Typography variant="caption">Sovereign</Typography>
                        </View>
                    </GlassView>
                </View>

                <TouchableOpacity style={styles.walletButton}>
                    <Wallet size={20} color="#000" />
                    <Typography variant="body" weight="bold" color="#000" style={{ marginLeft: 8 }}>
                        Connect External Wallet
                    </Typography>
                </TouchableOpacity>
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
    summaryCard: {
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    assetList: {
        marginBottom: theme.spacing.xl,
    },
    assetItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    assetIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    assetDetails: {
        marginLeft: theme.spacing.md,
        flex: 1,
    },
    assetValue: {
        alignItems: 'flex-end',
    },
    walletButton: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
    },
});
