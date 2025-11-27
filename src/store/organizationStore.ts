import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Tag {
  id: number;
  name: string;
  color: string;
  usageCount: number;
  createdAt: number;
}

interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  path: string;
  createdAt: number;
}

interface OrganizationStore {
  tags: Tag[];
  folders: Folder[];
  favorites: number[];
  addTag: (tag: Omit<Tag, 'id' | 'createdAt'>) => void;
  removeTag: (id: number) => void;
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => void;
  removeFolder: (id: number) => void;
  toggleFavorite: (promptId: number) => void;
}

export const useOrganizationStore = create<OrganizationStore>()(
  persist(
    (set) => ({
      tags: [],
      folders: [],
      favorites: [],
      addTag: (tag) => set((state) => ({
        tags: [...state.tags, { ...tag, id: Date.now(), createdAt: Date.now(), usageCount: 0 }]
      })),
      removeTag: (id) => set((state) => ({
        tags: state.tags.filter(t => t.id !== id)
      })),
      addFolder: (folder) => set((state) => ({
        folders: [...state.folders, { ...folder, id: Date.now(), createdAt: Date.now() }]
      })),
      removeFolder: (id) => set((state) => ({
        folders: state.folders.filter(f => f.id !== id)
      })),
      toggleFavorite: (promptId) => set((state) => ({
        favorites: state.favorites.includes(promptId)
          ? state.favorites.filter(id => id !== promptId)
          : [...state.favorites, promptId]
      })),
    }),
    { name: 'organization-store' }
  )
);
