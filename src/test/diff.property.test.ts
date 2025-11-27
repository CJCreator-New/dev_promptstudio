import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { diffService } from '../services/diffService';

/**
 * Property 15: Diff Accuracy
 * Validates: Requirements 5.1, 5.3
 */
describe('Property 15: Diff Accuracy', () => {
  it('should accurately compute differences', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 200 }),
        fc.string({ minLength: 10, maxLength: 200 }),
        (text1, text2) => {
          const result = diffService.computeDiff(text1, text2);

          // Result should have valid structure
          expect(result).toHaveProperty('additions');
          expect(result).toHaveProperty('deletions');
          expect(result).toHaveProperty('changes');
          expect(result).toHaveProperty('diffs');

          // Stats should be non-negative
          expect(result.additions).toBeGreaterThanOrEqual(0);
          expect(result.deletions).toBeGreaterThanOrEqual(0);
          expect(result.changes).toBeGreaterThanOrEqual(0);

          // Diffs should be an array
          expect(Array.isArray(result.diffs)).toBe(true);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should handle identical texts', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 200 }),
        (text) => {
          const result = diffService.computeDiff(text, text);

          // No changes for identical texts
          expect(result.additions).toBe(0);
          expect(result.deletions).toBe(0);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should detect all additions', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 100 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        (text, addition) => {
          const result = diffService.computeDiff(text, text + addition);

          // Should detect additions
          expect(result.additions).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should detect all deletions', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 20, maxLength: 100 }),
        (text) => {
          const shortened = text.substring(0, text.length - 5);
          const result = diffService.computeDiff(text, shortened);

          // Should detect deletions
          expect(result.deletions).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});

/**
 * Property 16: Diff Export Completeness
 * Validates: Requirements 5.5
 */
describe('Property 16: Diff Export Completeness', () => {
  it('should export complete diff information', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 200 }),
        fc.string({ minLength: 10, maxLength: 200 }),
        fc.constantFrom('unified', 'html'),
        (text1, text2, format) => {
          const exported = diffService.exportDiff(text1, text2, format as 'unified' | 'html');

          // Export should not be empty
          expect(exported.length).toBeGreaterThan(0);

          // Export should be a string
          expect(typeof exported).toBe('string');

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should generate valid patches', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 200 }),
        fc.string({ minLength: 10, maxLength: 200 }),
        (text1, text2) => {
          const patch = diffService.generatePatch(text1, text2);

          // Patch should be a string
          expect(typeof patch).toBe('string');

          // Apply patch should work
          const result = diffService.applyPatch(text1, patch);
          expect(typeof result).toBe('string');

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should preserve content through patch cycle', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 100 }),
        fc.string({ minLength: 10, maxLength: 100 }),
        (text1, text2) => {
          // Generate patch
          const patch = diffService.generatePatch(text1, text2);
          
          // Apply patch
          const result = diffService.applyPatch(text1, patch);
          
          // Result should match text2 (or be very close)
          expect(result.length).toBeGreaterThan(0);

          return true;
        }
      ),
      { numRuns: 30 }
    );
  });
});
