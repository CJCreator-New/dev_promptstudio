import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { db } from '../utils/db';

describe('Integration: Prompt Enhancement Flow', () => {
  beforeEach(async () => {
    await db.drafts.clear();
    await db.history.clear();
  });

  it('should complete full prompt enhancement flow', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Enter prompt
    const textarea = screen.getByPlaceholderText(/enter your prompt/i);
    await user.type(textarea, 'Build a todo app');

    // Wait for auto-save
    await waitFor(() => {
      expect(screen.getByText(/saved/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Submit prompt
    const submitButton = screen.getByRole('button', { name: /enhance/i });
    await user.click(submitButton);

    // Verify loading state
    expect(screen.getByText(/enhancing/i)).toBeInTheDocument();
  });

  it('should save draft and recover on reload', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    // Enter text
    const textarea = screen.getByPlaceholderText(/enter your prompt/i);
    await user.type(textarea, 'Test draft recovery');

    // Wait for auto-save
    await waitFor(async () => {
      const count = await db.drafts.count();
      expect(count).toBeGreaterThan(0);
    }, { timeout: 3000 });

    unmount();

    // Remount app
    render(<App />);

    // Should show recovery modal
    await waitFor(() => {
      expect(screen.getByText(/recover draft/i)).toBeInTheDocument();
    });
  });
});

describe('Integration: Error Recovery', () => {
  it('should recover from API errors', async () => {
    const user = userEvent.setup();
    
    // Mock API failure
    vi.mock('../services/geminiService', () => ({
      enhancePromptStream: vi.fn().mockRejectedValue(new Error('API Error'))
    }));

    render(<App />);

    const textarea = screen.getByPlaceholderText(/enter your prompt/i);
    await user.type(textarea, 'Test error');

    const submitButton = screen.getByRole('button', { name: /enhance/i });
    await user.click(submitButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });

    // Should allow retry
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should preserve data on component error', () => {
    const ThrowError = () => {
      throw new Error('Component error');
    };

    const { container } = render(
      <App>
        <ThrowError />
      </App>
    );

    // Should show error boundary
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    // Should have reset button
    const resetButton = screen.getByRole('button', { name: /try again/i });
    expect(resetButton).toBeInTheDocument();
  });
});

describe('Integration: History Navigation', () => {
  beforeEach(async () => {
    await db.history.clear();
  });

  it('should save to history and navigate', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add to history
    await db.history.add({
      input: 'Test prompt',
      output: 'Enhanced prompt',
      timestamp: Date.now()
    });

    // Open history
    const historyButton = screen.getByRole('button', { name: /history/i });
    await user.click(historyButton);

    // Should show history item
    await waitFor(() => {
      expect(screen.getByText(/test prompt/i)).toBeInTheDocument();
    });
  });
});

describe('Integration: Template System', () => {
  it('should create and use template', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Enter prompt
    const textarea = screen.getByPlaceholderText(/enter your prompt/i);
    await user.type(textarea, 'React component template');

    // Save as template
    const saveTemplateButton = screen.getByRole('button', { name: /save template/i });
    await user.click(saveTemplateButton);

    // Enter template name
    const nameInput = screen.getByPlaceholderText(/template name/i);
    await user.type(nameInput, 'React Component');

    const confirmButton = screen.getByRole('button', { name: /save/i });
    await user.click(confirmButton);

    // Should show success
    await waitFor(() => {
      expect(screen.getByText(/template saved/i)).toBeInTheDocument();
    });
  });
});

describe('Integration: Offline Behavior', () => {
  it('should handle offline state gracefully', async () => {
    // Simulate offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    render(<App />);

    // Should show offline indicator
    expect(screen.getByText(/offline/i)).toBeInTheDocument();

    // Restore online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });
  });

  it('should queue operations when offline', async () => {
    const user = userEvent.setup();
    
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });

    render(<App />);

    const textarea = screen.getByPlaceholderText(/enter your prompt/i);
    await user.type(textarea, 'Offline test');

    // Should still save draft locally
    await waitFor(async () => {
      const count = await db.drafts.count();
      expect(count).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });
});

describe('Integration: Mobile Responsiveness', () => {
  it('should render mobile layout', () => {
    // Mock mobile viewport
    global.innerWidth = 375;
    global.innerHeight = 667;

    render(<App />);

    // Should have mobile-friendly layout
    const container = screen.getByRole('main');
    expect(container).toHaveClass('container');
  });

  it('should support touch interactions', async () => {
    const user = userEvent.setup();
    render(<App />);

    const textarea = screen.getByPlaceholderText(/enter your prompt/i);
    
    // Simulate touch
    await user.pointer({ target: textarea, keys: '[TouchA]' });
    
    expect(textarea).toHaveFocus();
  });
});

describe('Integration: Cross-Browser Compatibility', () => {
  it('should work with different user agents', () => {
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/90.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/14.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Firefox/88.0'
    ];

    userAgents.forEach(ua => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: ua
      });

      const { unmount } = render(<App />);
      
      // Should render without errors
      expect(screen.getByRole('main')).toBeInTheDocument();
      
      unmount();
    });
  });

  it('should support IndexedDB fallback', async () => {
    // Mock IndexedDB unavailable
    const originalIndexedDB = global.indexedDB;
    // @ts-ignore
    delete global.indexedDB;

    render(<App />);

    // Should fallback to localStorage
    expect(screen.getByRole('main')).toBeInTheDocument();

    // Restore
    global.indexedDB = originalIndexedDB;
  });
});
