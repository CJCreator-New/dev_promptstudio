import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { truncate, capitalize, kebabCase, stripHtml } from '../utils/string';
import { unique, chunk, takeLast, shuffle } from '../utils/array';
import { formatRelativeTime, formatDate, isToday } from '../utils/date';

// Property 11: Utility Module Organization
describe('Property 11: Utility Module Organization', () => {
  describe('String utilities', () => {
    test('truncate works correctly', () => {
      fc.assert(fc.property(
        fc.string(),
        fc.integer({ min: 0, max: 100 }),
        (str, length) => {
          const result = truncate(str, length);
          
          if (str.length <= length) {
            expect(result).toBe(str);
          } else {
            expect(result).toBe(str.slice(0, length) + '...');
            expect(result.length).toBe(length + 3);
          }
          
          return true;
        }
      ));
    });

    test('capitalize works correctly', () => {
      fc.assert(fc.property(
        fc.string({ minLength: 1 }),
        (str) => {
          const result = capitalize(str);
          expect(result.charAt(0)).toBe(str.charAt(0).toUpperCase());
          expect(result.slice(1)).toBe(str.slice(1));
          return true;
        }
      ));
    });

    test('kebabCase converts correctly', () => {
      fc.assert(fc.property(
        fc.string().filter(s => s.length > 0),
        (str) => {
          const result = kebabCase(str);
          expect(result).toBe(result.toLowerCase());
          expect(result).not.toMatch(/[A-Z]/);
          return true;
        }
      ));
    });

    test('stripHtml removes HTML tags', () => {
      const htmlString = '<div>Hello <span>World</span></div>';
      const result = stripHtml(htmlString);
      expect(result).toBe('Hello World');
      expect(result).not.toMatch(/<[^>]*>/);
    });
  });

  describe('Array utilities', () => {
    test('unique removes duplicates', () => {
      fc.assert(fc.property(
        fc.array(fc.integer()),
        (arr) => {
          const result = unique(arr);
          const resultSet = new Set(result);
          
          expect(result.length).toBe(resultSet.size);
          
          // All original elements should be present
          arr.forEach(item => {
            expect(result).toContain(item);
          });
          
          return true;
        }
      ));
    });

    test('chunk splits array correctly', () => {
      fc.assert(fc.property(
        fc.array(fc.integer()),
        fc.integer({ min: 1, max: 10 }),
        (arr, size) => {
          const result = chunk(arr, size);
          
          // All chunks except last should have exact size
          for (let i = 0; i < result.length - 1; i++) {
            expect(result[i]?.length).toBe(size);
          }
          
          // Last chunk should have remaining elements
          if (result.length > 0) {
            const lastChunk = result[result.length - 1];
            expect(lastChunk?.length).toBeLessThanOrEqual(size);
          }
          
          // Total elements should match original
          const totalElements = result.flat().length;
          expect(totalElements).toBe(arr.length);
          
          return true;
        }
      ));
    });

    test('takeLast returns correct number of elements', () => {
      fc.assert(fc.property(
        fc.array(fc.integer()),
        fc.integer({ min: 0, max: 20 }),
        (arr, count) => {
          const result = takeLast(arr, count);
          const expectedLength = Math.min(count, arr.length);
          
          expect(result.length).toBe(expectedLength);
          
          if (expectedLength > 0) {
            expect(result).toEqual(arr.slice(-count));
          }
          
          return true;
        }
      ));
    });

    test('shuffle maintains array length and elements', () => {
      fc.assert(fc.property(
        fc.array(fc.integer()),
        (arr) => {
          const result = shuffle(arr);
          
          expect(result.length).toBe(arr.length);
          
          // All original elements should be present
          arr.forEach(item => {
            expect(result).toContain(item);
          });
          
          return true;
        }
      ));
    });
  });

  describe('Date utilities', () => {
    test('formatRelativeTime returns correct format', () => {
      const now = Date.now();
      
      // Test "Just now"
      expect(formatRelativeTime(now)).toBe('Just now');
      
      // Test minutes ago
      const minutesAgo = now - (5 * 60 * 1000);
      expect(formatRelativeTime(minutesAgo)).toBe('5 minutes ago');
      
      // Test hours ago
      const hoursAgo = now - (2 * 60 * 60 * 1000);
      expect(formatRelativeTime(hoursAgo)).toBe('2 hours ago');
      
      // Test days ago
      const daysAgo = now - (3 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(daysAgo)).toBe('3 days ago');
    });

    test('formatDate returns valid date string', () => {
      fc.assert(fc.property(
        fc.integer({ min: 0, max: Date.now() }),
        (timestamp) => {
          const result = formatDate(timestamp);
          expect(typeof result).toBe('string');
          expect(result.length).toBeGreaterThan(0);
          return true;
        }
      ));
    });

    test('isToday correctly identifies today', () => {
      const now = Date.now();
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      
      expect(isToday(now)).toBe(true);
      expect(isToday(todayStart)).toBe(true);
      
      const yesterday = now - (24 * 60 * 60 * 1000);
      expect(isToday(yesterday)).toBe(false);
    });
  });
});