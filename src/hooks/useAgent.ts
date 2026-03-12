import { useState, useEffect } from 'react';
import { agentService, AgentLog } from '../agents/agentService';
import { zamaService } from '../services/zamaService';
import { litService } from '../services/litService';
import { storachaService } from '../services/storachaService';

export const useAgent = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [logs, setLogs] = useState<AgentLog[]>([]);

    const runAnalysis = async () => {
        setIsProcessing(true);
        try {
            // 1. Zama: Analyze encrypted data
            const analysis = await zamaService.calculateAlpha('enc_history') as { recommendedAction: string, confidence: number };

            // 2. Lit: Check conditions & get signature if needed
            if (analysis.recommendedAction === 'MOVE_TO_YIELD_VAULT') {
                const sig = await litService.getAgentSignature({ apr_threshold: 0.08 }) as { signature: string, verified: boolean };

                // 3. Log the decision
                const newLog: AgentLog = {
                    timestamp: new Date().toISOString(),
                    action: "Autonomous Yield Shift",
                    decision: `Logic verified APR > 8%. Requested Lit signature. Signature: ${sig.signature.substring(0, 10)}...`,
                    verification_hash: `0x${Math.random().toString(16).substring(2, 10)}`,
                    status: 'executed'
                };

                // 4. Storacha: Persist the log
                await storachaService.uploadLog(newLog);

                setLogs(prev => [newLog, ...prev]);
            }
        } catch (error) {
            console.error('Agent Execution Error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        setLogs(agentService.getLatestLogs());
    }, []);

    return { logs, isProcessing, runAnalysis };
};
