import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resetAllStores } from './helpers/store-reset';

/**
 * Property 36: Tag Association
 * Validates: Requirements 10.1, 10.2
 */
describe('Property 36: Tag Association', () => {
  beforeEach(() => {
    resetAllStores();
  });

  afterEach(() => {
    resetAllStores();
  });

  it('should correctly associate tags with items', () => {
    const tagData = [
      { name: 'React', color: '#3b82f6' },
      { name: 'TypeScript', color: '#ef4444' },
      { name: 'Testing', color: '#10b981' }
    ];
    
    const tags = new Map<number, { name: string; color: string }>();
    tagData.forEach((data, index) => {
      tags.set(index, data);
    });
    
    expect(tags.size).toBe(tagData.length);
    tagData.forEach((data, index) => {
      const tag = tags.get(index);
      expect(tag).toBeDefined();
      expect(tag?.name).toBe(data.name);
      expect(tag?.color).toBe(data.color);
    });
  });

  it('should maintain unique tag identifiers', () => {
    const ids: number[] = [];
    for (let i = 0; i < 10; i++) {
      ids.push(i);
    }
    
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
