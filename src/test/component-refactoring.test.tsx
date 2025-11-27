import { describe, test, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, fireEvent } from './test-utils';
import { usePromptSuggestions } from '../hooks/usePromptSuggestions';
import { useDebounce } from '../hooks/useDebounce';
import { Button, Input, Select } from '../components/atomic';
import { DomainType } from '../types';

// Property 26: Custom Hook Extraction
describe('Property 26: Custom Hook Extraction', () => {
  test('usePromptSuggestions extracts complex logic correctly', () => {
    fc.assert(fc.property(
      fc.record({
        input: fc.string({ maxLength: 100 }),
        domain: fc.constantFrom(...Object.values(DomainType)),
        isBooting: fc.boolean()
      }),
      ({ input, domain, isBooting }) => {
        const TestComponent = () => {
          const suggestions = usePromptSuggestions(input, domain, isBooting);
          
          return (
            <div data-testid="suggestions">
              {suggestions.map((suggestion, i) => (
                <span key={i} data-testid={`suggestion-${i}`}>
                  {suggestion}
                </span>
              ))}
            </div>
          );
        };

        const { getByTestId, queryAllByTestId } = render(<TestComponent />);
        const suggestionsContainer = getByTestId('suggestions');
        const suggestionElements = queryAllByTestId(/suggestion-\d+/);
        
        expect(suggestionsContainer).toBeInTheDocument();
        
        if (isBooting) {
          expect(suggestionElements).toHaveLength(0);
        } else {
          expect(suggestionElements.length).toBeLessThanOrEqual(10);
        }
        
        return true;
      }
    ));
  });

  test('useDebounce hook manages value delays correctly', async () => {
    fc.assert(fc.property(
      fc.record({
        initialValue: fc.string({ maxLength: 20 }),
        newValue: fc.string({ maxLength: 20 }),
        delay: fc.integer({ min: 50, max: 200 })
      }),
      async ({ initialValue, newValue, delay }) => {
        const TestComponent = ({ value }: { value: string }) => {
          const debouncedValue = useDebounce(value, delay);
          
          return (
            <div>
              <span data-testid="immediate">{value}</span>
              <span data-testid="debounced">{debouncedValue}</span>
            </div>
          );
        };

        const { getByTestId, rerender } = render(<TestComponent value={initialValue} />);
        
        expect(getByTestId('immediate').textContent).toBe(initialValue);
        expect(getByTestId('debounced').textContent).toBe(initialValue);
        
        rerender(<TestComponent value={newValue} />);
        
        expect(getByTestId('immediate').textContent).toBe(newValue);
        // Debounced value should still be the initial value immediately after change
        expect(getByTestId('debounced').textContent).toBe(initialValue);
        
        return true;
      }
    ));
  });

  test('atomic components are properly extracted and reusable', () => {
    fc.assert(fc.property(
      fc.record({
        buttonText: fc.string({ minLength: 1, maxLength: 20 }),
        inputValue: fc.string({ maxLength: 50 }),
        selectOptions: fc.array(
          fc.record({
            value: fc.string({ minLength: 1, maxLength: 10 }),
            label: fc.string({ minLength: 1, maxLength: 20 })
          }),
          { minLength: 1, maxLength: 5 }
        )
      }),
      ({ buttonText, inputValue, selectOptions }) => {
        const TestForm = () => (
          <div>
            <Button data-testid="button">{buttonText}</Button>
            <Input data-testid="input" defaultValue={inputValue} />
            <Select data-testid="select" options={selectOptions} />
          </div>
        );

        const { getByTestId } = render(<TestForm />);
        
        const button = getByTestId('button');
        const input = getByTestId('input') as HTMLInputElement;
        const select = getByTestId('select') as HTMLSelectElement;
        
        expect(button.textContent).toBe(buttonText);
        expect(input.value).toBe(inputValue);
        expect(select.options.length).toBe(selectOptions.length);
        
        // Verify components have proper accessibility attributes
        expect(button.className).toContain('focus:ring-2');
        expect(input.className).toContain('focus:ring-2');
        expect(select.className).toContain('focus:ring-2');
        
        return true;
      }
    ));
  });
});

describe('Atomic Components', () => {
  describe('Button', () => {
    test('renders with different variants and sizes', () => {
      fc.assert(fc.property(
        fc.record({
          variant: fc.constantFrom('primary', 'secondary', 'danger'),
          size: fc.constantFrom('sm', 'md', 'lg'),
          text: fc.string({ minLength: 1, maxLength: 20 })
        }),
        ({ variant, size, text }) => {
          const { getByRole } = render(
            <Button variant={variant} size={size}>
              {text}
            </Button>
          );
          
          const button = getByRole('button');
          expect(button.textContent).toBe(text);
          expect(button.className).toContain('focus:ring-2');
          
          return true;
        }
      ));
    });

    test('handles loading state correctly', () => {
      const { getByRole } = render(
        <Button loading>Loading Button</Button>
      );
      
      const button = getByRole('button');
      expect(button).toBeDisabled();
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    test('handles click events', () => {
      const handleClick = vi.fn();
      
      const { getByRole } = render(
        <Button onClick={handleClick}>Click Me</Button>
      );
      
      fireEvent.click(getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input', () => {
    test('renders with label and error states', () => {
      fc.assert(fc.property(
        fc.record({
          label: fc.string({ minLength: 1, maxLength: 20 }),
          error: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
          value: fc.string({ maxLength: 50 })
        }),
        ({ label, error, value }) => {
          const { getByLabelText, queryByRole } = render(
            <Input label={label} error={error} defaultValue={value} />
          );
          
          const input = getByLabelText(label) as HTMLInputElement;
          expect(input.value).toBe(value);
          
          if (error) {
            expect(queryByRole('alert')).toBeInTheDocument();
            expect(input.getAttribute('aria-invalid')).toBe('true');
          } else {
            expect(input.getAttribute('aria-invalid')).toBe('false');
          }
          
          return true;
        }
      ));
    });
  });

  describe('Select', () => {
    test('renders options correctly', () => {
      const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ];
      
      const { getByRole } = render(
        <Select options={options} />
      );
      
      const select = getByRole('combobox') as HTMLSelectElement;
      expect(select.options.length).toBe(2);
      expect(select.options[0].value).toBe('option1');
      expect(select.options[1].value).toBe('option2');
    });

    test('handles selection changes', () => {
      const handleChange = vi.fn();
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' }
      ];
      
      const { getByRole } = render(
        <Select options={options} onChange={handleChange} />
      );
      
      const select = getByRole('combobox');
      fireEvent.change(select, { target: { value: 'b' } });
      
      expect(handleChange).toHaveBeenCalled();
    });
  });
});