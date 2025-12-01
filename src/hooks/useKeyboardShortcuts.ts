import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!e.key) return;
      
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        
        if (e.key.toLowerCase() === shortcut.key.toLowerCase() && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts]);
};

export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'e',
    ctrl: true,
    description: 'Enhance prompt',
    action: () => {}
  },
  {
    key: 's',
    ctrl: true,
    description: 'Save project',
    action: () => {}
  },
  {
    key: 'k',
    ctrl: true,
    description: 'Open API keys',
    action: () => {}
  },
  {
    key: '/',
    ctrl: true,
    description: 'Focus search',
    action: () => {}
  }
];
