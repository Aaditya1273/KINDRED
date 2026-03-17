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

  // Production: replace with real Flowscan API call
  // const res = await fetch(`https://evm.flowscan.io/api?module=account&action=txlist&address=${address}`)
  const txs = generateMockTransactions(address);

  storage.set(TX_CACHE_KEY, JSON.stringify({ address, txs, ts: Date.now() }));
  return txs;
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

function generateMockTransactions(address: string): Transaction[] {
  const seed = parseInt(address.slice(2, 8), 16);
  const types: Transaction['type'][] = ['DEPOSIT', 'WITHDRAW', 'SWAP', 'YIELD', 'AGENT'];
  const assets = ['ETH', 'USDC', 'FLOW', 'BTC'];

  return Array.from({ length: 12 }, (_, i) => {
    const type = types[(seed + i) % types.length];
    const asset = assets[(seed + i) % assets.length];
    const amount = parseFloat(((seed % 10 + i * 0.3) * 0.1).toFixed(4));
    return {
      hash: `0x${(seed + i).toString(16).padStart(40, '0')}`,
      type,
      asset,
      amount,
      usdValue: amount * (asset === 'ETH' ? 3420 : asset === 'BTC' ? 67500 : asset === 'FLOW' ? 0.72 : 1),
      status: i === 0 ? 'pending' : 'confirmed',
      timestamp: Date.now() - i * 3_600_000,
      from: address,
      to: `0x${(seed * 2 + i).toString(16).padStart(40, '0')}`,
      blockNumber: 18_000_000 - i * 10,
    };
  });
}
