import KindredAgentVault from 0xaf83ba759d6fff9e

transaction(amount: UFix64, strategyCID: String) {
    
    let agentVaultRef: auth(KindredAgentVault.Optimize) &KindredAgentVault.AgentVault

    prepare(signer: auth(BorrowValue) &Account) {
        self.agentVaultRef = signer.storage.borrow<auth(KindredAgentVault.Optimize) &KindredAgentVault.AgentVault>(from: /storage/KindredAgentVault)
            ?? panic("Could not borrow reference to KindredAgentVault")
    }

    execute {
        // Execute the Auto-Yield optimization
        self.agentVaultRef.optimizeYield(amount: amount, strategyCID: strategyCID)
        log("Yield Optimization Executed Successfully!")
    }
}
