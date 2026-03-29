/**
 * KINDRED Transaction History
 * Fetches on-chain tx history from Flow EVM block explorer API.
 *
 * Flow Testnet Explorer: https://evm-testnet.flowscan.io
 * Flow Mainnet Explorer: https://evm.flowscan.io
 */

import { storage } from '@/lib/storage';

export type Transaction = {
  hash: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'SWAP' | 'YIELD' | 'AGENT';
  asset: string;
  amount: number;
  usdValue: number;
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: number;
  from: string;
  to: string;
  blockNumber?: number;
};

const TX_CACHE_KEY = 'kindred_transactions';
const CACHE_TTL_MS = 30_000;

/**
 * Fetch transaction history for an address.
 * Production: use Flowscan API or etherscan-compatible endpoint on Flow EVM.
 * Flow EVM explorer API: https://evm.flowscan.io/api?module=account&action=txlist&address=...
 */
export async function fetchTransactions(address: string): Promise<Transaction[]> {
  const cached = storage.getString(TX_CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached) as { address: string; txs: Transaction[]; ts: number };
    if (parsed.address === address && Date.now() - parsed.ts < CACHE_TTL_MS) {
      return parsed.txs;
    }
  }

  try {
    // Flow EVM Testnet Explorer API
    const url = `https://evm-testnet.flowscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=latest&sort=desc`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

    if (!res.ok) throw new Error('Flowscan API Unavailable');

    const data = await res.json();
    if (data.status !== '1') throw new Error(data.message || 'API Error');

    const txs: Transaction[] = data.result.map((tx: any) => ({
      hash: tx.hash,
      type: tx.to?.toLowerCase() === address.toLowerCase() ? 'DEPOSIT' : 'AGENT',
      asset: 'FLOW', // Default for native txs
      amount: parseFloat(tx.value) / 1e18,
      usdValue: (parseFloat(tx.value) / 1e18) * 0.72,
      status: tx.isError === '0' ? 'confirmed' : 'failed',
      timestamp: parseInt(tx.timeStamp) * 1000,
      from: tx.from,
      to: tx.to,
      blockNumber: parseInt(tx.blockNumber),
    }));

    storage.set(TX_CACHE_KEY, JSON.stringify({ address, txs, ts: Date.now() }));
    return txs;
  } catch (err) {
    console.error('[TRANSACTIONS] Real fetch failed, returning empty:', err);
    // If no real history yet, we return empty instead of faking it.
    return [];
  }
}

/**
 * Append an agent-executed transaction to local history.
 * Called after Lit Protocol signs and submits a tx.
 */
export function appendAgentTransaction(tx: Transaction): void {
  const cached = storage.getString(TX_CACHE_KEY);
  const existing = cached ? JSON.parse(cached).txs as Transaction[] : [];
  const updated = [tx, ...existing].slice(0, 100);
  storage.set(TX_CACHE_KEY, JSON.stringify({ address: tx.from, txs: updated, ts: Date.now() }));
}

// Helper removed: We don't use mock generators in production.
