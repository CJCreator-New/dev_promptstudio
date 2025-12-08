import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle, ThemeToggleCompact } from '../ThemeToggle';
import { ThemeProvider } from '../../hooks/useTheme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ThemeToggle Component', () => {
  describe('Rendering', () => {
    it('renders all theme options', () => {
      renderWithTheme(<ThemeToggle />);
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
    });

    it('highlights active theme', () => {
      renderWithTheme(<ThemeToggle />);
      const systemButton = screen.getByRole('button', { name: /system/i });
      expect(systemButton).toHaveClass('bg-[var(--brand-primary)]');
    });
  });

  describe('Interactions', () => {
    it('switches to light theme', () => {
      renderWithTheme(<ThemeToggle />);
      fireEvent.click(screen.getByRole('button', { name: /light/i }));
      expect(screen.getByRole('button', { name: /light/i })).toHaveClass('bg-[var(--brand-primary)]');
    });

    it('persists theme to localStorage', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      renderWithTheme(<ThemeToggle />);
      
      fireEvent.click(screen.getByRole('button', { name: /light/i }));
      expect(setItemSpy).toHaveBeenCalledWith('devprompt-theme', 'light');
      
      setItemSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('has aria-pressed state', () => {
      renderWithTheme(<ThemeToggle />);
      expect(screen.getByRole('button', { name: /system/i })).toHaveAttribute('aria-pressed', 'true');
    });
  });
});

describe('ThemeToggleCompact', () => {
  it('renders compact toggle', () => {
    renderWithTheme(<ThemeToggleCompact />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles theme', () => {
    renderWithTheme(<ThemeToggleCompact />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
  });
});
