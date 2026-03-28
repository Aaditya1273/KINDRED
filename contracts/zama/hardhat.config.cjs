require("@nomicfoundation/hardhat-toolbox-viem");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.20",
    networks: {
        zama: {
            url: "https://devnet.zama.ai",
            accounts: {
                mnemonic: "afraid behave yard gospel amateur dad observe hip antique sea heart cliff",
                path: "m/44'/60'/0'/0",
                initialIndex: 0,
                count: 1,
            },
        },
    },
};
