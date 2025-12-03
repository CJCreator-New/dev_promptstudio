import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  
  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'auto' as const, icon: Monitor, label: 'Auto' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
  ];
  
  return (
    <div className="flex gap-1 p-1 rounded-lg bg-elevated border border-border transition-colors shadow-sm">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            px-3 py-1.5 rounded-md transition-all
            ${theme === value 
              ? 'bg-background shadow-sm text-foreground font-medium' 
              : 'text-muted hover:text-foreground hover:bg-overlay'
            }
          `}
          aria-label={`Switch to ${label} theme`}
          title={`${label} mode`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};
