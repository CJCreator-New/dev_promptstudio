import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { useVersioningStore } from '../store/versioningStore';
import { resetAllStores } from './helpers/store-reset';

/**
 * Property 10: Version Snapshot Creation
 * Validates: Requirements 4.1
 */
describe('Property 10: Version Snapshot Creation', () => {
  beforeEach(() => {
    resetAllStores();
  });

  afterEach(() => {
    resetAllStores();
  });

  it('should create version snapshots on save', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 1, maxLength: 10 }),
        (promptId, contents) => {
          resetAllStores();
          const store = useVersioningStore.getState();

          contents.forEach(content => {
            store.addVersion({ promptId, content, message: 'Test version' });
          });

          const versions = store.getVersions(promptId);
          expect(versions.length).toBe(contents.length);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 11: Version Chronological Order
 * Validates: Requirements 4.2
 */
describe('Property 11: Version Chronological Order', () => {
  beforeEach(() => {
    resetAllStores();
  });

  afterEach(() => {
    resetAllStores();
  });

  it('should maintain chronological order', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 2, max: 20 }),
        (promptId, count) => {
          resetAllStores();
          const store = useVersioningStore.getState();

          for (let i = 0; i < count; i++) {
            store.addVersion({ promptId, content: `Version ${i}`, message: `v${i}` });
          }

          const versions = store.getVersions(promptId);
          
          // Verify descending order (newest first)
          for (let i = 1; i < versions.length; i++) {
            expect(versions[i - 1].timestamp).toBeGreaterThanOrEqual(versions[i].timestamp);
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 12: Version Content Integrity
 * Validates: Requirements 4.3
 */
describe('Property 12: Version Content Integrity', () => {
  beforeEach(() => {
    resetAllStores();
  });

  afterEach(() => {
    resetAllStores();
  });

  it('should preserve exact content in versions', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.array(fc.string({ minLength: 10, maxLength: 200 }), { minLength: 1, maxLength: 10 }),
        (promptId, contents) => {
          resetAllStores();
          const store = useVersioningStore.getState();

          contents.forEach(content => {
            store.addVersion({ promptId, content, message: 'Test' });
          });

          const versions = store.getVersions(promptId);
          
          // Verify content matches (in reverse order)
          versions.forEach((version, index) => {
            const originalIndex = contents.length - 1 - index;
            expect(version.content).toBe(contents[originalIndex]);
          });

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 13: Version Revert Creates New Version
 * Validates: Requirements 4.4
 */
describe('Property 13: Version Revert Creates New Version', () => {
  beforeEach(() => {
    resetAllStores();
  });

  afterEach(() => {
    resetAllStores();
  });

  it('should create new version when reverting', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.array(fc.string({ minLength: 10, maxLength: 100 }), { minLength: 3, maxLength: 10 }),
        (promptId, contents) => {
          resetAllStores();
          const store = useVersioningStore.getState();

          // Create versions
          contents.forEach(content => {
            store.addVersion({ promptId, content, message: 'Test' });
          });

          const initialCount = store.getVersions(promptId).length;
          const versions = store.getVersions(promptId);
          
          if (versions.length > 0) {
            // Revert to first version
            const oldVersion = store.revertToVersion(versions[versions.length - 1].id);
            
            if (oldVersion) {
              // Should have one more version now
              const afterRevert = store.getVersions(promptId);
              expect(afterRevert.length).toBeGreaterThan(initialCount);
            }
          }

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 14: Version Limit Enforcement
 * Validates: Requirements 4.5
 */
describe('Property 14: Version Limit Enforcement', () => {
  beforeEach(() => {
    resetAllStores();
  });

  afterEach(() => {
    resetAllStores();
  });

  it('should enforce 50 version limit', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 51, max: 100 }),
        (promptId, count) => {
          resetAllStores();
          const store = useVersioningStore.getState();

          // Create more than 50 versions
          for (let i = 0; i < count; i++) {
            store.addVersion({ promptId, content: `Version ${i}`, message: `v${i}` });
          }

          const versions = store.getVersions(promptId);
          expect(versions.length).toBeLessThanOrEqual(50);

          return true;
        }
      ),
      { numRuns: 30 }
    );
  });
});
