require("@nomicfoundation/hardhat-toolbox-viem");
require("@fhevm/hardhat-plugin");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.24",
    networks: {
        sepolia: {
            url: "https://eth-sepolia.public.blastapi.io",
            accounts: {
                mnemonic: "afraid behave yard gospel amateur dad observe hip antique sea heart cliff",
                path: "m/44'/60'/0'/0",
                initialIndex: 0,
                count: 1,
            },
            zamaGatewayUrl: "https://gateway.sepolia.zama.ai/",
            zamaRelayerUrl: "https://relayer.testnet.zama.cloud/",
        },
    },
};
