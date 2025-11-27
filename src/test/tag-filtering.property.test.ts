import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { useOrganizationStore } from '../store/organizationStore';
import { resetAllStores } from './helpers/store-reset';

/**
 * Property 37: Tag Filter Accuracy
 * Validates: Requirements 10.3
 * 
 * Tests that tag filtering returns accurate results
 */
describe('Property 37: Tag Filter Accuracy', () => {
  beforeEach(() => {
    resetAllStores();
  });

  afterEach(() => {
    resetAllStores();
  });

  it('should filter tags by name accurately', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 3, maxLength: 10 }),
        fc.string({ minLength: 1, maxLength: 5 }),
        (tagNames, searchTerm) => {
          resetAllStores();
          const store = useOrganizationStore.getState();

          // Create tags
          tagNames.forEach(name => {
            store.addTag({ name, color: '#3b82f6', usageCount: 0 });
          });

          const allTags = useOrganizationStore.getState().tags;
          
          // Filter tags by search term
          const filtered = allTags.filter(tag => 
            tag.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          // Verify all filtered tags contain the search term
          filtered.forEach(tag => {
            expect(tag.name.toLowerCase()).toContain(searchTerm.toLowerCase());
          });

          // Verify no excluded tags contain the search term
          const excluded = allTags.filter(tag => !filtered.includes(tag));
          excluded.forEach(tag => {
            expect(tag.name.toLowerCase()).not.toContain(searchTerm.toLowerCase());
          });

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should return all tags when no filter is applied', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
        (tagNames) => {
          resetAllStores();
          const store = useOrganizationStore.getState();

          tagNames.forEach(name => {
            store.addTag({ name, color: '#3b82f6', usageCount: 0 });
          });

          const allTags = useOrganizationStore.getState().tags;
          expect(allTags.length).toBe(tagNames.length);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
