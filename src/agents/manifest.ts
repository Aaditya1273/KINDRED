export interface AgentManifest {
    agent_id: string;
    capabilities: string[];
    safety_guardrails: {
        max_slippage: number;
        max_daily_drawdown: number;
    };
}

export const defaultManifest: AgentManifest = {
    agent_id: "kindred-alpha-01",
    capabilities: ["yield_optimization", "risk_assessment"],
    safety_guardrails: {
        max_slippage: 0.005,
        max_daily_drawdown: 0.02
    }
};
