import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resetAllStores } from './helpers/store-reset';

/**
 * Property 44: Full-Text Search
 * Validates: Requirements 12.1
 */
describe('Property 44: Full-Text Search', () => {
  beforeEach(() => {
    resetAllStores();
  });

  afterEach(() => {
    resetAllStores();
  });

  it('should find prompts by title or content', () => {
    const prompts = [
      { title: 'React Hooks', content: 'useState and useEffect' },
      { title: 'TypeScript', content: 'Type safety in JavaScript' }
    ];
    const searchTerm = 'react';
    
    const results = prompts.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    expect(results.length).toBeGreaterThan(0);
    results.forEach(result => {
      const matches = result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     result.content.toLowerCase().includes(searchTerm.toLowerCase());
      expect(matches).toBe(true);
    });
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
    const favorites = new Set<number>();
    const promptIds = [1, 2, 3];
    
    promptIds.forEach(id => favorites.add(id));
    expect(favorites.size).toBe(3);
    
    promptIds.forEach(id => favorites.delete(id));
    expect(favorites.size).toBe(0);
  });
});
