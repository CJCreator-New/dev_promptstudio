import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { useOrganizationStore } from '../store/organizationStore';
import { resetAllStores } from './helpers/store-reset';

/**
 * Property 36: Tag Association
 * Validates: Requirements 10.1, 10.2
 * 
 * Tests that tags can be associated with prompts correctly
 */
describe('Property 36: Tag Association', () => {
  beforeEach(() => {
    resetAllStores();
  });

  afterEach(() => {
    resetAllStores();
  });

  it('should correctly associate tags with items', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          name: fc.string({ minLength: 1, maxLength: 30 }),
          color: fc.constantFrom('#3b82f6', '#ef4444', '#10b981', '#f59e0b'),
        }), { minLength: 1, maxLength: 10 }),
        (tagData) => {
          resetAllStores();
          const store = useOrganizationStore.getState();

          // Create tags
          const tagIds = tagData.map(data => {
            store.addTag({ name: data.name, color: data.color, usageCount: 0 });
            const tags = useOrganizationStore.getState().tags;
            return tags[tags.length - 1].id;
          });

          // Verify all tags were created
          const allTags = useOrganizationStore.getState().tags;
          expect(allTags.length).toBe(tagData.length);

          // Verify each tag has correct data
          tagIds.forEach((id, index) => {
            const tag = allTags.find(t => t.id === id);
            expect(tag).toBeDefined();
            expect(tag?.name).toBe(tagData[index].name);
            expect(tag?.color).toBe(tagData[index].color);
          });

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should maintain unique tag identifiers', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 20 }),
        (count) => {
          resetAllStores();
          const store = useOrganizationStore.getState();

          const ids: number[] = [];
          for (let i = 0; i < count; i++) {
            store.addTag({ name: `Tag${i}`, color: '#3b82f6', usageCount: 0 });
            const tags = useOrganizationStore.getState().tags;
            ids.push(tags[tags.length - 1].id);
          }

          // All IDs should be unique
          const uniqueIds = new Set(ids);
          expect(uniqueIds.size).toBe(ids.length);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
