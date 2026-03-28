import KindredAgentVault from 0xaf83ba759d6fff9e

access(all) struct VaultBalances {
    access(all) let idleBalance: UFix64
    access(all) let yieldBalance: UFix64
    access(all) let currentAPY: UFix64

    init(idleBalance: UFix64, yieldBalance: UFix64, currentAPY: UFix64) {
        self.idleBalance = idleBalance
        self.yieldBalance = yieldBalance
        self.currentAPY = currentAPY
    }
}

access(all) fun main(address: Address): VaultBalances {
    let account = getAccount(address)

    let vaultRef = account.storage.borrow<&KindredAgentVault.AgentVault>(from: /storage/KindredAgentVault)
        ?? panic("Could not borrow reference to the Agent Vault")

    return VaultBalances(
        idleBalance: vaultRef.idleVault.balance,
        yieldBalance: vaultRef.yieldVault.balance,
        currentAPY: vaultRef.currentAPY
    )
}
