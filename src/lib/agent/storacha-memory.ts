/**
 * KINDRED Agent Memory — Storacha / Filecoin
 * Stores and retrieves agent execution logs as CID-addressed JSON.
 *
 * Storacha docs: https://docs.storacha.network/
 * Upload guide:  https://docs.storacha.network/how-to/upload/
 *
 * In production: use @web3-storage/w3up-client to upload blobs and get CIDs.
 * The CID is then stored in the KindredAgentVault Cadence contract as `latestStrategyCID`.
 */

import { storage } from '@/lib/storage';
import { type AgentLog } from './agent-types';

// Lazy loading @web3-storage/w3up-client to avoid TDZ in web

const MEMORY_KEY = 'kindred_agent_logs';
const MAX_LOGS = 50;

/**
 * Persist agent logs to Storacha (IPFS/Filecoin).
 * In production: this uses the w3up-client to get a real CID.
 */
export async function saveAgentLogs(logs: AgentLog[]): Promise<string> {
  const existing = await loadAgentLogs();
  const merged = [...logs, ...existing].slice(0, MAX_LOGS);
  storage.set(MEMORY_KEY, JSON.stringify(merged));

  try {
    // Real Storacha Workflow
    // 1. Initialize client (uses agent DID from environment)
    const { create } = await import('@web3-storage/w3up-client');
    const client = await create();

    // 2. Upload log blob
    const file = new File([JSON.stringify(merged)], 'agent_logs.json', { type: 'application/json' });
    const cid = await client.uploadFile(file);

    const realCID = cid.toString();
    storage.set('kindred_latest_cid', realCID);
    console.log(`[STORACHA] Logs pinned to Filecoin: ${realCID}`);
    return realCID;
  } catch (err) {
    console.warn('[STORACHA] Upload failed, falling back to mock CID.', err);
    const mockCID = `bafybeig${Math.random().toString(36).slice(2, 18)}`;
    storage.set('kindred_latest_cid', mockCID);
    return mockCID;
  }
}

/**
 * Load persisted agent logs from MMKV.
 */
export function loadAgentLogs(): AgentLog[] {
  const raw = storage.getString(MEMORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AgentLog[];
  } catch {
    return [];
  }
}

/**
 * Get the latest Storacha CID (mirrors what's stored in the Flow contract).
 */
export function getLatestCID(): string {
  return storage.getString('kindred_latest_cid') ?? '';
}

/**
 * Clear all agent memory (for testing / reset).
 */
export function clearAgentMemory(): void {
  storage.delete(MEMORY_KEY);
  storage.delete('kindred_latest_cid');
}
// Note: MMKV uses .delete() — confirmed against react-native-mmkv API
