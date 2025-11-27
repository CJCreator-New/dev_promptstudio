import { describe, it, expect, test } from 'vitest';

describe('Basic Test Setup', () => {
  test('should run basic tests', () => {
    expect(1 + 1).toBe(2);
  });

  test('should have access to globals', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });
});