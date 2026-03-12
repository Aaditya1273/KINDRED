import * as LocalAuthentication from 'expo-local-authentication';

export const authService = {
    async isBiometricAvailable() {
        return await LocalAuthentication.hasHardwareAsync() && await LocalAuthentication.isEnrolledAsync();
    },

    async authenticate() {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
            return { success: true, message: 'Biometrics not available, bypassing for demo.' };
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to access KINDRED',
            fallbackLabel: 'Use Passcode',
            disableDeviceFallback: false,
        });

        return {
            success: result.success,
            message: result.success ? 'Authenticated' : 'Authentication failed',
        };
    },
};
