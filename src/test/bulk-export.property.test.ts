import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { bulkExportService } from '../services/bulkExportService';
import { Prompt } from '../utils/db';

const promptArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  content: fc.string({ minLength: 10, maxLength: 200 }),
  tags: fc.array(fc.integer({ min: 1 })),
  folderId: fc.option(fc.integer({ min: 1 }), { nil: null }),
  isFavorite: fc.boolean(),
  createdAt: fc.integer({ min: 1600000000000 }),
  updatedAt: fc.integer({ min: 1600000000000 }),
});

/**
 * Property 31: Bulk Export ZIP Creation
 * Validates: Requirements 8.5
 */
describe('Property 31: Bulk Export ZIP Creation', () => {
  it('should create ZIP archive for multiple prompts', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(promptArbitrary, { minLength: 2, maxLength: 5 }),
        fc.constantFrom('json', 'markdown', 'text'),
        async (prompts, format) => {
          const result = await bulkExportService.exportToZip(prompts as Prompt[], format);
          
          expect(result instanceof Blob).toBe(true);
          expect(result.size).toBeGreaterThan(0);
          expect(result.type).toContain('zip');
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should handle single prompt export', async () => {
    await fc.assert(
      fc.asyncProperty(
        promptArbitrary,
        async (prompt) => {
          const result = await bulkExportService.exportToZip([prompt as Prompt], 'json');
          
          expect(result instanceof Blob).toBe(true);
          expect(result.size).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });
});
