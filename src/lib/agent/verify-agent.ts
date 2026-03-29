import * as fcl from "@onflow/fcl";

/**
 * Verify Agent Identity (ERC-8004 Compliance)
 * This script fetches the agent's on-chain metadata URI from the Flow Registry.
 */
async function verifyAgent(agentID: string) {
    fcl.config().put("accessNode.api", "https://rest-testnet.onflow.org");

    const query = `
    import KindredAgentRegistry from 0xaf83ba759d6fff9e

    pub fun main(agentID: String): KindredAgentRegistry.AgentRecord? {
        return KindredAgentRegistry.getAgent(agentID: agentID)
    }
  `;

    try {
        const record = await fcl.query({
            cadence: query,
            args: (arg, t) => [arg(agentID, t.String)]
        });

        if (record) {
            console.log(`✅ Agent Found: ${record.agentID}`);
            console.log(`🔗 Metadata URI: ${record.metadataURI}`);
            console.log(`👑 Owner: ${record.owner}`);
            console.log(`🕒 Registered At: ${new Date(record.createdAt * 1000).toLocaleString()}`);
        } else {
            console.log("❌ Agent not found in Registry.");
        }
    } catch (err) {
        console.error("Verification Error:", err);
    }
}

// verifyAgent("kindred-alpha-001");
