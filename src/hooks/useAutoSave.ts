import { useState, useEffect, useRef, useCallback } from 'react';
import { db } from '../utils/db';
import { EnhancementOptions } from '../types';
import { logger } from '../utils/errorLogging';

/** Status of the auto-save operation */
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/** Maximum retry attempts for failed saves */
const MAX_RETRY_ATTEMPTS = 3;
/** Base delay for exponential backoff retry */
const RETRY_DELAY = 1000;
/** Debounce delay before triggering save (2 seconds) */
const DEBOUNCE_DELAY = 2000;

/**
 * Auto-saves user input to IndexedDB with debouncing and retry logic
 * @param input - Current prompt input text
 * @param options - Enhancement options to save with draft
 * @returns Object with save status, last saved timestamp, and retry count
 * @example
 * const { status, lastSaved } = useAutoSave(promptText, options);
 */
export const useAutoSave = (input: string, options: EnhancementOptions) => {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const debouncedSave = useRef<NodeJS.Timeout | null>(null);
  const retryCount = useRef(0);

  /**
   * Maintains only the 10 most recent drafts by deleting older ones
   * Prevents unbounded growth of draft storage
   */
  const cleanupDrafts = async () => {
    const count = await db.drafts.count();
    if (count > 10) {
      const deleteCount = count - 10;
      const oldestDrafts = await db.drafts.orderBy('timestamp').limit(deleteCount).toArray();
      const keysToDelete = oldestDrafts.map(draft => draft.id).filter(Boolean);
      if (keysToDelete.length > 0) {
        await db.drafts.bulkDelete(keysToDelete);
      }
    }
  };

  /**
   * Saves draft with exponential backoff retry on failure
   * @param attempt - Current retry attempt number
   */
  const saveDraftWithRetry = useCallback(async (attempt = 0): Promise<void> => {
    if (!input.trim()) return;

    try {
      const draft = {
        input,
        options,
        timestamp: Date.now()
      };

      await db.drafts.add(draft);
      await cleanupDrafts();
      
      setLastSaved(Date.now());
      setStatus('saved');
      retryCount.current = 0;
    } catch (error: any) {
      logger.error(error, { context: 'AutoSave', attempt });
      
      if (attempt < MAX_RETRY_ATTEMPTS) {
        retryCount.current = attempt + 1;
        setTimeout(() => {
          saveDraftWithRetry(attempt + 1);
        }, RETRY_DELAY * Math.pow(2, attempt));
      } else {
        setStatus('error');
        retryCount.current = 0;
      }
    }
  }, [input, options]);

  // Debounced save on changes (exactly 2s)
  useEffect(() => {
    if (!input.trim()) {
      setStatus('idle');
      return;
    }

    setStatus('saving');
    
    if (debouncedSave.current) {
      clearTimeout(debouncedSave.current);
    }

    debouncedSave.current = setTimeout(() => {
      saveDraftWithRetry();
    }, DEBOUNCE_DELAY);

    return () => {
      if (debouncedSave.current) {
        clearTimeout(debouncedSave.current);
      }
    };
  }, [input, options, saveDraftWithRetry]);

  return { status, lastSaved, retryCount: retryCount.current };
};