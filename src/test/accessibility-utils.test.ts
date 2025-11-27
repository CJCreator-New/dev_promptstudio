import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { trapFocus, restoreFocus, announceToScreenReader, generateAriaLabel } from '../utils/accessibility';

describe('Accessibility Utilities', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('trapFocus', () => {
    test('focuses first focusable element', () => {
      container.innerHTML = `
        <button id="first">First</button>
        <input id="input" />
        <button id="last">Last</button>
      `;

      trapFocus(container);
      
      expect(document.activeElement?.id).toBe('first');
    });

    test('handles Tab key to cycle focus', () => {
      container.innerHTML = `
        <button id="first">First</button>
        <button id="last">Last</button>
      `;

      const cleanup = trapFocus(container);
      const firstButton = container.querySelector('#first') as HTMLElement;
      const lastButton = container.querySelector('#last') as HTMLElement;

      // Simulate Tab key on last element
      lastButton.focus();
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      container.dispatchEvent(tabEvent);

      cleanup();
    });

    test('returns cleanup function', () => {
      container.innerHTML = '<button>Test</button>';
      
      const cleanup = trapFocus(container);
      expect(typeof cleanup).toBe('function');
      
      cleanup();
    });
  });

  describe('restoreFocus', () => {
    test('restores focus to previous element', () => {
      const button = document.createElement('button');
      document.body.appendChild(button);
      button.focus();
      
      const otherButton = document.createElement('button');
      document.body.appendChild(otherButton);
      otherButton.focus();
      
      restoreFocus(button);
      expect(document.activeElement).toBe(button);
      
      document.body.removeChild(button);
      document.body.removeChild(otherButton);
    });

    test('handles null previous element gracefully', () => {
      expect(() => restoreFocus(null)).not.toThrow();
    });

    test('handles removed element gracefully', () => {
      const button = document.createElement('button');
      expect(() => restoreFocus(button)).not.toThrow();
    });
  });

  describe('announceToScreenReader', () => {
    test('creates announcement element with correct attributes', () => {
      const originalAppendChild = document.body.appendChild;
      const originalRemoveChild = document.body.removeChild;
      
      let announcementElement: HTMLElement | null = null;
      
      document.body.appendChild = vi.fn((element) => {
        announcementElement = element;
        return element;
      });
      
      document.body.removeChild = vi.fn();

      announceToScreenReader('Test message', 'assertive');

      expect(announcementElement?.getAttribute('aria-live')).toBe('assertive');
      expect(announcementElement?.getAttribute('aria-atomic')).toBe('true');
      expect(announcementElement?.textContent).toBe('Test message');
      expect(announcementElement?.className).toBe('sr-only');

      document.body.appendChild = originalAppendChild;
      document.body.removeChild = originalRemoveChild;
    });

    test('defaults to polite priority', () => {
      const originalAppendChild = document.body.appendChild;
      let announcementElement: HTMLElement | null = null;
      
      document.body.appendChild = vi.fn((element) => {
        announcementElement = element;
        return element;
      });
      
      document.body.removeChild = vi.fn();

      announceToScreenReader('Test message');

      expect(announcementElement?.getAttribute('aria-live')).toBe('polite');

      document.body.appendChild = originalAppendChild;
    });
  });

  describe('generateAriaLabel', () => {
    test('returns base label when no context provided', () => {
      expect(generateAriaLabel('Save')).toBe('Save');
    });

    test('combines base label with context', () => {
      expect(generateAriaLabel('Save', 'document')).toBe('Save, document');
    });

    test('handles empty context', () => {
      expect(generateAriaLabel('Save', '')).toBe('Save');
    });
  });
});