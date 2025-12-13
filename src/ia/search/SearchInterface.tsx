import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { SearchEngine, SearchableItem, SearchFilters } from './searchEngine';

interface SearchInterfaceProps<T extends SearchableItem> {
  items: T[];
  onResultSelect: (item: T) => void;
  placeholder?: string;
  filters?: SearchFilters;
  onFiltersChange?: (filters: SearchFilters) => void;
  className?: string;
}

export function SearchInterface<T extends SearchableItem>({ 
  items, 
  onResultSelect,
  placeholder = 'Search...',
  filters,
  onFiltersChange,
  className = '' 
}: SearchInterfaceProps<T>) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [engine] = useState(() => new SearchEngine<T>());

  useEffect(() => {
    engine.setItems(items);
  }, [items, engine]);

  useEffect(() => {
    const searchResults = engine.search(query, filters);
    setResults(searchResults.map(r => r.item));
  }, [query, filters, engine]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2 bg-elevated border border-border rounded-lg focus:ring-2 focus:ring-accent-primary outline-none"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-background rounded"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1 rounded ${showFilters ? 'bg-accent-primary text-white' : 'hover:bg-background'}`}
            aria-label="Toggle filters"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {query && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-elevated border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {results.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onResultSelect(item);
                setQuery('');
              }}
              className="w-full p-3 text-left hover:bg-background transition-colors border-b border-border last:border-0"
            >
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-muted line-clamp-2">{item.content}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
