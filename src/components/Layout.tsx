import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { theme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <LinearGradient
                    colors={['#000000', '#0A0A0A', '#001A0F']}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.content}>
                        {children}
                    </View>
                </SafeAreaView>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },
});
