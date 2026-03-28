import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import KindredAgentVault from 0xaf83ba759d6fff9e

transaction(amount: UFix64) {
    
    let signerVaultRef: auth(FungibleToken.Withdraw) &FlowToken.Vault

    prepare(signer: auth(BorrowValue, IssueStorageCapabilityController, PublishCapability, SaveValue) &Account) {
        
        self.signerVaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow a reference to the signer's FlowToken vault")

        if signer.storage.borrow<&KindredAgentVault.AgentVault>(from: /storage/KindredAgentVault) == nil {
            let initialFunds <- self.signerVaultRef.withdraw(amount: amount)
            
            let vault <- KindredAgentVault.createAgentVault(initialFunds: <-initialFunds)
            signer.storage.save(<-vault, to: /storage/KindredAgentVault)
            
            log("KINDRED Agent Vault created and funded successfully!")
        } else {
            log("Vault already exists.")
        }
    }

    execute {
    }
}
