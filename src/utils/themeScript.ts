/**
 * Inline script to prevent flash of incorrect theme
 * This should be injected in <head> before any content renders
 */

export const themeScript = `
(function() {
  const STORAGE_KEY = 'devprompt-theme';
  
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  function applyTheme(theme) {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    document.documentElement.setAttribute('data-theme', resolved);
    
    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', resolved === 'dark' ? '#0f172a' : '#ffffff');
    }
  }
  
  // Get stored theme or default to system
  const stored = localStorage.getItem(STORAGE_KEY) || 'system';
  applyTheme(stored);
})();
`;

// For use in index.html
export const getThemeScriptTag = () => {
  return `<script>${themeScript}</script>`;
};
