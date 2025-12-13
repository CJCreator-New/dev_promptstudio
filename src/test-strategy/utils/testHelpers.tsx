import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider } from '@/hooks/useTheme';

// Custom render with providers
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Wait for async operations
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0));

// Mock user with delay
export const createMockUser = () => ({
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
});

// Generate test data
export const generatePromptHistory = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `history-${i}`,
    original: `Original prompt ${i}`,
    enhanced: `Enhanced prompt ${i}`,
    timestamp: Date.now() - i * 1000,
    domain: 'Frontend',
    mode: 'Detailed',
  }));

// Accessibility helpers
export const checkA11y = async (container: HTMLElement) => {
  const { axe } = await import('axe-core');
  const results = await axe.run(container);
  return results.violations;
};

// Performance helpers
export const measureRenderTime = (fn: () => void) => {
  const start = performance.now();
  fn();
  return performance.now() - start;
};

export * from '@testing-library/react';
