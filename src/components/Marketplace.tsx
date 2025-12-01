/**
 * Filename: Marketplace.tsx
 * Purpose: Browse and discover community prompts
 * 
 * Key Components:
 * - Search and filter
 * - Prompt cards with ratings
 * - Category navigation
 * - Sort options
 * 
 * Dependencies: marketplaceStore, lucide-react
 */

import React, { useEffect, useState } from 'react';
import { Search, Star, Download, Filter, TrendingUp, Clock, Award } from 'lucide-react';
import { useMarketplaceStore } from '../store/marketplaceStore';
import { fetchMarketplacePrompts } from '../services/marketplaceService';
import { PromptCard } from './PromptCard';

export const Marketplace: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const {
    categories,
    searchQuery,
    selectedCategory,
    sortBy,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    getFilteredPrompts,
    addPrompt
  } = useMarketplaceStore();

  const prompts = getFilteredPrompts();

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    setLoading(true);
    try {
      const data = await fetchMarketplacePrompts();
      data.forEach(p => addPrompt(p));
    } catch (error) {
      console.error('Failed to load prompts:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Prompt Marketplace</h1>
          <p className="text-slate-400">Discover and share production-ready prompts</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg border border-slate-600 focus:border-indigo-500 focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedCategory === null
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading prompts...</div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No prompts found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
