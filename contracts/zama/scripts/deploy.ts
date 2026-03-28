import { hre } from "hardhat";

async function main() {
    const confidentialAlpha = await hre.viem.deployContract("ConfidentialAlpha");

    console.log(
        `ConfidentialAlpha deployed to ${confidentialAlpha.address}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
