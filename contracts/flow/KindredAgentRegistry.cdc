/**
 * KindredAgentRegistry.cdc
 * 
 * A Flow-native implementation of the ERC-8004 Identity Registry.
 * It allows agents to register their metadata CIDs and capabilities on-chain.
 */

access(all) contract KindredAgentRegistry {

    // Event emitted when a new agent is registered
    access(all) event AgentRegistered(agentID: String, owner: Address, metadataURI: String)
    
    // Event emitted when agent metadata is updated
    access(all) event MetadataUpdated(agentID: String, newMetadataURI: String)

    // Struct to represent an Agent's on-chain identity record
    access(all) struct AgentRecord {
        access(all) let agentID: String
        access(all) let owner: Address
        access(all) var metadataURI: String
        access(all) let createdAt: UFix64

        init(agentID: String, owner: Address, metadataURI: String) {
            self.agentID = agentID
            self.owner = owner
            self.metadataURI = metadataURI
            self.createdAt = getCurrentBlock().timestamp
        }

        access(contract) fun setMetadataURI(newURI: String) {
            self.metadataURI = newURI
        }
    }

    // Mapping of AgentID to their Record
    access(self) var registry: {String: AgentRecord}

    // Resource that grants permission to update an agent's record
    access(all) resource AgentSelfSovereignIdentity {
        access(all) let agentID: String

        init(agentID: String) {
            self.agentID = agentID
        }

        access(all) fun updateMetadata(newURI: String) {
            if let record = KindredAgentRegistry.registry[self.agentID] {
                record.setMetadataURI(newURI: newURI)
                KindredAgentRegistry.registry[self.agentID] = record
                emit MetadataUpdated(agentID: self.agentID, newMetadataURI: newURI)
            }
        }
    }

    // Public function to register an agent and receive an Identity Resource
    access(all) fun registerAgent(agentID: String, metadataURI: String, owner: Address): @AgentSelfSovereignIdentity {
        pre {
            self.registry[agentID] == nil: "Agent ID already registered"
        }

        let record = AgentRecord(agentID: agentID, owner: owner, metadataURI: metadataURI)
        self.registry[agentID] = record
        
        emit AgentRegistered(agentID: agentID, owner: owner, metadataURI: metadataURI)
        
        return <- create AgentSelfSovereignIdentity(agentID: agentID)
    }

    // Public function to get an agent's record
    access(all) fun getAgent(agentID: String): AgentRecord? {
        return self.registry[agentID]
    }

    init() {
        self.registry = {}
    }
}
