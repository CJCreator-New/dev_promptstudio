import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { exportService } from '../services/exportService';
import { Prompt } from '../utils/db';

const promptArbitrary = fc.record({
  id: fc.integer({ min: 1 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  content: fc.string({ minLength: 10, maxLength: 500 }),
  tags: fc.array(fc.integer({ min: 1 })),
  folderId: fc.option(fc.integer({ min: 1 }), { nil: null }),
  isFavorite: fc.boolean(),
  createdAt: fc.integer({ min: 1600000000000 }),
  updatedAt: fc.integer({ min: 1600000000000 }),
});

/**
 * Property 27: Export Format Availability
 * Validates: Requirements 8.1
 */
describe('Property 27: Export Format Availability', () => {
  it('should support all export formats', () => {
    fc.assert(
      fc.property(
        promptArbitrary,
        fc.constantFrom('pdf', 'markdown', 'json', 'text'),
        (prompt, format) => {
          const result = exportService.export(prompt as Prompt, format);
          expect(result).toBeDefined();
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 28: PDF Export Completeness
 * Validates: Requirements 8.2
 */
describe('Property 28: PDF Export Completeness', () => {
  it('should export complete PDF', () => {
    fc.assert(
      fc.property(
        promptArbitrary,
        (prompt) => {
          const result = exportService.exportToPDF(prompt as Prompt);
          expect(result instanceof Blob).toBe(true);
          expect(result.size).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: 30 }
    );
  });
});

/**
 * Property 29: Markdown Export Format
 * Validates: Requirements 8.3
 */
describe('Property 29: Markdown Export Format', () => {
  it('should export valid markdown with frontmatter', () => {
    fc.assert(
      fc.property(
        promptArbitrary,
        (prompt) => {
          const result = exportService.exportToMarkdown(prompt as Prompt);
          
          expect(typeof result).toBe('string');
          expect(result).toContain('---');
          expect(result).toContain(`title: ${prompt.title}`);
          expect(result).toContain(prompt.content);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 30: JSON Export Round-Trip
 * Validates: Requirements 8.4
 */
describe('Property 30: JSON Export Round-Trip', () => {
  it('should preserve data through JSON export/import', () => {
    fc.assert(
      fc.property(
        promptArbitrary,
        (prompt) => {
          const exported = exportService.exportToJSON(prompt as Prompt);
          const parsed = JSON.parse(exported);
          
          expect(parsed.title).toBe(prompt.title);
          expect(parsed.content).toBe(prompt.content);
          expect(parsed.isFavorite).toBe(prompt.isFavorite);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
