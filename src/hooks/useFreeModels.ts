import { useState, useEffect } from 'react';
import { getCachedFreeModels } from '../services/openRouterSync';

interface FreeModel {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  modalities: string[];
  isFreeVariant: boolean;
}

export function useFreeModels() {
  const [models, setModels] = useState<FreeModel[]>([]);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  useEffect(() => {
    const cached = getCachedFreeModels();
    if (cached) {
      setModels(cached.models);
      setLastSynced(cached.lastSyncedAt);
    }

    // Listen for storage changes (sync from other tabs)
    const handleStorage = () => {
      const updated = getCachedFreeModels();
      if (updated) {
        setModels(updated.models);
        setLastSynced(updated.lastSyncedAt);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { models, lastSynced };
}
