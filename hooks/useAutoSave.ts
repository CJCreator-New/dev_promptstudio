import { useState, useEffect, useRef } from 'react';
import { db } from '../utils/db';
import { EnhancementOptions } from '../types';
import { logger } from '../utils/errorLogging';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export const useAutoSave = (input: string, options: EnhancementOptions) => {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const debouncedSave = useRef<any>(null);

  const saveDraft = async () => {
    if (!input.trim()) return;

    setStatus('saving');
    try {
      const draft = {
        input,
        options,
        timestamp: Date.now()
      };

      await db.drafts.add(draft);
      
      // Cleanup: Keep only last 10 drafts
      const count = await db.drafts.count();
      if (count > 10) {
        const deleteCount = count - 10;
        const keys = await db.drafts.orderBy('timestamp').limit(deleteCount).keys();
        await db.drafts.bulkDelete(keys);
      }

      setLastSaved(Date.now());
      setStatus('saved');
    } catch (error: any) {
      logger.error(error, { context: 'AutoSave' });
      setStatus('error');
    }
  };

  // Debounced save on changes (2s)
  useEffect(() => {
    if (!input) return;

    setStatus('saving'); // Optimistic visual update
    
    if (debouncedSave.current) {
      clearTimeout(debouncedSave.current);
    }

    debouncedSave.current = setTimeout(() => {
      saveDraft();
    }, 2000);

    return () => clearTimeout(debouncedSave.current);
  }, [input, options]);

  // Periodic save (30s)
  useEffect(() => {
    const interval = setInterval(() => {
        if (input.trim()) {
            saveDraft();
        }
    }, 30000);
    return () => clearInterval(interval);
  }, [input, options]);

  return { status, lastSaved };
};