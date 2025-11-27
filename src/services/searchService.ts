import { db, Prompt } from '../utils/db';

export interface SearchOptions {
  query: string;
  tags?: number[];
  folderId?: number | null;
  favoritesOnly?: boolean;
}

export const searchService = {
  async search(options: SearchOptions): Promise<Prompt[]> {
    let results = await db.prompts.toArray();

    // Filter by query
    if (options.query) {
      const query = options.query.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query)
      );
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter(p => 
        options.tags!.some(tagId => p.tags.includes(tagId))
      );
    }

    // Filter by folder
    if (options.folderId !== undefined) {
      results = results.filter(p => p.folderId === options.folderId);
    }

    // Filter by favorites
    if (options.favoritesOnly) {
      results = results.filter(p => p.isFavorite);
    }

    return results;
  },

  async saveSearch(name: string, query: string, filters: string): Promise<number> {
    return db.savedSearches.add({
      name,
      query,
      filters,
      createdAt: Date.now(),
    });
  },

  async getSavedSearches() {
    return db.savedSearches.toArray();
  },

  async deleteSavedSearch(id: number) {
    await db.savedSearches.delete(id);
  },
};
