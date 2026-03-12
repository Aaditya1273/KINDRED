import * as fcl from '@onflow/fcl';
import './flowConfig';

export const flowService = {
    authenticate: async () => {
        try {
            const user = await fcl.authenticate();
            return user;
        } catch (error) {
            console.error('Flow Authentication Error:', error);
            throw error;
        }
    },

    unauthenticate: () => {
        fcl.unauthenticate();
    },

    currentUser: () => {
        return fcl.currentUser();
    },

    isLoggedIn: async () => {
        const user = await fcl.currentUser().snapshot();
        return user.loggedIn;
    },

    // Future: Add methods for Scheduled Transactions and DeFi interactions
};
