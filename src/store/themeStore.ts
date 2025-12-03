import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeStore {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'auto',
      resolvedTheme: 'dark',
      
      setTheme: (theme) => {
        set({ theme });
        get().initTheme();
      },
      
      initTheme: () => {
        const { theme } = get();
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
        
        const resolved = theme === 'auto' ? systemTheme : theme;
        
        // Use both class and data-theme for maximum compatibility
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolved);
        document.documentElement.setAttribute('data-theme', resolved);
        
        set({ resolvedTheme: resolved });
      },
    }),
    {
      name: 'devprompt-theme',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// Listen to system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      const store = useThemeStore.getState();
      if (store.theme === 'auto') store.initTheme();
    });
}
