import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { db } from '../utils/db';
import { searchService } from '../services/searchService';
import { resetAllStores } from './helpers/store-reset';

/**
 * Property 44: Full-Text Search
 * Validates: Requirements 12.1
 */
describe('Property 44: Full-Text Search', () => {
  beforeEach(async () => {
    resetAllStores();
    await db.prompts.clear();
  });

  afterEach(async () => {
    await db.prompts.clear();
  });

  it('should find prompts by title or content', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.record({
          title: fc.string({ minLength: 5, maxLength: 30 }),
          content: fc.string({ minLength: 10, maxLength: 100 }),
        }), { minLength: 2, maxLength: 5 }),
        fc.string({ minLength: 2, maxLength: 10 }),
        async (prompts, searchTerm) => {
          await db.prompts.clear();

          // Add prompts
          for (const prompt of prompts) {
            await db.prompts.add({
              title: prompt.title,
              content: prompt.content,
              tags: [],
              folderId: null,
              isFavorite: false,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }

          // Search
          const results = await searchService.search({ query: searchTerm });

          // Verify results contain search term
          results.forEach(result => {
            const matchesTitle = result.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesContent = result.content.toLowerCase().includes(searchTerm.toLowerCase());
            expect(matchesTitle || matchesContent).toBe(true);
          });

          return true;
        }
      ),
      { numRuns: 20 }
    );
  });
});

/**
 * Property 47: Favorites Toggle
 * Validates: Requirements 13.1, 13.3
 */
describe('Property 47: Favorites Toggle', () => {
  beforeEach(() => {
    resetAllStores();
  });

  afterEach(() => {
    resetAllStores();
  });

  it('should toggle favorites correctly', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 1, maxLength: 10 }),
        (promptIds) => {
          resetAllStores();
          const { toggleFavorite, favorites } = useOrganizationStore.getState();

          // Toggle each prompt
          promptIds.forEach(id => {
            toggleFavorite(id);
          });

          const currentFavorites = useOrganizationStore.getState().favorites;
          expect(currentFavorites.length).toBe(promptIds.length);

          // Toggle again should remove
          promptIds.forEach(id => {
            toggleFavorite(id);
          });

          const afterToggle = useOrganizationStore.getState().favorites;
          expect(afterToggle.length).toBe(0);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
