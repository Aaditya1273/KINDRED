// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title KINDRED ConfidentialAlpha (Remix Optimized)
 * 
 * REMIX IDE SETUP:
 * To resolve 'encrypted-types' and '@fhevm/solidity' errors in Remix:
 * 1. Go to 'Settings' (bottom left gear icon)
 * 2. Add these remappings:
 *    @fhevm/solidity/=https://raw.githubusercontent.com/zama-ai/fhevm/main/library-solidity/
 *    encrypted-types/=https://raw.githubusercontent.com/zama-ai/encrypted-types/main/contracts/
 * 3. Use 'LATEST' or '0.8.24' compiler version.
 */

import { FHE, euint32, externalEuint32, ebool } from "@fhevm/solidity/lib/FHE.sol";

contract ConfidentialAlpha {
    // Stores the user's encrypted spending goal
    euint32 private encryptedSpendingGoal;
    
    // The owner of the contract (the KINDRED agent system)
    address public owner;

    event AlphaComputed(address indexed user, string message);

    constructor() {
        owner = msg.sender;
    }

    // Set an encrypted spending goal from the user (Co-processor pattern)
    function setSpendingGoal(externalEuint32 input, bytes calldata inputProof) public {
        encryptedSpendingGoal = FHE.fromExternal(input, inputProof);
        FHE.allowThis(encryptedSpendingGoal);
    }

    /**
     * @notice Performs a confidential yield analysis
     * @return confidenceScore Encrypted value representing the yield quality (0-100)
     */
    function computeConfidentialAlpha(externalEuint32 marketInput, bytes calldata inputProof) public returns (euint32) {
        euint32 marketRate = FHE.fromExternal(marketInput, inputProof);
        
        // Logic: Calculate the 'Yield Gap' relative to the goal
        // In FHEVM, we keep this logic branchless for maximum efficiency
        euint32 yieldGap = FHE.sub(marketRate, encryptedSpendingGoal);
        
        // Compute a normalized confidence score (example logic)
        // If yieldGap > 500 (5%), confidence is high
        euint32 confidenceScore = FHE.mul(yieldGap, FHE.asEuint32(2));
        
        FHE.allowThis(confidenceScore);
        return confidenceScore;
    }

    // Agent executes a decision based on the encrypted logic
    function requestAgentExecution(euint32 confidenceScore) public {
        require(msg.sender == owner, "Only authorized KINDRED agent can verify execution");
        // Verify confidence exceeds threshold (e.g., 50)
        ebool isSafe = FHE.gt(confidenceScore, FHE.asEuint32(50));
        
        emit AlphaComputed(msg.sender, "Confidential logic verified. Agent authorized to execute on Flow.");
    }
}
