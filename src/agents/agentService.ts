export interface AgentLog {
    timestamp: string;
    action: string;
    decision: string;
    verification_hash: string;
    status: 'executed' | 'scheduled' | 'failed';
}

export const agentService = {
    getLatestLogs: (): AgentLog[] => {
        return [
            {
                timestamp: new Date().toISOString(),
                action: "Yield Optimization",
                decision: "I attempted to swap on Flow, but slippage was too high (0.8%), so I moved the task to a scheduled window 2 hours from now.",
                verification_hash: "0xabc...123",
                status: 'scheduled'
            },
            {
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                action: "Risk Assessment",
                decision: "Portfolio health checked. All assets within safety guardrails.",
                verification_hash: "0xdef...456",
                status: 'executed'
            }
        ];
    },

    logAction: async (log: AgentLog) => {
        // This is where we would upload to Storacha
        console.log('Uploading log to Storacha:', log);
        return { success: true, cid: 'bafy...' };
    }
};
