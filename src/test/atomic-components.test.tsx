import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Input, Select, Modal, Tooltip } from '../components/atomic';

describe('Atomic Components Unit Tests', () => {
  describe('Button Component', () => {
    it('should render with primary variant', () => {
      render(<Button variant="primary">Click me</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveTextContent('Click me');
      expect(button.className).toContain('btn-primary');
    });

    it('should render with secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      
      expect(button.className).toContain('btn-secondary');
    });

    it('should render with danger variant', () => {
      render(<Button variant="danger">Delete</Button>);
      const button = screen.getByRole('button');
      
      expect(button.className).toContain('btn-primary');
      expect(button.className).toContain('bg-red-600');
    });

    it('should handle different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button').className).toContain('px-3');
      
      rerender(<Button size="md">Medium</Button>);
      expect(screen.getByRole('button').className).toContain('px-4');
      
      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button').className).toContain('px-6');
    });

    it('should show loading state', () => {
      render(<Button loading>Loading</Button>);
      
      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByRole('button').querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should call onClick handler', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input Component', () => {
    it('should render with label', () => {
      render(<Input label="Username" />);
      
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('should display validation error', () => {
      render(<Input label="Email" error="Invalid email" />);
      
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should display helper text', () => {
      render(<Input label="Password" helperText="Min 8 characters" />);
      
      expect(screen.getByText('Min 8 characters')).toBeInTheDocument();
    });

    it('should apply error styling when error is present', () => {
      render(<Input error="Error message" />);
      const input = screen.getByRole('textbox');
      
      expect(input.className).toContain('input-error');
    });

    it('should apply valid styling when no error', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      
      expect(input.className).toContain('input-valid');
    });

    it('should handle value changes', async () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'test');
      
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Select Component', () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' }
    ];

    it('should render with options', () => {
      render(<Select options={options} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select.querySelectorAll('option')).toHaveLength(3);
    });

    it('should render with label', () => {
      render(<Select label="Choose option" options={options} />);
      
      expect(screen.getByLabelText('Choose option')).toBeInTheDocument();
    });

    it('should handle keyboard navigation', async () => {
      render(<Select options={options} />);
      
      const select = screen.getByRole('combobox');
      select.focus();
      
      await userEvent.keyboard('{ArrowDown}');
      expect(document.activeElement).toBe(select);
    });

    it('should display error state', () => {
      render(<Select options={options} error="Required field" />);
      
      expect(screen.getByRole('alert')).toHaveTextContent('Required field');
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should handle value changes', () => {
      const handleChange = vi.fn();
      render(<Select options={options} onChange={handleChange} />);
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '2' } });
      
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Modal Component', () => {
    it('should render when open', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(
        <Modal isOpen={false} onClose={() => {}} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should call onClose when close button clicked', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );
      
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);
      
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('should close on escape key', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} closeOnEscape={true}>
          <p>Content</p>
        </Modal>
      );
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(handleClose).toHaveBeenCalled();
    });

    it('should trap focus within modal', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test">
          <button>First</button>
          <button>Second</button>
          <button>Last</button>
        </Modal>
      );
      
      const buttons = screen.getAllByRole('button');
      const lastButton = buttons[buttons.length - 1];
      
      lastButton.focus();
      await userEvent.tab();
      
      // Should cycle back to first focusable element
      expect(document.activeElement).toBe(buttons[0]);
    });

    it('should restore focus on close', async () => {
      const trigger = document.createElement('button');
      document.body.appendChild(trigger);
      trigger.focus();
      
      const { rerender } = render(
        <Modal isOpen={true} onClose={() => {}}>
          <p>Content</p>
        </Modal>
      );
      
      rerender(
        <Modal isOpen={false} onClose={() => {}}>
          <p>Content</p>
        </Modal>
      );
      
      await waitFor(() => {
        expect(document.activeElement).toBe(trigger);
      });
      
      document.body.removeChild(trigger);
    });

    it('should apply different sizes', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={() => {}} size="sm">
          <p>Small</p>
        </Modal>
      );
      
      expect(screen.getByRole('dialog').querySelector('.max-w-sm')).toBeInTheDocument();
      
      rerender(
        <Modal isOpen={true} onClose={() => {}} size="lg">
          <p>Large</p>
        </Modal>
      );
      
      expect(screen.getByRole('dialog').querySelector('.max-w-2xl')).toBeInTheDocument();
    });
  });

  describe('Tooltip Component', () => {
    it('should render trigger element', () => {
      render(
        <Tooltip content="Helpful tip">
          <button>Hover me</button>
        </Tooltip>
      );
      
      expect(screen.getByRole('button')).toHaveTextContent('Hover me');
    });

    it('should show tooltip on hover', async () => {
      render(
        <Tooltip content="Helpful tip">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button');
      await userEvent.hover(button);
      
      await waitFor(() => {
        expect(screen.getByText('Helpful tip')).toBeInTheDocument();
      });
    });

    it('should hide tooltip on unhover', async () => {
      render(
        <Tooltip content="Helpful tip">
          <button>Hover me</button>
        </Tooltip>
      );
      
      const button = screen.getByRole('button');
      await userEvent.hover(button);
      
      await waitFor(() => {
        expect(screen.getByText('Helpful tip')).toBeInTheDocument();
      });
      
      await userEvent.unhover(button);
      
      await waitFor(() => {
        expect(screen.queryByText('Helpful tip')).not.toBeInTheDocument();
      });
    });
  });
});