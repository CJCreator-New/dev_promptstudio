import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('renders with icon', () => {
      const Icon = () => <span data-testid="icon">Icon</span>;
      render(<Button icon={<Icon />}>Button</Button>);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('applies variant styles', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-indigo-600');
      
      rerender(<Button variant="danger">Danger</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-red-600');
    });
  });

  describe('States', () => {
    it('shows loading state', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows success state', () => {
      render(<Button success>Success</Button>);
      expect(screen.getByRole('button')).toHaveClass('animate-button-success');
    });

    it('disables button when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Click</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies press animation', async () => {
      render(<Button>Press</Button>);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      await waitFor(() => expect(button).toHaveClass('scale-95'));
    });
  });
});
