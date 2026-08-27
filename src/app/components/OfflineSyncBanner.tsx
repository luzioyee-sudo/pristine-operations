// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, RefreshCw, CheckCircle2, CloudUpload } from 'lucide-react';
import { offlineSyncManager } from '../utils/offlineSyncQueue';

export const OfflineSyncBanner: React.FC = () => {
  const [syncState, setSyncState] = useState({
    isOnline: true,
    pendingCount: 0,
    isSyncing: false,
    lastSyncedAt: undefined as number | undefined,
  });
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  useEffect(() => {
    let previousPending = 0;
    const unsubscribe = offlineSyncManager.subscribe((state) => {
      if (previousPending > 0 && state.pendingCount === 0 && state.isOnline) {
        setShowSyncSuccess(true);
        const timer = setTimeout(() => setShowSyncSuccess(false), 4000);
        return () => clearTimeout(timer);
      }
      previousPending = state.pendingCount;
      setSyncState(state);
    });

    return () => unsubscribe();
  }, []);

  const { isOnline, pendingCount, isSyncing } = syncState;

  // Don't render if online, no pending items, and no recent sync success alert
  if (isOnline && pendingCount === 0 && !isSyncing && !showSyncSuccess) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed bottom-5 end-5 z-50 max-w-sm pointer-events-auto">
        {/* Offline Banner */}
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="p-3.5 px-4 rounded-2xl bg-stone-900/95 dark:bg-stone-800/95 backdrop-blur-md text-white border border-stone-700/60 shadow-xl flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <WifiOff className="w-4 h-4" />
            </div>
            <div className="flex-1 text-xs">
              <div className="font-bold flex items-center gap-1.5">
                <span>Working Offline</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 text-[10px] font-mono">
                    {pendingCount} queued
                  </span>
                )}
              </div>
              <p className="text-stone-300 text-[11px] leading-tight mt-0.5">
                Assets cached. Updates will sync automatically when back online.
              </p>
            </div>
          </motion.div>
        )}

        {/* Syncing Queue Banner */}
        {isOnline && isSyncing && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="p-3.5 px-4 rounded-2xl bg-amber-950/90 dark:bg-amber-900/90 backdrop-blur-md text-amber-100 border border-amber-800/60 shadow-xl flex items-center gap-3"
          >
            <RefreshCw className="w-4 h-4 animate-spin text-amber-300 shrink-0" />
            <div className="flex-1 text-xs">
              <div className="font-bold text-amber-200">Syncing Connection...</div>
              <p className="text-amber-300/80 text-[11px] leading-tight mt-0.5">
                Uploading {pendingCount} offline update{pendingCount > 1 ? 's' : ''} to cloud storage.
              </p>
            </div>
          </motion.div>
        )}

        {/* Sync Success Banner */}
        {isOnline && !isSyncing && showSyncSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="p-3.5 px-4 rounded-2xl bg-emerald-950/90 dark:bg-emerald-900/90 backdrop-blur-md text-emerald-100 border border-emerald-800/60 shadow-xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
            <div className="flex-1 text-xs">
              <div className="font-bold text-emerald-200">All Updates Synced</div>
              <p className="text-emerald-300/80 text-[11px] leading-tight mt-0.5">
                Offline changes have been safely synchronized to your account.
              </p>
            </div>
          </motion.div>
        )}

        {/* Manual Sync Trigger if pending items while online */}
        {isOnline && !isSyncing && pendingCount > 0 && !showSyncSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="p-3 px-3.5 rounded-2xl bg-stone-900/95 text-white border border-stone-700 shadow-xl flex items-center gap-2.5 cursor-pointer hover:bg-black transition-colors"
            onClick={() => offlineSyncManager.processOfflineQueue()}
          >
            <CloudUpload className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold">
              Sync {pendingCount} Pending Change{pendingCount > 1 ? 's' : ''}
            </span>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
