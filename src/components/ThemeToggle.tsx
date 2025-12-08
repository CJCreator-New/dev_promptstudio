import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' }
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-[var(--surface-secondary)] rounded-lg border border-[var(--border-primary)]">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
            transition-all duration-200
            ${theme === value
              ? 'bg-[var(--brand-primary)] text-white shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
            }
          `}
          aria-label={`Switch to ${label} theme`}
          aria-pressed={theme === value}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export const ThemeToggleCompact: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-lg
        bg-[var(--surface-secondary)] hover:bg-[var(--surface-hover)]
        border border-[var(--border-primary)]
        text-[var(--text-secondary)] hover:text-[var(--text-primary)]
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]
      "
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

export const ThemeIndicator: React.FC = () => {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
      <div className={`
        w-2 h-2 rounded-full
        ${resolvedTheme === 'dark' ? 'bg-indigo-400' : 'bg-yellow-400'}
      `} />
      <span>
        {theme === 'system' ? `System (${resolvedTheme})` : theme}
      </span>
    </div>
  );
};
