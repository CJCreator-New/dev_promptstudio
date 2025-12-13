export interface SearchableItem {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  timestamp?: number;
}

export interface SearchFilters {
  tags?: string[];
  category?: string;
  dateRange?: { start: number; end: number };
}

export interface SearchResult<T> {
  item: T;
  score: number;
  matches: string[];
}

export class SearchEngine<T extends SearchableItem> {
  private items: T[] = [];

  setItems(items: T[]) {
    this.items = items;
  }

  search(query: string, filters?: SearchFilters): SearchResult<T>[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery && !filters) return [];

    let results = this.items.map(item => ({
      item,
      score: this.calculateScore(item, normalizedQuery),
      matches: this.findMatches(item, normalizedQuery)
    }));

    if (filters) {
      results = results.filter(r => this.applyFilters(r.item, filters));
    }

    return results
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  private calculateScore(item: T, query: string): number {
    if (!query) return 1;
    
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const contentLower = item.content.toLowerCase();

    if (titleLower === query) score += 100;
    else if (titleLower.includes(query)) score += 50;
    
    if (contentLower.includes(query)) score += 10;
    
    if (item.tags?.some(tag => tag.toLowerCase().includes(query))) score += 25;

    return score;
  }

  private findMatches(item: T, query: string): string[] {
    const matches: string[] = [];
    if (item.title.toLowerCase().includes(query)) matches.push('title');
    if (item.content.toLowerCase().includes(query)) matches.push('content');
    if (item.tags?.some(tag => tag.toLowerCase().includes(query))) matches.push('tags');
    return matches;
  }

  private applyFilters(item: T, filters: SearchFilters): boolean {
    if (filters.tags?.length && !item.tags?.some(t => filters.tags!.includes(t))) {
      return false;
    }
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    if (filters.dateRange && item.timestamp) {
      if (item.timestamp < filters.dateRange.start || item.timestamp > filters.dateRange.end) {
        return false;
      }
    }
    return true;
  }
}
