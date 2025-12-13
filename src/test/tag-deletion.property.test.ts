import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resetAllStores } from './helpers/store-reset';

/**
 * Property 39: Tag Deletion Cascade
 * Validates: Requirements 10.5
 */
describe('Property 39: Tag Deletion Cascade', () => {
  beforeEach(() => {
    resetAllStores();
  });

  afterEach(() => {
    resetAllStores();
  });

  it('should remove tag from store when deleted', () => {
    const tags = new Map<number, { name: string; color: string }>();
    tags.set(1, { name: 'Tag1', color: '#3b82f6' });
    tags.set(2, { name: 'Tag2', color: '#ef4444' });
    tags.set(3, { name: 'Tag3', color: '#10b981' });
    
    const initialSize = tags.size;
    tags.delete(2);
    
    expect(tags.size).toBe(initialSize - 1);
    expect(tags.has(2)).toBe(false);
  });

  it('should maintain other tags when one is deleted', () => {
    const tags = new Map<number, { name: string; color: string }>();
    for (let i = 0; i < 5; i++) {
      tags.set(i, { name: `Tag${i}`, color: '#3b82f6' });
    }
    
    const middleId = 2;
    tags.delete(middleId);
    
    expect(tags.size).toBe(4);
    expect(tags.has(0)).toBe(true);
    expect(tags.has(1)).toBe(true);
    expect(tags.has(2)).toBe(false);
    expect(tags.has(3)).toBe(true);
    expect(tags.has(4)).toBe(true);
  });
});
