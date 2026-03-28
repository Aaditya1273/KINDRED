import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        zama: {
            url: "https://devnet.zama.ai",
            accounts: ["0x246256f345678901234567890123456789012345678901234567890123456789"] // Placeholder, I'll use it for compilation check first
        },
    },
};

export default config;