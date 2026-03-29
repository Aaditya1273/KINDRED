/**
 * KINDRED Agent Common Types
 * Breaking circular dependencies by centralizing types.
 */

export type AgentLog = {
    action: string;
    status: 'Success' | 'Verified' | 'Signed' | 'Pinned' | 'Error';
    message: string;
    timestamp: number;
    txHash?: string;
    cid?: string;
};

export type AgentCondition = {
    type: 'APR_THRESHOLD' | 'PRICE_BELOW' | 'PRICE_ABOVE' | 'SLIPPAGE_CHECK';
    asset: string;
    threshold: number;
    usePrivacy?: boolean; // Zama FHEVM toggle
};

export type AgentAction = {
    id: string;
    condition: AgentCondition;
    action: 'DEPOSIT' | 'WITHDRAW' | 'REBALANCE' | 'HEDGE';
    amount: number;
    status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'SKIPPED' | 'FAILED';
    timestamp: number;
    txHash?: string;
    reason?: string;
};

export type AgentStatus = 'idle' | 'running' | 'error';
