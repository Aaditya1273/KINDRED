import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, Radius, useAppTheme } from '@/theme/tokens';
import { Shield, ChevronRight, LogOut, Github, Globe, Heart, Share2, Info, Moon, Sun, Smartphone } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuthStore as useAuth } from '@/features/auth/use-auth-store';
import { useSelectedTheme } from '@/lib/hooks/use-selected-theme';
import { useAccount } from '@reown/appkit-react-native';

const SettingItem = ({ icon: Icon, label, value, onPress, isLast, color: customColor }: any) => {
    const theme = useAppTheme();
    const color = customColor || theme.textPrimary;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.settingItem,
                {
                    backgroundColor: pressed ? (theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') : 'transparent',
                    borderBottomColor: theme.border
                }
            ]}
        >
            <View style={styles.settingMain}>
                <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                    <Icon size={18} color={color} />
                </View>
                <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>{label}</Text>
            </View>
            <View style={styles.settingRight}>
                {value && <Text style={[styles.settingValue, { color: theme.textSecondary }]}>{value}</Text>}
                <ChevronRight size={16} color={theme.textMuted} />
            </View>
        </Pressable>
    );
};

const SettingSection = ({ title, children }: any) => {
    const theme = useAppTheme();
    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>{title}</Text>
            <View style={[styles.sectionContent, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderColor: theme.border }]}>
                {children}
            </View>
        </View>
    );
};

export default function RebornSettings() {
    const insets = useSafeAreaInsets();
    const theme = useAppTheme();
    const signOut = useAuth.use.signOut();
    const { selectedTheme, setSelectedTheme } = useSelectedTheme();
    const { address, isConnected } = useAccount();

    const toggleTheme = () => {
        const next: any = selectedTheme === 'dark' ? 'light' : 'dark';
        setSelectedTheme(next);
    };

    const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'No Wallet';

    return (
        <View style={[styles.root, { paddingTop: insets.top, backgroundColor: theme.bg }]}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.Text entering={FadeInDown.duration(400)} style={[styles.title, { color: theme.textPrimary }]}>Settings</Animated.Text>

                {/* Profile Header */}
                <Animated.View entering={FadeInDown.delay(100).duration(500)} style={[styles.profileCard, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderColor: theme.border }]}>
                    <View style={[styles.avatar, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '25' }]}>
                        <Shield size={32} color={theme.primary} />
                    </View>
                    <View>
                        <Text style={[styles.profileName, { color: theme.textPrimary }]}>{isConnected ? truncatedAddress : 'KINDRED USER'}</Text>
                        <Text style={[styles.profileStatus, { color: isConnected ? theme.positive : theme.primary }]}>
                            {isConnected ? 'Identity Verified' : 'Wallet Disconnected'}
                        </Text>
                    </View>
                </Animated.View>

                {/* Account Section */}
                <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                    <SettingSection title="ACCOUNT">
                        <SettingItem icon={Shield} label="Security & Privacy" color={theme.primary} />
                        <SettingItem
                            icon={theme.isDark ? Sun : Moon}
                            label="Appearance"
                            value={selectedTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                            onPress={toggleTheme}
                        />
                        <SettingItem icon={Globe} label="Language" value="English" />
                    </SettingSection>
                </Animated.View>

                {/* Support & Community */}
                <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                    <SettingSection title="SUPPORT & COMMUNITY">
                        <SettingItem icon={Heart} label="Support Us" color={theme.negative} />
                        <SettingItem icon={Share2} label="Share KINDRED" />
                        <SettingItem icon={Github} label="Source Code" value="v9.0.0" />
                        <SettingItem icon={Globe} label="Website" value="kindred.fi" />
                    </SettingSection>
                </Animated.View>

                {/* About Section */}
                <Animated.View entering={FadeInDown.delay(400).duration(500)}>
                    <SettingSection title="ABOUT">
                        <SettingItem icon={Info} label="Version" value="9.0.0" />
                        <SettingItem
                            icon={LogOut}
                            label="Logout"
                            color={theme.negative}
                            onPress={() => {
                                console.log('[Settings] Logging out...');
                                signOut();
                            }}
                        />
                    </SettingSection>
                </Animated.View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: theme.textMuted }]}>Made with ❤️ for KINDRED Developers</Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    content: { padding: Spacing.xl },
    title: { fontSize: 32, fontWeight: '900', marginBottom: 32, letterSpacing: -1 },
    profileCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 32 },
    avatar: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
    profileName: { fontSize: 18, fontWeight: '700' },
    profileStatus: { fontSize: 13, fontWeight: '600', marginTop: 2 },
    section: { marginBottom: 32 },
    sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 16, marginLeft: 4 },
    sectionContent: { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
    settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
    settingMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconContainer: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    settingLabel: { fontSize: 15, fontWeight: '600' },
    settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    settingValue: { fontSize: 14, fontWeight: '500' },
    footer: { marginTop: 8, alignItems: 'center' },
    footerText: { fontSize: 12, fontWeight: '500' }
});
