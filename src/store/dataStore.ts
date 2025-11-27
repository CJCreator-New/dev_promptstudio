import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DataStore } from './types';

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      // State
      history: [],
      savedProjects: [],
      customTemplates: [],

      // Actions
      addHistoryItem: (item) =>
        set((state) => ({
          history: [item, ...state.history].slice(0, 50), // Keep only last 50 items
        })),
      
      clearHistory: () => set({ history: [] }),
      
      addSavedProject: (project) =>
        set((state) => ({
          savedProjects: [project, ...state.savedProjects],
        })),
      
      deleteSavedProject: (id) =>
        set((state) => ({
          savedProjects: state.savedProjects.filter((p) => p.id !== id),
        })),
      
      addCustomTemplate: (template) =>
        set((state) => ({
          customTemplates: [template, ...state.customTemplates],
        })),
      
      updateCustomTemplate: (id, updates) =>
        set((state) => ({
          customTemplates: state.customTemplates.map((t) =>
            t.id === id ? { ...t, ...updates, timestamp: Date.now() } : t
          ),
        })),
      
      deleteCustomTemplate: (id) =>
        set((state) => ({
          customTemplates: state.customTemplates.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'devprompt-data-storage',
      partialize: (state) => ({
        history: state.history,
        savedProjects: state.savedProjects,
        customTemplates: state.customTemplates,
      }),
    }
  )
);