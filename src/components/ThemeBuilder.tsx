import React, { useState, useEffect } from 'react';

interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
  };
}

const presetThemes: Theme[] = [
  {
    name: 'Light',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      accent: '#10B981',
    },
  },
  {
    name: 'Dark',
    colors: {
      primary: '#60A5FA',
      secondary: '#A78BFA',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#9CA3AF',
      border: '#374151',
      accent: '#34D399',
    },
  },
  {
    name: 'Ocean',
    colors: {
      primary: '#0EA5E9',
      secondary: '#06B6D4',
      background: '#F0F9FF',
      surface: '#E0F2FE',
      text: '#0C4A6E',
      textSecondary: '#075985',
      border: '#BAE6FD',
      accent: '#14B8A6',
    },
  },
  {
    name: 'Forest',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      background: '#F0FDF4',
      surface: '#DCFCE7',
      text: '#064E3B',
      textSecondary: '#065F46',
      border: '#BBF7D0',
      accent: '#84CC16',
    },
  },
];

export const ThemeBuilder: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(presetThemes[0]);
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    if (autoMode) {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSelectedTheme(isDark ? presetThemes[1] : presetThemes[0]);
    }
  }, [autoMode]);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(selectedTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
  }, [selectedTheme]);

  const handleColorChange = (key: keyof Theme['colors'], value: string) => {
    setSelectedTheme({
      ...selectedTheme,
      colors: { ...selectedTheme.colors, [key]: value },
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Theme Customization</h2>

      <div className="mb-6">
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={autoMode}
            onChange={(e) => setAutoMode(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Auto dark/light mode (follows system preference)</span>
        </label>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presetThemes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => {
                setSelectedTheme(theme);
                setAutoMode(false);
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedTheme.name === theme.name ? 'border-blue-500 shadow-lg' : 'border-gray-300'
              }`}
              style={{ backgroundColor: theme.colors.background }}
            >
              <div className="font-semibold mb-2" style={{ color: theme.colors.text }}>
                {theme.name}
              </div>
              <div className="flex gap-1">
                {Object.values(theme.colors).slice(0, 4).map((color, i) => (
                  <div key={i} className="w-6 h-6 rounded" style={{ backgroundColor: color }} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Custom Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(selectedTheme.colors).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <input
                type="color"
                value={value}
                onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <div className="flex-1">
                <div className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                  className="w-full px-2 py-1 border rounded text-xs font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-6 rounded-lg" style={{ backgroundColor: selectedTheme.colors.surface }}>
        <h3 className="font-semibold mb-3" style={{ color: selectedTheme.colors.text }}>
          Preview
        </h3>
        <div className="space-y-3">
          <button
            className="px-4 py-2 rounded font-medium text-white"
            style={{ backgroundColor: selectedTheme.colors.primary }}
          >
            Primary Button
          </button>
          <button
            className="px-4 py-2 rounded font-medium text-white ml-2"
            style={{ backgroundColor: selectedTheme.colors.secondary }}
          >
            Secondary Button
          </button>
          <div
            className="p-4 rounded border"
            style={{
              backgroundColor: selectedTheme.colors.background,
              borderColor: selectedTheme.colors.border,
              color: selectedTheme.colors.text,
            }}
          >
            <p className="mb-2">Sample text content</p>
            <p style={{ color: selectedTheme.colors.textSecondary }}>Secondary text</p>
          </div>
        </div>
      </div>
    </div>
  );
};
