import KindredAgentRegistry from 0xaf83ba759d6fff9e

transaction(agentID: String, metadataURI: String) {
    prepare(signer: AuthAccount) {
        // Register the agent and receive the Identity Resource
        let identity <- KindredAgentRegistry.registerAgent(
            agentID: agentID,
            metadataURI: metadataURI,
            owner: signer.address
        )

        // Save the identity resource to the signer's storage
        signer.save(<-identity, to: /storage/KindredAgentIdentity)
        
        // Publish a public link to the identity (optional, for discovery)
        signer.link<&KindredAgentRegistry.AgentSelfSovereignIdentity>(
            /public/KindredAgentIdentity,
            target: /storage/KindredAgentIdentity
        )
    }
}
