import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { useOfflineStore } from '../store/offlineStore';
import { resetAllStores } from './helpers/store-reset';

/**
 * Property 96: Offline Queue
 * Validates: Requirements 30.2
 * 
 * Tests that operations are correctly queued when offline
 */
describe('Property 96: Offline Queue', () => {
  beforeEach(() => {
    resetAllStores();
    useOfflineStore.getState().setOnline(false);
  });
  
  afterEach(() => {
    resetAllStores();
  });

  it('should queue operations when offline', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          type: fc.constantFrom('create', 'update', 'delete'),
          entity: fc.constantFrom('prompt', 'tag', 'folder'),
          data: fc.object(),
        }), { minLength: 1, maxLength: 20 }),
        (operations) => {
          // Reset for this iteration
          resetAllStores();
          useOfflineStore.getState().setOnline(false);
          const store = useOfflineStore.getState();
          
          operations.forEach(op => store.queueOperation(op));
          
          const queuedOps = useOfflineStore.getState().operations;
          expect(queuedOps.length).toBe(operations.length);
          
          // Verify all operations are marked as not synced
          queuedOps.forEach(op => {
            expect(op.synced).toBe(false);
            expect(op.id).toBeDefined();
            expect(op.timestamp).toBeDefined();
          });

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should maintain operation order in queue', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          type: fc.string({ minLength: 1 }),
          entity: fc.string({ minLength: 1 }),
          data: fc.object(),
        }), { minLength: 2, maxLength: 10 }),
        (operations) => {
          // Reset for this iteration
          resetAllStores();
          useOfflineStore.getState().setOnline(false);
          const store = useOfflineStore.getState();
          
          const timestamps: number[] = [];
          operations.forEach(op => {
            store.queueOperation(op);
            timestamps.push(Date.now());
          });
          
          const queuedOps = useOfflineStore.getState().operations;
          
          // Verify chronological order
          for (let i = 1; i < queuedOps.length; i++) {
            expect(queuedOps[i].timestamp).toBeGreaterThanOrEqual(queuedOps[i - 1].timestamp);
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should correctly identify pending operations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 0, max: 10 }),
        (totalOps, syncedCount) => {
          // Reset for this iteration
          resetAllStores();
          useOfflineStore.getState().setOnline(false);
          const store = useOfflineStore.getState();
          
          // Add operations
          for (let i = 0; i < totalOps; i++) {
            store.queueOperation({
              type: 'create',
              entity: 'test',
              data: { index: i },
            });
          }
          
          // Mark some as synced
          const ops = useOfflineStore.getState().operations;
          const toSync = Math.min(syncedCount, ops.length);
          for (let i = 0; i < toSync; i++) {
            store.markSynced(ops[i].id!);
          }
          
          const pending = store.getPendingOperations();
          expect(pending.length).toBe(totalOps - toSync);
          pending.forEach(op => expect(op.synced).toBe(false));

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
