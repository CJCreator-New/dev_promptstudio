import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Theme {
  id: number;
  name: string;
  colors: Record<string, string>;
  isActive: boolean;
}

interface CustomizationStore {
  themes: Theme[];
  language: string;
  addTheme: (theme: Omit<Theme, 'id'>) => void;
  activateTheme: (id: number) => void;
  removeTheme: (id: number) => void;
  setLanguage: (lang: string) => void;
}

export const useCustomizationStore = create<CustomizationStore>()(
  persist(
    (set) => ({
      themes: [],
      language: 'en',
      addTheme: (theme) => set((state) => ({
        themes: [...state.themes, { ...theme, id: Date.now() }]
      })),
      activateTheme: (id) => set((state) => ({
        themes: state.themes.map(t => ({ ...t, isActive: t.id === id }))
      })),
      removeTheme: (id) => set((state) => ({
        themes: state.themes.filter(t => t.id !== id)
      })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: 'customization-store' }
  )
);
