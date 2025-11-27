import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { importService } from '../services/importService';
import { db } from '../utils/db';

/**
 * Property 32: Import Validation
 * Validates: Requirements 9.1
 */
describe('Property 32: Import Validation', () => {
  it('should validate import data', () => {
    fc.assert(
      fc.property(
        fc.string(),
        (data) => {
          const result = importService.validateJSON(data);
          expect(result).toHaveProperty('valid');
          
          if (!result.valid) {
            expect(result).toHaveProperty('error');
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should accept valid JSON prompts', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          title: fc.string({ minLength: 1 }),
          content: fc.string(),
        })),
        (prompts) => {
          const json = JSON.stringify(prompts);
          const result = importService.validateJSON(json);
          
          expect(result.valid).toBe(true);
          expect(result.prompts).toBeDefined();
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 33: Import Schema Validation
 * Validates: Requirements 9.2
 */
describe('Property 33: Import Schema Validation', () => {
  it('should enforce schema requirements', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.option(fc.string(), { nil: undefined }),
          content: fc.option(fc.string(), { nil: undefined }),
        }),
        (data) => {
          const json = JSON.stringify(data);
          const result = importService.validateJSON(json);
          
          if (!data.title || data.title.length === 0) {
            expect(result.valid).toBe(false);
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 34: Import Conflict Resolution
 * Validates: Requirements 9.4
 */
describe('Property 34: Import Conflict Resolution', () => {
  beforeEach(async () => {
    await db.prompts.clear();
  });

  afterEach(async () => {
    await db.prompts.clear();
  });

  it('should handle conflicts with skip strategy', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 10 }),
        async (title, content) => {
          await db.prompts.clear();
          
          // Add existing prompt
          await db.prompts.add({
            title,
            content,
            tags: [],
            folderId: null,
            isFavorite: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
          
          // Try to import same title
          const result = await importService.importPrompts([{ title, content: 'new' }], 'skip');
          
          expect(result.skipped).toBe(1);
          expect(result.imported).toBe(0);
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });
});

/**
 * Property 35: Import Summary
 * Validates: Requirements 9.5
 */
describe('Property 35: Import Summary', () => {
  beforeEach(async () => {
    await db.prompts.clear();
  });

  afterEach(async () => {
    await db.prompts.clear();
  });

  it('should provide accurate import summary', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.record({
          title: fc.string({ minLength: 1, maxLength: 50 }),
          content: fc.string({ minLength: 10 }),
        }), { minLength: 1, maxLength: 5 }),
        async (prompts) => {
          await db.prompts.clear();
          
          const result = await importService.importPrompts(prompts, 'skip');
          
          expect(result).toHaveProperty('imported');
          expect(result).toHaveProperty('skipped');
          expect(result).toHaveProperty('errors');
          expect(result.imported + result.skipped).toBeLessThanOrEqual(prompts.length);
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });
});
