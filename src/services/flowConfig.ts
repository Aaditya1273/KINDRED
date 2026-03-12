import { config } from '@onflow/fcl';

config()
    .put('app.detail.title', 'KINDRED')
    .put('app.detail.icon', 'https://raw.githubusercontent.com/Aaditya1273/KINDRED/main/logo.png')
    .put('accessNode.api', 'https://rest-testnet.onflow.org')
    .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
    .put('flow.network', 'testnet');

export const flowConfig = {
    testnet: {
        accessNode: 'https://rest-testnet.onflow.org',
        discoveryWallet: 'https://fcl-discovery.onflow.org/testnet/authn',
    }
};
