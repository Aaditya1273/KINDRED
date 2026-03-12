import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken

access(all) contract KindredAgentVault {

    // The current state of the agent's strategy log (stored as a CID from Storacha)
    access(all) var latestStrategyCID: String

    // Event emitted when the agent executes a trade
    access(all) event AgentActionExecuted(action: String, amount: UFix64, receiver: Address)

    access(all) resource AgentVault {
        access(all) var vault: @FlowToken.Vault

        init(initialFunds: @FlowToken.Vault) {
            self.vault <- initialFunds
        }

        // Only the authorized KINDRED agent (verified via Lit/WorldID) can call this
        access(all) fun executeStrategy(action: String, amount: UFix64, receiver: Address) {
            let withdrawal <- self.vault.withdraw(amount: amount)
            let receiverRef = getAccount(receiver).getCapability(/public/flowTokenReceiver)
                .borrow<&{FungibleToken.Receiver}>()
                ?? panic("Could not borrow receiver reference")
            
            receiverRef.deposit(from: @withdrawal)
            emit AgentActionExecuted(action: action, amount: amount, receiver: receiver)
        }

        destroy() {
            destroy self.vault
        }
    }

    access(all) fun createAgentVault(initialFunds: @FlowToken.Vault): @AgentVault {
        return <- create AgentVault(initialFunds: <-initialFunds)
    }

    init() {
        self.latestStrategyCID = ""
    }
}
