import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Bell, User, Wallet, UserCheck } from 'lucide-react-native';
import { useAppTheme } from '@/theme/tokens';
import { useAppKit, useAccount } from '@reown/appkit-react-native';
import { useAgentStore } from '@/lib/agent/use-agent-store';

export const AppHeader = () => {
    const theme = useAppTheme();
    const { open } = useAppKit();
    const { address, isConnected } = useAccount();
    const isWorldIDVerified = useAgentStore.use.isWorldIDVerified();

    const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connect';

    return (
        <View style={styles.topHeader}>
            {/* Left: Profile / World ID */}
            <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 10 }}>
                <Pressable
                    onPress={() => router.push('/settings')}
                    style={[styles.profileCircle, { borderColor: isWorldIDVerified ? theme.positive : theme.border }]}
                >
                    <BlurView intensity={Platform.OS === 'web' ? 8 : 15} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    <View style={{ width: '100%', height: '100%', backgroundColor: isWorldIDVerified ? theme.positive + '15' : theme.primary + '15', alignItems: 'center', justifyContent: 'center' }}>
                        {isWorldIDVerified ? <UserCheck size={20} color={theme.positive} /> : <User size={20} color={theme.primary} />}
                    </View>
                </Pressable>
            </View>

            {/* Center: Brand */}
            <View style={styles.centerBrand}>
                <Text style={[styles.brandText, { color: theme.textPrimary }]}>KINDRED</Text>
            </View>

            {/* Right: Wallet Connect */}
            <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 10, gap: 12 }}>
                <Pressable
                    onPress={() => open()}
                    style={[styles.walletBtn, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }]}
                >
                    <Wallet size={16} color={theme.primary} />
                    <Text style={[styles.walletText, { color: theme.primary }]}>{truncatedAddress}</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
        height: 44,
    },
    centerBrand: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    brandText: {
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 2,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    profileCircle: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', borderWidth: 1 },
    walletBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, height: 40, borderRadius: 20, borderWidth: 1 },
    walletText: { fontSize: 13, fontWeight: '700' },
    controlBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, overflow: 'hidden' },
});
