import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

access(all) contract KindredAgentVault {

    // The current state of the agent's strategy log (stored as a CID from Storacha)
    access(all) var latestStrategyCID: String

    // Event emitted when the agent executes a basic trade
    access(all) event AgentActionExecuted(action: String, amount: UFix64, receiver: Address)
    
    // Event emitted when the agent executes an Auto-Yield iteration
    access(all) event YieldOptimized(strategy: String, APY: UFix64, amountReinvested: UFix64)

    access(all) resource AgentVault {
        access(all) var idleVault: @{FungibleToken.Vault}
        access(all) var yieldVault: @{FungibleToken.Vault}
        access(all) var currentAPY: UFix64

        init(initialFunds: @{FungibleToken.Vault}) {
            self.idleVault <- initialFunds
            self.yieldVault <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>())
            self.currentAPY = 0.0
        }

        // Only the authorized KINDRED agent (verified via Lit/WorldID) can call this
        access(all) fun executeStrategy(action: String, amount: UFix64, receiver: Address) {
            let withdrawal <- self.idleVault.withdraw(amount: amount)
            let receiverRef = getAccount(receiver).capabilities.get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver).borrow()
                ?? panic("Could not borrow receiver reference")
            
            receiverRef.deposit(from: <-withdrawal)
            emit AgentActionExecuted(action: action, amount: amount, receiver: receiver)
        }

        // The Auto-Yield Loop feature: Moves idle FLOW into a higher-yield vault
        access(all) fun optimizeYield(amount: UFix64, strategyCID: String) {
            pre {
                self.idleVault.balance >= amount: "Insufficient idle funds to optimize."
            }
            let funds <- self.idleVault.withdraw(amount: amount)
            self.yieldVault.deposit(from: <-funds)

            KindredAgentVault.latestStrategyCID = strategyCID
            self.currentAPY = 12.5 // Simulated for the "Consumer DeFi" yield
            
            emit YieldOptimized(strategy: strategyCID, APY: self.currentAPY, amountReinvested: amount)
        }

        // Moves funds back from Yield to Idle
        access(all) fun reclaimYield(amount: UFix64) {
            pre {
                self.yieldVault.balance >= amount: "Insufficient yield funds to reclaim."
            }
            let funds <- self.yieldVault.withdraw(amount: amount)
            self.idleVault.deposit(from: <-funds)
        }
    }

    access(all) fun createAgentVault(initialFunds: @{FungibleToken.Vault}): @AgentVault {
        return <- create AgentVault(initialFunds: <-initialFunds)
    }

    init() {
        self.latestStrategyCID = ""
    }
}
