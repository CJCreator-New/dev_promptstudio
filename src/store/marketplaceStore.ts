/**
 * Filename: marketplaceStore.ts
 * Purpose: Prompt marketplace with ratings, categories, and submissions
 * 
 * Key Features:
 * - Browse community prompts
 * - Rate and review prompts
 * - Submit your own prompts
 * - Search and filter
 * 
 * Dependencies: zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MarketplacePrompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  authorId: string;
  rating: number;
  downloads: number;
  reviews: Review[];
  createdAt: number;
  updatedAt: number;
  isPremium: boolean;
  price?: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

interface MarketplaceStore {
  prompts: MarketplacePrompt[];
  categories: string[];
  searchQuery: string;
  selectedCategory: string | null;
  sortBy: 'popular' | 'recent' | 'rating';
  
  // Actions
  addPrompt: (prompt: Omit<MarketplacePrompt, 'id' | 'rating' | 'downloads' | 'reviews' | 'createdAt' | 'updatedAt'>) => void;
  updatePrompt: (id: string, updates: Partial<MarketplacePrompt>) => void;
  deletePrompt: (id: string) => void;
  addReview: (promptId: string, review: Omit<Review, 'id' | 'createdAt'>) => void;
  incrementDownloads: (id: string) => void;
  
  // Filters
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSortBy: (sort: 'popular' | 'recent' | 'rating') => void;
  
  // Getters
  getFilteredPrompts: () => MarketplacePrompt[];
  getPromptById: (id: string) => MarketplacePrompt | null;
}

const DEFAULT_CATEGORIES = [
  'AI Agents',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'DevOps',
  'UI/UX Design',
  'Code Review',
  'Documentation',
  'Testing',
  'General'
];

export const useMarketplaceStore = create<MarketplaceStore>()(
  persist(
    (set, get) => ({
      prompts: [],
      categories: DEFAULT_CATEGORIES,
      searchQuery: '',
      selectedCategory: null,
      sortBy: 'popular',

      addPrompt: (prompt) => {
        const id = `mp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newPrompt: MarketplacePrompt = {
          ...prompt,
          id,
          rating: 0,
          downloads: 0,
          reviews: [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };

        set((state) => ({
          prompts: [...state.prompts, newPrompt]
        }));
      },

      updatePrompt: (id, updates) => set((state) => ({
        prompts: state.prompts.map(p =>
          p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
        )
      })),

      deletePrompt: (id) => set((state) => ({
        prompts: state.prompts.filter(p => p.id !== id)
      })),

      addReview: (promptId, review) => set((state) => {
        const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newReview: Review = {
          ...review,
          id: reviewId,
          createdAt: Date.now()
        };

        return {
          prompts: state.prompts.map(p => {
            if (p.id === promptId) {
              const newReviews = [...p.reviews, newReview];
              const avgRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
              return { ...p, reviews: newReviews, rating: avgRating };
            }
            return p;
          })
        };
      }),

      incrementDownloads: (id) => set((state) => ({
        prompts: state.prompts.map(p =>
          p.id === id ? { ...p, downloads: p.downloads + 1 } : p
        )
      })),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSortBy: (sort) => set({ sortBy: sort }),

      getFilteredPrompts: () => {
        const { prompts, searchQuery, selectedCategory, sortBy } = get();
        
        let filtered = prompts;

        // Filter by category
        if (selectedCategory) {
          filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filter by search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }

        // Sort
        filtered = [...filtered].sort((a, b) => {
          switch (sortBy) {
            case 'popular':
              return b.downloads - a.downloads;
            case 'rating':
              return b.rating - a.rating;
            case 'recent':
              return b.createdAt - a.createdAt;
            default:
              return 0;
          }
        });

        return filtered;
      },

      getPromptById: (id) => {
        return get().prompts.find(p => p.id === id) || null;
      }
    }),
    { name: 'marketplace-store' }
  )
);
