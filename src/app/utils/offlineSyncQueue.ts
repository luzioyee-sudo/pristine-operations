// @ts-nocheck
import { getSupabase, syncToSupabase } from '../lib/supabase';
import { sanitizeForBackend } from './sanitize';

export interface QueuedSyncItem {
  id: string;
  type: 'PROGRESS_SYNC' | 'DOC_SAVE' | 'VOCAB_ADD' | 'DECK_SAVE' | 'ANNOTATION_SAVE';
  payload: any;
  timestamp: number;
}

const QUEUE_STORAGE_KEY = 'lingoflow_offline_queue_v1';
type SyncStatusCallback = (status: { isOnline: boolean; pendingCount: number; isSyncing: boolean; lastSyncedAt?: number }) => void;

class OfflineSyncQueueManager {
  private queue: QueuedSyncItem[] = [];
  private listeners: Set<SyncStatusCallback> = new Set();
  private isSyncing = false;
  private lastSyncedAt?: number;

  constructor() {
    this.loadQueueFromStorage();
    this.setupListeners();
  }

  private loadQueueFromStorage() {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) this.queue = JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to load offline sync queue:', error);
      this.queue = [];
    }
  }

  private saveQueueToStorage() {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.warn('Failed to save offline sync queue:', error);
    }
    this.notifyListeners();
  }

  private setupListeners() {
    if (typeof window === 'undefined') return;
    window.addEventListener('online', () => {
      this.notifyListeners();
      void this.processOfflineQueue();
    });
    window.addEventListener('offline', () => this.notifyListeners());
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'PROCESS_OFFLINE_QUEUE') void this.processOfflineQueue();
      });
    }
  }

  public getIsOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  public getPendingCount(): number {
    return this.queue.length;
  }

  public addToQueue(type: QueuedSyncItem['type'], payload: any) {
    const item: QueuedSyncItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      payload,
      timestamp: Date.now(),
    };
    if (type === 'PROGRESS_SYNC') this.queue = this.queue.filter((queued) => queued.type !== 'PROGRESS_SYNC');
    this.queue.push(item);
    this.saveQueueToStorage();
    if (this.getIsOnline() && !this.isSyncing) void this.processOfflineQueue();
  }

  public async processOfflineQueue(userId?: string, onBatchSuccess?: () => void) {
    if (this.queue.length === 0 || this.isSyncing || !this.getIsOnline()) return;

    const client = getSupabase();
    if (!client) return;
    const { data } = await client.auth.getUser();
    const uid = userId || data.user?.id;
    if (!uid) return;

    this.isSyncing = true;
    this.notifyListeners();
    try {
      for (const item of [...this.queue]) {
        const sanitized = sanitizeForBackend(item.payload);
        const success = await syncToSupabase(uid, {
          ...sanitized,
          id: uid,
          email: sanitized.email || data.user?.email || '',
          lastSynced: Date.now(),
        });
        if (!success) break;
        this.queue = this.queue.filter((queued) => queued.id !== item.id);
        this.saveQueueToStorage();
      }
      this.lastSyncedAt = Date.now();
      onBatchSuccess?.();
    } catch (error) {
      console.error('[OfflineSync] Queue processing error:', error);
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }
  }

  public clearQueue() {
    this.queue = [];
    this.saveQueueToStorage();
  }

  public subscribe(callback: SyncStatusCallback): () => void {
    this.listeners.add(callback);
    callback({
      isOnline: this.getIsOnline(),
      pendingCount: this.getPendingCount(),
      isSyncing: this.isSyncing,
      lastSyncedAt: this.lastSyncedAt,
    });
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    const state = {
      isOnline: this.getIsOnline(),
      pendingCount: this.getPendingCount(),
      isSyncing: this.isSyncing,
      lastSyncedAt: this.lastSyncedAt,
    };
    this.listeners.forEach((callback) => callback(state));
  }
}

export const offlineSyncManager = new OfflineSyncQueueManager();
