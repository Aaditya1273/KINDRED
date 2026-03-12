import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AgentLogsScreen } from '../screens/AgentLogsScreen';
import { PortfolioScreen } from '../screens/PortfolioScreen';

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Dashboard: undefined;
    Portfolio: undefined;
    AgentLogs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'fade_from_bottom'
                }}
            >
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="AgentLogs" component={AgentLogsScreen} />
                <Stack.Screen name="Portfolio" component={PortfolioScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
