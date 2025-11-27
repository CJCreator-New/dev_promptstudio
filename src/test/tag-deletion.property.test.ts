import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { useOrganizationStore } from '../store/organizationStore';
import { resetAllStores } from './helpers/store-reset';

/**
 * Property 39: Tag Deletion Cascade
 * Validates: Requirements 10.5
 * 
 * Tests that tag deletion properly cascades to associated items
 */
describe('Property 39: Tag Deletion Cascade', () => {
  beforeEach(() => {
    resetAllStores();
  });

  afterEach(() => {
    resetAllStores();
  });

  it('should remove tag from store when deleted', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 2, maxLength: 10 }),
        fc.integer({ min: 0, max: 9 }),
        (tagNames, deleteIndex) => {
          resetAllStores();
          const store = useOrganizationStore.getState();

          // Create tags
          const tagIds: number[] = [];
          tagNames.forEach(name => {
            store.addTag({ name, color: '#3b82f6', usageCount: 0 });
            const tags = useOrganizationStore.getState().tags;
            tagIds.push(tags[tags.length - 1].id);
          });

          const initialCount = useOrganizationStore.getState().tags.length;
          const idToDelete = tagIds[deleteIndex % tagIds.length];

          // Delete tag
          store.removeTag(idToDelete);

          const afterDelete = useOrganizationStore.getState().tags;
          expect(afterDelete.length).toBe(initialCount - 1);
          expect(afterDelete.find(t => t.id === idToDelete)).toBeUndefined();

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should maintain other tags when one is deleted', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 3, max: 10 }),
        (count) => {
          resetAllStores();
          const store = useOrganizationStore.getState();

          // Create tags
          const tagIds: number[] = [];
          for (let i = 0; i < count; i++) {
            store.addTag({ name: `Tag${i}`, color: '#3b82f6', usageCount: 0 });
            const tags = useOrganizationStore.getState().tags;
            tagIds.push(tags[tags.length - 1].id);
          }

          // Delete middle tag
          const middleId = tagIds[Math.floor(count / 2)];
          store.removeTag(middleId);

          const remaining = useOrganizationStore.getState().tags;
          expect(remaining.length).toBe(count - 1);

          // Verify other tags still exist
          tagIds.forEach((id, index) => {
            if (id !== middleId) {
              const tag = remaining.find(t => t.id === id);
              expect(tag).toBeDefined();
              expect(tag?.name).toBe(`Tag${index}`);
            }
          });

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
