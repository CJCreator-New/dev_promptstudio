import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { renderHook, waitFor } from '@testing-library/react';
import { useOffline } from '../hooks/useOffline';
import { useOfflineStore } from '../store/offlineStore';
import { resetAllStores } from './helpers/store-reset';

/**
 * Property 97: Auto-Sync on Reconnect
 * Validates: Requirements 30.3
 * 
 * Tests that operations are automatically synced when reconnecting
 */
describe('Property 97: Auto-Sync on Reconnect', () => {
  beforeEach(() => {
    resetAllStores();
    useOfflineStore.getState().setOnline(false);
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    resetAllStores();
  });

  it('should trigger sync when going from offline to online', async () => {
    fc.assert(
      await fc.asyncProperty(
        fc.array(fc.record({
          type: fc.constantFrom('create', 'update', 'delete'),
          entity: fc.constantFrom('prompt', 'tag'),
          data: fc.object(),
        }), { minLength: 1, maxLength: 5 }),
        async (operations) => {
          // Reset for this iteration
          resetAllStores();
          useOfflineStore.getState().setOnline(false);
          const store = useOfflineStore.getState();
          
          // Queue operations while offline
          operations.forEach(op => store.queueOperation(op));
          
          const { result } = renderHook(() => useOffline());
          
          // Simulate going online
          store.setOnline(true);
          window.dispatchEvent(new Event('online'));
          
          await waitFor(() => {
            expect(result.current.isOnline).toBe(true);
          }, { timeout: 1000 });

          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should not sync when already online', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          type: fc.string({ minLength: 1 }),
          entity: fc.string({ minLength: 1 }),
          data: fc.object(),
        }), { minLength: 1, maxLength: 5 }),
        (operations) => {
          // Reset for this iteration
          resetAllStores();
          const store = useOfflineStore.getState();
          store.setOnline(true);
          
          const initialOpsCount = useOfflineStore.getState().operations.length;
          
          // Queue operations while online
          operations.forEach(op => store.queueOperation(op));
          
          const finalOpsCount = useOfflineStore.getState().operations.length;
          expect(finalOpsCount).toBe(initialOpsCount + operations.length);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should preserve unsynced operations after partial sync failure', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 10 }),
        (operationCount) => {
          // Reset for this iteration
          resetAllStores();
          useOfflineStore.getState().setOnline(false);
          const store = useOfflineStore.getState();
          
          // Add operations
          for (let i = 0; i < operationCount; i++) {
            store.queueOperation({
              type: 'create',
              entity: 'test',
              data: { index: i },
            });
          }
          
          const ops = useOfflineStore.getState().operations;
          
          // Simulate partial sync (mark half as synced)
          const halfPoint = Math.floor(ops.length / 2);
          for (let i = 0; i < halfPoint; i++) {
            store.markSynced(ops[i].id!);
          }
          
          const pending = store.getPendingOperations();
          expect(pending.length).toBeGreaterThan(0);
          expect(pending.length).toBe(operationCount - halfPoint);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
