import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Sliders, Bell } from 'lucide-react-native';
import { useAppTheme } from '@/theme/tokens';

export const AppHeader = () => {
    const theme = useAppTheme();
    return (
        <View style={styles.topHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Pressable
                    onPress={() => router.push('/portfolio')}
                    style={[styles.profileCircle, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}
                >
                    <BlurView intensity={Platform.OS === 'web' ? 10 : 20} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    <View style={{ width: '100%', height: '100%', backgroundColor: theme.primary + '20' }} />
                </Pressable>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Pressable
                    onPress={() => router.push('/data-control')}
                    style={[styles.controlBtn, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}
                >
                    <BlurView intensity={Platform.OS === 'web' ? 15 : 25} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    <Sliders size={20} color={theme.textPrimary} />
                </Pressable>
                <Pressable style={[styles.controlBtn, { borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
                    <BlurView intensity={Platform.OS === 'web' ? 15 : 25} tint={theme.isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
                    <Bell size={20} color={theme.textPrimary} />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    profileCircle: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden', borderWidth: 1 },
    controlBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, overflow: 'hidden' },
});
