import { createAppKit, solana, bitcoin } from '@reown/appkit-react-native';
import { WagmiAdapter } from '@reown/appkit-wagmi-react-native';
import { SolanaAdapter, PhantomConnector, SolflareConnector } from '@reown/appkit-solana-react-native';
import { BitcoinAdapter } from '@reown/appkit-bitcoin-react-native';
import { arbitrum as arbitrumChain, mainnet as mainnetChain, polygon as polygonChain, type Chain } from '@wagmi/core/chains';
import { setStringAsync } from 'expo-clipboard';
import { storage } from './appkit-storage';


// 1. Get projectId at https://dashboard.reown.com
export const projectId = process.env.EXPO_PUBLIC_PROJECT_ID ?? 'c3e1075b6fe74686aa4935b46a229044'; // Using a fallback (hyphens removed)

// 2. Create metadata
const metadata = {
    name: 'KINDRED',
    description: 'Sovereign AI Hedge Fund',
    url: 'https://kindred.finance',
    icons: ['https://avatars.githubusercontent.com/u/179229932'],
    redirect: {
        native: 'kindred://'
    }
};

const networks = [mainnetChain, polygonChain, arbitrumChain] as [Chain, ...Chain[]];

// 3. Create adapters
export const wagmiAdapter = new WagmiAdapter({
    projectId,
    networks
});

const solanaAdapter = new SolanaAdapter();
const bitcoinAdapter = new BitcoinAdapter();

// 4. Create modal
export const appkit = createAppKit({
    projectId,
    networks: [mainnetChain, polygonChain, arbitrumChain, solana as any, bitcoin as any],
    adapters: [wagmiAdapter, solanaAdapter, bitcoinAdapter],
    extraConnectors: [new PhantomConnector(), new SolflareConnector()],
    metadata,
    clipboardClient: {
        setString: async (value: string) => {
            await setStringAsync(value);
        }
    },
    storage,
    defaultNetwork: mainnetChain,
    enableAnalytics: true
});
