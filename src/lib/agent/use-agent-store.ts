/**
 * KINDRED Agent Store
 * Central Zustand store for agent state, portfolio, and transaction history.
 */

import { create } from 'zustand';
import { createSelectors } from '@/lib/utils';
import { runAgentCycle } from './lit-agent';
import { saveAgentLogs, loadAgentLogs, getLatestCID } from './storacha-memory';
import { fetchPortfolio, type PortfolioData } from './portfolio';
import { fetchTransactions, type Transaction } from './transactions';
import { type AgentLog, type AgentStatus } from './agent-types';

type AgentState = {
  logs: AgentLog[];
  portfolio: PortfolioData | null;
  transactions: Transaction[];
  status: AgentStatus;
  latestCID: string;
  lastRun: number | null;
  error: string | null;
  worldIDProof: any | null;
  isPaused: boolean;
  isWorldIDVerified: boolean;

  runCycle: (address: string) => Promise<void>;
  addLog: (log: AgentLog) => void;
  setWorldIDProof: (proof: any) => void;
  setWorldIDVerified: (verified: boolean) => void;
  togglePause: () => void;
  loadMemory: () => void;
  refreshPortfolio: (address: string) => Promise<void>;
  refreshTransactions: (address: string) => Promise<void>;
};

const DEFAULT_ACTIONS = [
  {
    condition: { type: 'APR_THRESHOLD' as const, asset: 'USDC/FLOW', threshold: 0.08 },
    action: 'DEPOSIT' as const,
    amount: 500,
  },
  {
    condition: { type: 'PRICE_BELOW' as const, asset: 'ETH', threshold: 3000 },
    action: 'HEDGE' as const,
    amount: 0.1,
  },
  {
    condition: { type: 'SLIPPAGE_CHECK' as const, asset: 'USDC', threshold: 0.005 },
    action: 'REBALANCE' as const,
    amount: 1000,
  },
];

const _useAgentStore = create<AgentState>((set, get) => ({
  logs: [],
  portfolio: {
    totalUSD: 0,
    change24h: 0,
    yieldAPY: 0,
    lastUpdated: Date.now(),
    tokens: [],
    history: [],
  },
  transactions: [],
  status: 'idle',
  latestCID: '',
  lastRun: null,
  error: null,
  isPaused: false,
  isWorldIDVerified: false,
  worldIDProof: null,

  loadMemory: () => {
    const logs = loadAgentLogs();
    const cid = getLatestCID();
    set({ logs, latestCID: cid });
  },

  setWorldIDVerified: (verified: boolean) => {
    set({ isWorldIDVerified: verified });
  },

  togglePause: () => {
    set({ isPaused: !get().isPaused });
  },

  addLog: (log: AgentLog) => {
    set((state) => ({
      logs: [log, ...state.logs]
    }));
  },

  setWorldIDProof: (proof: any) => {
    set({ worldIDProof: proof, isWorldIDVerified: true });
  },

  runCycle: async (address: string) => {
    // Production Check: In a real-world scenario, we check the isVerified mapping 
    // on the Sepolia ConfidentialAlpha contract before allowing execution.
    if (!get().worldIDProof && process.env.NODE_ENV === 'production') {
      throw new Error('On-Chain World ID Verification required for autonomous execution.');
    }
    set({ status: 'running', error: null });
    try {
      const newLogs = await runAgentCycle(DEFAULT_ACTIONS);
      const cid = await saveAgentLogs(newLogs);
      const allLogs = [...newLogs, ...get().logs].slice(0, 50);
      set({ logs: allLogs, latestCID: cid, status: 'idle', lastRun: Date.now() });

      // Refresh portfolio after cycle
      await get().refreshPortfolio(address);
    } catch (e: any) {
      set({ status: 'error', error: e?.message ?? 'Agent cycle failed' });
    }
  },

  refreshPortfolio: async (address: string) => {
    try {
      const portfolio = await fetchPortfolio(address);
      set({ portfolio });
    } catch {
      // silently fail — cached data remains
    }
  },

  refreshTransactions: async (address: string) => {
    try {
      const transactions = await fetchTransactions(address);
      set({ transactions });
    } catch {
      // silently fail
    }
  },
}));

export const useAgentStore = createSelectors(_useAgentStore);
