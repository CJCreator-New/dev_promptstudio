import { useState, useEffect } from 'react';
import { Prompt } from '../utils/db';
import { searchService } from '../services/searchService';
import { useOrganizationStore } from '../store/organizationStore';

const ITEMS_PER_PAGE = 10;

export const FavoritesView = () => {
  const [favorites, setFavorites] = useState<Prompt[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { toggleFavorite } = useOrganizationStore();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const results = await searchService.search({ query: '', favoritesOnly: true });
    setFavorites(results);
  };

  const handleToggleFavorite = async (promptId: number) => {
    toggleFavorite(promptId);
    await loadFavorites();
  };

  const totalPages = Math.ceil(favorites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFavorites = favorites.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="favorites-view">
      <h2>Favorites ({favorites.length})</h2>
      
      <div className="favorites-list">
        {paginatedFavorites.map(prompt => (
          <div key={prompt.id} className="favorite-item">
            <h3>{prompt.title}</h3>
            <p>{prompt.content.substring(0, 150)}...</p>
            <button 
              onClick={() => handleToggleFavorite(prompt.id!)}
              aria-label="Remove from favorites"
            >
              ★ Remove
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination" role="navigation" aria-label="Pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span aria-current="page">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
