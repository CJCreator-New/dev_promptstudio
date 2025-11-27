import { useState } from 'react';
import { Prompt } from '../utils/db';
import { searchService, SearchOptions } from '../services/searchService';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Prompt[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    const options: SearchOptions = { query };
    const searchResults = await searchService.search(options);
    setResults(searchResults);
    setIsSearching(false);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i}>{part}</mark> 
        : part
    );
  };

  return (
    <div className="search-bar">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search prompts..."
        aria-label="Search prompts"
      />
      <button onClick={handleSearch} disabled={isSearching} aria-label="Search">
        {isSearching ? 'Searching...' : 'Search'}
      </button>
      
      {results.length > 0 && (
        <div className="search-results" role="region" aria-label="Search results">
          {results.map(prompt => (
            <div key={prompt.id} className="search-result">
              <h3>{highlightText(prompt.title, query)}</h3>
              <p>{highlightText(prompt.content.substring(0, 100), query)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
