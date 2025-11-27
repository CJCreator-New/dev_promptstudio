import { useState, useEffect } from 'react';
import { useOfflineStore } from '../store/offlineStore';

/**
 * Detects online/offline status and manages operation queue
 * @returns Object with online status and sync function
 */
export const useOffline = () => {
  const { isOnline, setOnline, getPendingOperations, markSynced } = useOfflineStore();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      syncPendingOperations();
    };

    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  const syncPendingOperations = async () => {
    const pending = getPendingOperations();
    if (pending.length === 0) return;

    setIsSyncing(true);
    
    for (const op of pending) {
      try {
        // Sync operation (placeholder for actual sync logic)
        await new Promise(resolve => setTimeout(resolve, 100));
        markSynced(op.id!);
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
    
    setIsSyncing(false);
  };

  return { isOnline, isSyncing, syncPendingOperations };
};
