import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnimatedInput } from '../AnimatedInput';

describe('AnimatedInput Component', () => {
  describe('Rendering', () => {
    it('renders with label', () => {
      render(<AnimatedInput label="Email" value="" onChange={() => {}} />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders with helper text', () => {
      render(<AnimatedInput label="Email" value="" onChange={() => {}} helperText="Enter your email" />);
      expect(screen.getByText('Enter your email')).toBeInTheDocument();
    });

    it('shows error message', () => {
      render(<AnimatedInput label="Email" value="" onChange={() => {}} error="Invalid email" />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('shows success icon', () => {
      render(<AnimatedInput label="Email" value="test@example.com" onChange={() => {}} success />);
      expect(screen.getByRole('textbox')).toHaveClass('border-green-500/50');
    });
  });

  describe('Interactions', () => {
    it('calls onChange when typing', async () => {
      const handleChange = jest.fn();
      render(<AnimatedInput label="Email" value="" onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'test');
      
      expect(handleChange).toHaveBeenCalledTimes(4);
    });

    it('applies focus styles on focus', () => {
      render(<AnimatedInput label="Email" value="" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      
      fireEvent.focus(input);
      expect(input).toHaveClass('focus:ring-2');
    });

    it('shows error animation on error', () => {
      const { rerender } = render(<AnimatedInput label="Email" value="" onChange={() => {}} />);
      
      rerender(<AnimatedInput label="Email" value="" onChange={() => {}} error="Required" />);
      expect(screen.getByRole('textbox')).toHaveClass('animate-field-error');
    });
  });

  describe('Validation', () => {
    it('validates on blur', async () => {
      const onValidate = jest.fn(() => false);
      render(<AnimatedInput label="Email" value="" onChange={() => {}} onValidate={onValidate} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);
      
      await waitFor(() => expect(onValidate).toHaveBeenCalled());
    });

    it('shows error state for invalid input', () => {
      render(<AnimatedInput label="Email" value="invalid" onChange={() => {}} error="Invalid email" />);
      expect(screen.getByRole('textbox')).toHaveClass('border-red-500/50');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria attributes', () => {
      render(<AnimatedInput label="Email" value="" onChange={() => {}} error="Error" />);
      const input = screen.getByRole('textbox');
      
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('associates error with input', () => {
      render(<AnimatedInput label="Email" value="" onChange={() => {}} error="Error message" />);
      const input = screen.getByRole('textbox');
      
      expect(input).toHaveAttribute('aria-describedby');
    });
  });
});
